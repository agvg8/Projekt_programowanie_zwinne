package com.project.backend.service;

import java.util.Optional;

import com.project.backend.model.StatusZadania;
import com.project.backend.repository.ZadanieRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import com.project.backend.model.Zadanie;

@Service
@RequiredArgsConstructor
public class ZadanieServiceImpl implements ZadanieService {
    private static final Logger logger = LoggerFactory.getLogger(ZadanieServiceImpl.class);
    private final ZadanieRepository zadanieRepository;

    @Override
    public Optional<Zadanie> getZadanieOptional(Integer zadanieId) {
        return zadanieRepository.findById(zadanieId);
    }

    @Override
    public Zadanie getZadanie(Integer zadanieId) {
        return getZadanieOptional(zadanieId).orElseThrow(
                () -> new RuntimeException("Nie znaleziono zadania o id: " + zadanieId)
        );
    }

    @Override
    public Zadanie setZadanie(Zadanie zadanie) {
        return zadanieRepository.save(zadanie);
    }

    @Override
    public void deleteZadanie(Integer zadanieId) {
        zadanieRepository.deleteById(zadanieId);
    }

    @Override
    public Page<Zadanie> getZadania(Pageable pageable) {
        return zadanieRepository.findAll(pageable);
    }

    public Zadanie updateStatus(Integer zadanieId, StatusZadania status) {
        Zadanie zadanie = getZadanie(zadanieId);
        zadanie.setStatus(status);
        return zadanieRepository.save(zadanie);
    }

    @Override
    public Page<Zadanie> getZadaniaByStatus(StatusZadania status, Pageable pageable) {
        return zadanieRepository.findByStatus(status, pageable);
    }

    @Override
    public Page<Zadanie> getZadaniaByProjekt(Integer projektId, Pageable pageable) {
        return zadanieRepository.findByProjekt_ProjektId(projektId, pageable);
    }
}