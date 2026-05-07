package com.project.backend.notification.repository;

import com.project.backend.notification.model.ProjektStatusNotification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;

public interface ProjektStatusNotificationRepository extends JpaRepository<ProjektStatusNotification, Long> {
    boolean existsByProjekt_ProjektIdAndWeekStart(Integer projektId, LocalDate weekStart);
}
