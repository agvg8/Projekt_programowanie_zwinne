package com.project.backend.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.backend.dto.ChatMessageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Component
@RequiredArgsConstructor
public class ChatWebSocketHandler extends TextWebSocketHandler {
    private final ObjectMapper objectMapper;
    private final Map<Long, Set<WebSocketSession>> rooms = new ConcurrentHashMap<>();
    private final Map<String, Set<Long>> subscriptions = new ConcurrentHashMap<>();

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws IOException {
        Map<?, ?> command = objectMapper.readValue(message.getPayload(), Map.class);
        Object conversation = command.get("conversationId");
        if (!(conversation instanceof Number number)) {
            return;
        }
        Long conversationId = number.longValue();
        Object actionValue = command.get("action");
        String action = String.valueOf(actionValue == null ? "subscribe" : actionValue);
        if ("unsubscribe".equals(action)) {
            removeSubscription(session, conversationId);
        } else {
            rooms.computeIfAbsent(conversationId, ignored -> ConcurrentHashMap.newKeySet()).add(session);
            subscriptions.computeIfAbsent(session.getId(), ignored -> ConcurrentHashMap.newKeySet()).add(conversationId);
            session.sendMessage(new TextMessage(objectMapper.writeValueAsString(Map.of("type", "subscribed", "conversationId", conversationId))));
        }
    }

    public void broadcast(ChatMessageResponse message) {
        Set<WebSocketSession> sessions = rooms.getOrDefault(message.conversationId(), Set.of());
        String payload;
        try {
            payload = objectMapper.writeValueAsString(Map.of("type", "message", "payload", message));
        } catch (IOException exception) {
            return;
        }
        sessions.forEach(session -> {
            try {
                if (session.isOpen()) {
                    session.sendMessage(new TextMessage(payload));
                }
            } catch (IOException ignored) {
                // Disconnected clients are cleaned up on the next close callback.
            }
        });
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        subscriptions.remove(session.getId());
        rooms.values().forEach(sessions -> sessions.remove(session));
    }

    private void removeSubscription(WebSocketSession session, Long conversationId) {
        Set<WebSocketSession> sessions = rooms.get(conversationId);
        if (sessions != null) {
            sessions.remove(session);
        }
        Set<Long> userSubscriptions = subscriptions.get(session.getId());
        if (userSubscriptions != null) {
            userSubscriptions.remove(conversationId);
        }
    }
}
