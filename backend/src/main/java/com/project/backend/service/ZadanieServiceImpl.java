package com.project.backend.service;

import java.util.Optional;

import com.project.backend.dto.ZadanieDto;
import com.project.backend.model.Priorytet;
import com.project.backend.model.Status;
import com.project.backend.repository.ZadanieRepository;
import jakarta.validation.ValidationException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import com.project.backend.model.Zadanie;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ZadanieServiceImpl implements ZadanieService {
    private static final Logger logger = LoggerFactory.getLogger(ZadanieServiceImpl.class);
    private final ZadanieRepository zadanieRepository;
    private final ProjektService projektService;

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

    public Zadanie updateStatus(Integer zadanieId, Status status) {
        Zadanie zadanie = getZadanie(zadanieId);
        zadanie.setStatus(status);
        logger.info(zadanie.toString());
        return zadanieRepository.save(zadanie);
    }

    public Zadanie updatePriorytet(Integer zadanieId, Priorytet priorytet) {
        Zadanie zadanie = getZadanie(zadanieId);
        zadanie.setPriorytet(priorytet);
        return zadanieRepository.save(zadanie);
    }

    @Override
    public Page<Zadanie> getZadaniaByStatus(Status status, Pageable pageable) {
        return zadanieRepository.findByStatus(status, pageable);
    }

    @Override
    public Page<Zadanie> getZadaniaByProjekt(Integer projektId, Pageable pageable) {
        return zadanieRepository.findByProjekt_ProjektId(projektId, pageable);
    }

    @Override
    public Page<Zadanie> getZadaniaByProjektAndNazwa(Integer projektId, String nazwa, Pageable pageable) {
        return zadanieRepository.findByProjekt_ProjektIdAndNazwaContainingIgnoreCase(projektId, nazwa, pageable);
    }

    @Override
    public Page<Zadanie> searchByNazwa(String nazwa, Pageable pageable) {
        return zadanieRepository.findByNazwaContainingIgnoreCase(nazwa, pageable);
    }

    @Override
    @Transactional
    public void przypiszZadanie(Integer zadanieId, Integer projektId) {
        Zadanie zadanie = getZadanie(zadanieId);
        zadanie.setProjekt(projektService.getProjekt(projektId));
        setZadanie(zadanie);
    }

    @Override
    @Transactional
    public void usunPrzypisanieZadania(Integer zadanieId, Integer projektId) throws ValidationException {
        Zadanie zadanie = getZadanie(zadanieId);
        if (zadanie.getProjekt() == null || !zadanie.getProjekt().getProjektId().equals(projektId)) {
            throw new ValidationException("Zadanie nie jest przypisane do tego projektu");
        }
        zadanie.setProjekt(null);
        zadanieRepository.save(zadanie);
    }

    @Override
    public Zadanie updateZadanie(ZadanieDto dto) {
        Zadanie zadanie = getZadanie(dto.getZadanieId());
        zadanie.setNazwa(dto.getNazwa());
        zadanie.setOpis(dto.getOpis());
        zadanie.setKolejnosc(dto.getKolejnosc());
        zadanie.setDataczasDodania(dto.getDataOddania());
        zadanie = setZadanie(zadanie);
        return zadanie;
    }
}