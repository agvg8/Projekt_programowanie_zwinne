package com.project.backend.notification.service;

import com.project.backend.model.Projekt;
import com.project.backend.notification.config.WeeklyNotificationProperties;
import com.project.backend.notification.model.ProjektStatusNotification;
import com.project.backend.notification.repository.ProjektStatusNotificationRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectWeeklyNotificationService {
    private static final Logger logger = LoggerFactory.getLogger(ProjectWeeklyNotificationService.class);

    private final WeeklyStatusSummaryService weeklyStatusSummaryService;
    private final NotificationRecipientService notificationRecipientService;
    private final EmailSender emailSender;
    private final ProjektStatusNotificationRepository notificationRepository;
    private final WeeklyNotificationProperties properties;
    private final Clock notificationClock;

    @Transactional
    public WeeklyNotificationResult notifyProject(Projekt projekt, boolean dryRun) {
        LocalDate weekStart = currentWeekStart();
        Integer projektId = projekt.getProjektId();

        if (!dryRun && notificationRepository.existsByProjekt_ProjektIdAndWeekStart(projektId, weekStart)) {
            return new WeeklyNotificationResult(projektId, weekStart, 0, WeeklyNotificationStatus.SKIPPED_DUPLICATE);
        }

        WeeklyStatusSummary summary = weeklyStatusSummaryService.buildSummary(projekt, weekStart);
        List<String> recipients = notificationRecipientService.resolveRecipients(projekt);

        if (dryRun) {
            logger.info(
                    "Weekly notification DRY_RUN for projectId={}, weekStart={}, recipients={}, subject={}",
                    projektId,
                    weekStart,
                    recipients,
                    summary.subject()
            );
            return new WeeklyNotificationResult(projektId, weekStart, recipients.size(), WeeklyNotificationStatus.DRY_RUN);
        }

        if (recipients.isEmpty()) {
            logger.info("Skipping weekly notification for projectId={} due to no recipients", projektId);
            persistNotification(projekt, weekStart, 0);
            return new WeeklyNotificationResult(projektId, weekStart, 0, WeeklyNotificationStatus.SKIPPED_NO_RECIPIENTS);
        }

        emailSender.send(properties.getSender(), recipients, summary.subject(), summary.body());
        persistNotification(projekt, weekStart, recipients.size());

        return new WeeklyNotificationResult(projektId, weekStart, recipients.size(), WeeklyNotificationStatus.SENT);
    }

    private LocalDate currentWeekStart() {
        LocalDate currentDate = LocalDate.now(notificationClock);
        return currentDate.with(DayOfWeek.MONDAY);
    }

    private void persistNotification(Projekt projekt, LocalDate weekStart, int recipientsCount) {
        ProjektStatusNotification notification = new ProjektStatusNotification();
        notification.setProjekt(projekt);
        notification.setWeekStart(weekStart);
        notification.setSentAt(LocalDateTime.now(notificationClock));
        notification.setRecipientCount(recipientsCount);
        notificationRepository.save(notification);
    }
}
