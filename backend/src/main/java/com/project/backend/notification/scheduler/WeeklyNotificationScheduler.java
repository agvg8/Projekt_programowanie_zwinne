package com.project.backend.notification.scheduler;

import com.project.backend.notification.service.WeeklyNotificationJob;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class WeeklyNotificationScheduler {
    private final WeeklyNotificationJob weeklyNotificationJob;

    @Scheduled(cron = "${notifications.weekly.cron}", zone = "${notifications.weekly.zone}")
    public void runScheduledNotifications() {
        weeklyNotificationJob.run();
    }
}
