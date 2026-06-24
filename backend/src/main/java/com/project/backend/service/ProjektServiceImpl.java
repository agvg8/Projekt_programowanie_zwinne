package com.project.backend.service;

import java.time.LocalDateTime;
import java.util.Optional;

import com.project.backend.dto.ProjektDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.project.backend.model.Projekt;
import com.project.backend.repository.ProjektRepository;
import com.project.backend.repository.ZadanieRepository;

@Service
@RequiredArgsConstructor
public class ProjektServiceImpl implements ProjektService {
    private final ProjektRepository projektRepository;
    private final ZadanieRepository zadanieRepository;

    @Override
    public Optional<Projekt> getProjektOptional(Integer projektId) {
        return projektRepository.findById(projektId);
    }

    @Override
    public Projekt getProjekt(Integer projektId){
        return getProjektOptional(projektId).orElseThrow(
                () -> new RuntimeException("Nie znaleziono projektu o id: " + projektId)
        );
    }

    @Override
    public Projekt setProjekt(Projekt projekt) {
        return projektRepository.save(projekt);
    }

    @Override
    @Transactional
    public void deleteProjekt(Integer projektId) {
        zadanieRepository.deleteAll(zadanieRepository.findZadaniaProjektu(projektId));
        projektRepository.deleteById(projektId);
    }

    @Override
    public Page<Projekt> getProjekty(Pageable pageable) {
        return projektRepository.findAll(pageable);
    }

    @Override
    public Page<Projekt> searchByNazwa(String nazwa, Pageable pageable) {
        return projektRepository.findByNazwaContainingIgnoreCase(nazwa, pageable);
    }

    @Override
    public Projekt updateProjekt(ProjektDto dto) {
        Projekt projekt = getProjekt(dto.getProjektId());
        projekt.setNazwa(dto.getNazwa());
        projekt.setOpis(dto.getOpis());
        projekt.setData_oddania(dto.getDataOddania());
        projekt.setLastModifiedDate(LocalDateTime.now());
        projekt = setProjekt(projekt);
        return projekt;
    }
}