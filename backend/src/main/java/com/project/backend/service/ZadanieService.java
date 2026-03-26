package com.project.backend.service;

import com.project.backend.model.Zadanie;
import org.springframework.data.domain.Page;

import java.util.Optional;
import org.springframework.data.domain.Pageable;

public interface ZadanieService {
    Optional<Zadanie> getZadanie(Integer zadanieId);

    Zadanie setZadanie(Zadanie zadanie);

    void deleteZadanie(Integer zadanieId);

    Page<Zadanie> getZadania(Pageable pageable);
}
