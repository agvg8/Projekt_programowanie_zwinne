package com.project.backend.notification.service.impl;

import com.project.backend.model.Projekt;
import com.project.backend.notification.service.WeeklyStatusSummary;
import com.project.backend.repository.ZadanieRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DefaultWeeklyStatusSummaryServiceTest {

    @Mock
    private ZadanieRepository zadanieRepository;

    @InjectMocks
    private DefaultWeeklyStatusSummaryService summaryService;

    @Test
    void buildSummary_shouldContainProjectAndTaskData() {
        Projekt projekt = new Projekt();
        projekt.setProjektId(7);
        projekt.setNazwa("Nowy Portal");

        when(zadanieRepository.countByProjekt_ProjektId(7)).thenReturn(5L);

        WeeklyStatusSummary summary = summaryService.buildSummary(projekt, LocalDate.of(2026, 4, 20));

        assertTrue(summary.subject().contains("Nowy Portal"));
        assertTrue(summary.body().contains("Nowy Portal"));
        assertTrue(summary.body().contains("Liczba zadan: 5"));
    }
}
