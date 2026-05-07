package com.project.backend.notification.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "notifications.weekly")
public class WeeklyNotificationProperties {
    private boolean enabled = true;
    private String cron = "0 0 9 ? * MON";
    private String zone = "Europe/Warsaw";
    private String sender = "no-reply@projekt.local";
    private boolean dryRun = true;
}
