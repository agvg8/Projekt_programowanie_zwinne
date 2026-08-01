package com.project.backend.service;

import com.project.backend.dto.ChatConversationResponse;
import com.project.backend.dto.ChatMessageResponse;
import com.project.backend.dto.ChatParticipantResponse;
import com.project.backend.dto.CreateChatConversationRequest;
import com.project.backend.dto.SendChatMessageRequest;
import com.project.backend.model.ChatConversation;
import com.project.backend.model.ChatConversationType;
import com.project.backend.model.ChatMessage;
import com.project.backend.model.Uzytkownik;
import com.project.backend.repository.ChatConversationRepository;
import com.project.backend.repository.ChatMessageRepository;
import com.project.backend.repository.UzytkownikRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Comparator;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatService {
    private final ChatConversationRepository conversationRepository;
    private final ChatMessageRepository messageRepository;
    private final UzytkownikRepository userRepository;

    @Transactional(readOnly = true)
    public List<ChatConversationResponse> conversations(Authentication authentication) {
        Uzytkownik user = currentUser(authentication);
        return conversationRepository.findAllForUser(user.getUzytkownikId()).stream().map(this::toConversation).toList();
    }

    @Transactional(readOnly = true)
    public List<ChatMessageResponse> messages(Long conversationId, Authentication authentication) {
        Uzytkownik user = currentUser(authentication);
        ChatConversation conversation = conversation(conversationId, user);
        return messageRepository.findByConversationIdOrderBySentAtAsc(conversation.getId()).stream().map(this::toMessage).toList();
    }

    @Transactional
    public ChatConversationResponse create(CreateChatConversationRequest request, Authentication authentication) {
        Uzytkownik current = currentUser(authentication);
        ChatConversationType type = ChatConversationType.valueOf(request.type().toUpperCase());
        Set<Uzytkownik> participants = userRepository.findAllById(request.participantIds()).stream().collect(Collectors.toSet());
        participants.add(current);

        if (type == ChatConversationType.DIRECT && participants.size() != 2) {
            throw new IllegalArgumentException("Rozmowa prywatna musi mieć dokładnie dwóch uczestników");
        }

        ChatConversation conversation = new ChatConversation();
        conversation.setType(type);
        conversation.setName(type == ChatConversationType.GROUP ? request.name() : null);
        conversation.setParticipants(participants);
        conversation.setUpdatedAt(Instant.now());
        return toConversation(conversationRepository.save(conversation));
    }

    @Transactional
    public ChatMessageResponse send(Long conversationId, SendChatMessageRequest request, Authentication authentication) {
        Uzytkownik sender = currentUser(authentication);
        ChatConversation conversation = conversation(conversationId, sender);
        ChatMessage message = new ChatMessage();
        message.setSender(sender);
        message.setContent(request.content().trim());
        message.setSentAt(Instant.now());
        conversation.addMessage(message);
        conversationRepository.save(conversation);
        return toMessage(messageRepository.save(message));
    }

    @Transactional
    public ChatMessageResponse deleteMessage(Long messageId, Authentication authentication) {
        Uzytkownik current = currentUser(authentication);
        ChatMessage message = messageRepository.findById(messageId)
                .orElseThrow(() -> new IllegalArgumentException("Nie znaleziono wiadomości"));
        conversation(message.getConversation().getId(), current);
        if (!message.getSender().getUzytkownikId().equals(current.getUzytkownikId())) {
            throw new IllegalStateException("Możesz usuwać tylko własne wiadomości");
        }
        message.setDeleted(true);
        message.setContent("");
        return toMessage(message);
    }

    @Transactional(readOnly = true)
    public List<ChatParticipantResponse> users(String search) {
        String normalized = search == null ? "" : search.trim().toLowerCase();
        return userRepository.findAll().stream()
                .filter(user -> normalized.isBlank()
                        || (user.getImie() + " " + user.getNazwisko()).toLowerCase().contains(normalized)
                        || (user.getEmail() != null && user.getEmail().toLowerCase().contains(normalized)))
                .sorted(Comparator.comparing(Uzytkownik::getNazwisko).thenComparing(Uzytkownik::getImie))
                .map(this::toParticipant)
                .toList();
    }

    private ChatConversation conversation(Long id, Uzytkownik current) {
        ChatConversation conversation = conversationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Nie znaleziono rozmowy"));
        if (conversation.getParticipants().stream().noneMatch(user -> user.getUzytkownikId().equals(current.getUzytkownikId()))) {
            throw new IllegalStateException("Brak dostępu do tej rozmowy");
        }
        return conversation;
    }

    private Uzytkownik currentUser(Authentication authentication) {
        String email = null;
        if (authentication instanceof JwtAuthenticationToken jwtAuthentication) {
            email = jwtAuthentication.getToken().getClaimAsString("email");
        }
        if (email == null) {
            email = authentication.getName();
        }
        final String identity = email;
        return userRepository.findByEmailIgnoreCase(identity)
                .orElseThrow(() -> new IllegalStateException("Zalogowany użytkownik nie istnieje w bazie aplikacji"));
    }

    private ChatConversationResponse toConversation(ChatConversation conversation) {
        ChatMessageResponse last = conversation.getMessages().stream()
                .max(Comparator.comparing(ChatMessage::getSentAt))
                .map(this::toMessage)
                .orElse(null);
        return new ChatConversationResponse(conversation.getId(), conversation.getType().name(), conversation.getName(),
                conversation.getParticipants().stream().map(this::toParticipant).toList(), last, conversation.getUpdatedAt());
    }

    private ChatParticipantResponse toParticipant(Uzytkownik user) {
        return new ChatParticipantResponse(user.getUzytkownikId(), user.getImie(), user.getNazwisko(), user.getEmail());
    }

    private ChatMessageResponse toMessage(ChatMessage message) {
        return new ChatMessageResponse(message.getId(), message.getConversation().getId(),
                message.getSender().getUzytkownikId(), message.getSender().getImie() + " " + message.getSender().getNazwisko(),
                message.isDeleted() ? "" : message.getContent(), message.getSentAt(), message.isDeleted());
    }
}
