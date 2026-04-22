package com.project.backend.notification.service;

import com.project.backend.model.Projekt;
import com.project.backend.model.Student;
import com.project.backend.notification.config.WeeklyNotificationProperties;
import com.project.backend.notification.repository.ProjektStatusNotificationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProjectWeeklyNotificationServiceTest {

    @Mock
    private WeeklyStatusSummaryService weeklyStatusSummaryService;
    @Mock
    private NotificationRecipientService notificationRecipientService;
    @Mock
    private EmailSender emailSender;
    @Mock
    private ProjektStatusNotificationRepository notificationRepository;

    private WeeklyNotificationProperties properties;
    private Clock clock;
    private ProjectWeeklyNotificationService service;

    @BeforeEach
    void setUp() {
        properties = new WeeklyNotificationProperties();
        properties.setSender("no-reply@test.local");
        clock = Clock.fixed(Instant.parse("2026-04-22T08:00:00Z"), ZoneId.of("Europe/Warsaw"));
        service = new ProjectWeeklyNotificationService(
                weeklyStatusSummaryService,
                notificationRecipientService,
                emailSender,
                notificationRepository,
                properties,
                clock
        );
    }

    @Test
    void dryRun_shouldNotSendAndNotPersist() {
        Projekt projekt = projekt(12, "Projekt A");
        when(weeklyStatusSummaryService.buildSummary(any(Projekt.class), any(LocalDate.class)))
                .thenReturn(new WeeklyStatusSummary("sub", "body"));
        when(notificationRecipientService.resolveRecipients(projekt))
                .thenReturn(java.util.List.of("a@test.local", "b@test.local"));

        WeeklyNotificationResult result = service.notifyProject(projekt, true);

        assertEquals(WeeklyNotificationStatus.DRY_RUN, result.status());
        assertEquals(2, result.recipientsCount());
        verify(emailSender, never()).send(anyString(), anyList(), anyString(), anyString());
        verify(notificationRepository, never()).save(any());
    }

    @Test
    void duplicateForWeek_shouldSkip() {
        Projekt projekt = projekt(15, "Projekt B");
        when(notificationRepository.existsByProjekt_ProjektIdAndWeekStart(eq(15), any(LocalDate.class))).thenReturn(true);

        WeeklyNotificationResult result = service.notifyProject(projekt, false);

        assertEquals(WeeklyNotificationStatus.SKIPPED_DUPLICATE, result.status());
        verify(emailSender, never()).send(anyString(), anyList(), anyString(), anyString());
    }

    @Test
    void realSend_shouldSendAndPersist() {
        Projekt projekt = projekt(22, "Projekt C");
        when(notificationRepository.existsByProjekt_ProjektIdAndWeekStart(eq(22), any(LocalDate.class))).thenReturn(false);
        when(weeklyStatusSummaryService.buildSummary(any(Projekt.class), any(LocalDate.class)))
                .thenReturn(new WeeklyStatusSummary("sub", "body"));
        when(notificationRecipientService.resolveRecipients(projekt))
                .thenReturn(java.util.List.of("mail1@test.local"));

        WeeklyNotificationResult result = service.notifyProject(projekt, false);

        assertEquals(WeeklyNotificationStatus.SENT, result.status());
        assertEquals(1, result.recipientsCount());
        verify(emailSender).send(eq("no-reply@test.local"), eq(java.util.List.of("mail1@test.local")), eq("sub"), eq("body"));
        verify(notificationRepository).save(any());
    }

    private Projekt projekt(int id, String nazwa) {
        Projekt projekt = new Projekt();
        projekt.setProjektId(id);
        projekt.setNazwa(nazwa);
        Student student = new Student();
        student.setEmail("one@test.local");
        projekt.setStudenci(Set.of(student));
        return projekt;
    }
}
