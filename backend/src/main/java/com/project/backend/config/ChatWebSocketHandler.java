package com.project.backend.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.backend.dto.ChatConversationResponse;
import com.project.backend.dto.ChatMessageResponse;
import com.project.backend.model.ChatConversation;
import com.project.backend.model.Uzytkownik;
import com.project.backend.repository.ChatConversationRepository;
import com.project.backend.repository.UzytkownikRepository;
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
    private final ChatConversationRepository conversationRepository;
    private final UzytkownikRepository userRepository;
    private final Map<Long, Set<WebSocketSession>> rooms = new ConcurrentHashMap<>();
    private final Map<String, Set<Long>> subscriptions = new ConcurrentHashMap<>();
    private final Map<Integer, Set<WebSocketSession>> userSessions = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws IOException {
        Uzytkownik user = sessionUser(session);
        if (user == null) {
            session.close(CloseStatus.NOT_ACCEPTABLE.withReason("Nieprawidłowy użytkownik"));
            return;
        }
        userSessions.computeIfAbsent(user.getUzytkownikId(), ignored -> ConcurrentHashMap.newKeySet()).add(session);
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws IOException {
        Map<?, ?> command = objectMapper.readValue(message.getPayload(), Map.class);
        Object conversation = command.get("conversationId");
        if (!(conversation instanceof Number number)) {
            return;
        }
        Long conversationId = number.longValue();
        Uzytkownik user = sessionUser(session);
        ChatConversation targetConversation = conversationRepository.findWithParticipantsById(conversationId).orElse(null);
        if (user == null || targetConversation == null || targetConversation.getParticipants().stream()
                .noneMatch(participant -> participant.getUzytkownikId().equals(user.getUzytkownikId()))) {
            return;
        }
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
        ChatConversation conversation = conversationRepository.findWithParticipantsById(message.conversationId()).orElse(null);
        if (conversation == null) return;
        Set<WebSocketSession> sessions = conversation.getParticipants().stream()
                .flatMap(participant -> userSessions.getOrDefault(participant.getUzytkownikId(), Set.of()).stream())
                .collect(java.util.stream.Collectors.toSet());
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

    public void broadcastConversation(ChatConversationResponse conversation) {
        Set<WebSocketSession> sessions = conversation.participants().stream()
                .flatMap(participant -> userSessions.getOrDefault(participant.id(), Set.of()).stream())
                .collect(java.util.stream.Collectors.toSet());
        try {
            String payload = objectMapper.writeValueAsString(Map.of("type", "conversation", "payload", conversation));
            sessions.forEach(session -> send(session, payload));
        } catch (IOException ignored) {
            // Ignore a disconnected client.
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        subscriptions.remove(session.getId());
        rooms.values().forEach(sessions -> sessions.remove(session));
        userSessions.values().forEach(sessions -> sessions.remove(session));
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

    private Uzytkownik sessionUser(WebSocketSession session) {
        String email = (String) session.getAttributes().get("chatEmail");
        if (email != null) {
            Uzytkownik byEmail = userRepository.findByEmailIgnoreCase(email).orElse(null);
            if (byEmail != null) return byEmail;
        }
        String username = (String) session.getAttributes().get("chatUsername");
        if (username != null && username.contains("_")) {
            String[] parts = username.split("_", 2);
            return userRepository.findByImieIgnoreCaseAndNazwiskoIgnoreCase(parts[0], parts[1]).orElse(null);
        }
        return null;
    }

    private void send(WebSocketSession session, String payload) {
        try {
            if (session.isOpen()) session.sendMessage(new TextMessage(payload));
        } catch (IOException ignored) {
            // Disconnected clients are removed by the close callback.
        }
    }
}
