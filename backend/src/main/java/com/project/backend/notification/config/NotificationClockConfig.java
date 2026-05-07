package com.project.backend.notification.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Clock;
import java.time.ZoneId;

@Configuration
public class NotificationClockConfig {

    @Bean
    public Clock notificationClock(WeeklyNotificationProperties properties) {
        return Clock.system(ZoneId.of(properties.getZone()));
    }
}
