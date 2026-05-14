package com.project.backend.service;

import com.project.backend.model.Status;
import com.project.backend.model.Zadanie;
import org.springframework.data.domain.Page;

import java.util.Optional;
import org.springframework.data.domain.Pageable;

public interface ZadanieService {
    Optional<Zadanie> getZadanieOptional(Integer zadanieId);

    Zadanie getZadanie(Integer zadanieId);

    Zadanie setZadanie(Zadanie zadanie);

    void deleteZadanie(Integer zadanieId);

    Page<Zadanie> getZadania(Pageable pageable);

    Zadanie updateStatus(Integer zadanieId, Status status);

    Page<Zadanie> getZadaniaByStatus(Status status, Pageable pageable);

    Page<Zadanie> getZadaniaByProjekt(Integer projektId, Pageable pageable);
}
