package com.project.backend.dto;

import java.time.Instant;
import java.util.List;

public record ChatConversationResponse(Long id, String type, String name,
                                       List<ChatParticipantResponse> participants,
                                       ChatMessageResponse lastMessage, Instant updatedAt) {}
