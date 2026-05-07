package com.project.backend.notification.service.impl;

import com.project.backend.model.Projekt;
import com.project.backend.notification.service.WeeklyStatusSummary;
import com.project.backend.notification.service.WeeklyStatusSummaryService;
import com.project.backend.repository.ZadanieRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class DefaultWeeklyStatusSummaryService implements WeeklyStatusSummaryService {
    private final ZadanieRepository zadanieRepository;

    @Override
    public WeeklyStatusSummary buildSummary(Projekt projekt, LocalDate weekStart) {
        long numberOfTasks = zadanieRepository.countByProjekt_ProjektId(projekt.getProjektId());
        String terminOddania = projekt.getData_oddania() == null ? "brak" : projekt.getData_oddania().toString();

        String subject = "Cotygodniowy status projektu: " + projekt.getNazwa();
        String body = """
                Tygodniowy update statusu projektu
                Projekt: %s
                Tydzien od: %s
                Termin oddania: %s
                Liczba zadan: %d
                """.formatted(projekt.getNazwa(), weekStart, terminOddania, numberOfTasks);

        return new WeeklyStatusSummary(subject, body);
    }
}
