package com.project.backend.dto;

import java.time.Instant;

public record ChatMessageResponse(Long id, Long conversationId, Integer senderId, String senderName,
                                  String content, Instant sentAt, boolean deleted) {}
