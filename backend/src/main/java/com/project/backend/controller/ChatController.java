package com.project.backend.controller;

import com.project.backend.dto.ChatConversationResponse;
import com.project.backend.dto.ChatMessageResponse;
import com.project.backend.dto.ChatParticipantResponse;
import com.project.backend.dto.CreateChatConversationRequest;
import com.project.backend.dto.SendChatMessageRequest;
import com.project.backend.config.ChatWebSocketHandler;
import com.project.backend.service.ChatService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/chats")
public class ChatController {
    private final ChatService chatService;
    private final ChatWebSocketHandler chatWebSocketHandler;

    @GetMapping("/conversations")
    public List<ChatConversationResponse> conversations(Authentication authentication) {
        return chatService.conversations(authentication);
    }

    @GetMapping("/me")
    public ChatParticipantResponse me(Authentication authentication) {
        return chatService.me(authentication);
    }

    @PostMapping("/conversations")
    public ChatConversationResponse create(@Valid @RequestBody CreateChatConversationRequest request,
                                           Authentication authentication) {
        ChatConversationResponse response = chatService.create(request, authentication);
        chatWebSocketHandler.broadcastConversation(response);
        return response;
    }

    @GetMapping("/conversations/{conversationId}/messages")
    public List<ChatMessageResponse> messages(@PathVariable Long conversationId, Authentication authentication) {
        return chatService.messages(conversationId, authentication);
    }

    @PostMapping("/conversations/{conversationId}/messages")
    public ChatMessageResponse send(@PathVariable Long conversationId, @Valid @RequestBody SendChatMessageRequest request,
                                    Authentication authentication) {
        ChatMessageResponse response = chatService.send(conversationId, request, authentication);
        chatWebSocketHandler.broadcast(response);
        return response;
    }

    @DeleteMapping("/messages/{messageId}")
    public ResponseEntity<Void> delete(@PathVariable Long messageId, Authentication authentication) {
        ChatMessageResponse response = chatService.deleteMessage(messageId, authentication);
        chatWebSocketHandler.broadcast(response);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/users")
    public List<ChatParticipantResponse> users(@RequestParam(required = false) String search) {
        return chatService.users(search);
    }
}
