package com.project.backend.notification.service;

import java.time.LocalDate;

public record WeeklyNotificationResult(
        Integer projektId,
        LocalDate weekStart,
        int recipientsCount,
        WeeklyNotificationStatus status
) {
}
