package com.project.backend.notification.service;

import com.project.backend.model.Projekt;
import com.project.backend.notification.config.WeeklyNotificationProperties;
import com.project.backend.repository.ProjektRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WeeklyNotificationJob {
    private static final Logger logger = LoggerFactory.getLogger(WeeklyNotificationJob.class);

    private final ProjektRepository projektRepository;
    private final ProjectWeeklyNotificationService projectWeeklyNotificationService;
    private final WeeklyNotificationProperties properties;

    public void run() {
        if (!properties.isEnabled()) {
            logger.info("Weekly notifications are disabled");
            return;
        }

        for (Projekt projekt : projektRepository.findAllWithUzytkownicy()) {
            WeeklyNotificationResult result = projectWeeklyNotificationService.notifyProject(projekt, properties.isDryRun());
            logger.info(
                    "Weekly notification processed for projectId={}, status={}, recipients={}",
                    result.projektId(),
                    result.status(),
                    result.recipientsCount()
            );
        }
    }
}
