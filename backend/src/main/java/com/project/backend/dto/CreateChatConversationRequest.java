package com.project.backend.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.Set;

public record CreateChatConversationRequest(@NotNull String type, @Size(max = 100) String name,
                                            @NotEmpty Set<Integer> participantIds) {}
