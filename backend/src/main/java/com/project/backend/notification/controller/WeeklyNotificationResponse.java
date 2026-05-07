package com.project.backend.notification.controller;

import com.project.backend.notification.service.WeeklyNotificationStatus;

import java.time.LocalDate;

public record WeeklyNotificationResponse(
        Integer projektId,
        LocalDate weekStart,
        int recipientsCount,
        WeeklyNotificationStatus status
) {
}
