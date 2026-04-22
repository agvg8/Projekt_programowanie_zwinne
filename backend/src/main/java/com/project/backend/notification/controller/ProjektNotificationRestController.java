package com.project.backend.notification.controller;

import com.project.backend.notification.config.WeeklyNotificationProperties;
import com.project.backend.notification.service.ProjectWeeklyNotificationService;
import com.project.backend.notification.service.WeeklyNotificationResult;
import com.project.backend.service.ProjektService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/projekt/{projektId}/notifications")
@RequiredArgsConstructor
public class ProjektNotificationRestController {
    private final ProjektService projektService;
    private final ProjectWeeklyNotificationService projectWeeklyNotificationService;
    private final WeeklyNotificationProperties properties;

    @PostMapping("/weekly-status")
    public ResponseEntity<WeeklyNotificationResponse> triggerWeeklyStatusNotification(
            @PathVariable("projektId") Integer projektId,
            @RequestParam(name = "dryRun", required = false) Boolean dryRun
    ) {
        return projektService.getProjektOptional(projektId)
                .map(projekt -> {
                    boolean effectiveDryRun = dryRun != null ? dryRun : properties.isDryRun();
                    WeeklyNotificationResult result = projectWeeklyNotificationService.notifyProject(projekt, effectiveDryRun);
                    WeeklyNotificationResponse response = new WeeklyNotificationResponse(
                            result.projektId(),
                            result.weekStart(),
                            result.recipientsCount(),
                            result.status()
                    );
                    return ResponseEntity.ok(response);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
