package com.project.backend.notification.service;

import com.project.backend.model.Projekt;

import java.time.LocalDate;

public interface WeeklyStatusSummaryService {
    WeeklyStatusSummary buildSummary(Projekt projekt, LocalDate weekStart);
}
