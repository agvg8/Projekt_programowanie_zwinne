package com.project.backend.notification.controller;

import com.project.backend.model.Projekt;
import com.project.backend.notification.config.WeeklyNotificationProperties;
import com.project.backend.notification.service.ProjectWeeklyNotificationService;
import com.project.backend.notification.service.WeeklyNotificationResult;
import com.project.backend.notification.service.WeeklyNotificationStatus;
import com.project.backend.service.ProjektService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProjektNotificationRestControllerTest {

    @Mock
    private ProjektService projektService;
    @Mock
    private ProjectWeeklyNotificationService projectWeeklyNotificationService;
    @Spy
    private WeeklyNotificationProperties properties = new WeeklyNotificationProperties();

    @InjectMocks
    private ProjektNotificationRestController controller;

    @Test
    void triggerWeeklyStatusNotification_shouldUseDefaultDryRunWhenParamMissing() {
        Projekt projekt = new Projekt();
        projekt.setProjektId(3);
        properties.setDryRun(true);

        when(projektService.getProjektOptional(3)).thenReturn(Optional.of(projekt));
        when(projectWeeklyNotificationService.notifyProject(projekt, true))
                .thenReturn(new WeeklyNotificationResult(3, LocalDate.of(2026, 4, 20), 2, WeeklyNotificationStatus.DRY_RUN));

        ResponseEntity<WeeklyNotificationResponse> response = controller.triggerWeeklyStatusNotification(3, null);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(WeeklyNotificationStatus.DRY_RUN, response.getBody().status());
        assertEquals(2, response.getBody().recipientsCount());
    }
}
