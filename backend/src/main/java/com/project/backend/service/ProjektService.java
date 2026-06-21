package com.project.backend.service;

import java.util.Optional;

import com.project.backend.dto.ProjektDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.project.backend.model.Projekt;

public interface ProjektService {
    Optional<Projekt> getProjektOptional(Integer projektId);
    Projekt getProjekt(Integer projektId);
    Projekt setProjekt(Projekt projekt);
    void deleteProjekt(Integer projektId);
    Page<Projekt> getProjekty(Pageable pageable);
    Page<Projekt> searchByNazwa(String nazwa, Pageable pageable);
    void przypiszUzytkownika(Integer projektId, Integer uzytkownikId);
    void usunPrzypisanieUzytkownika(Integer projektId, Integer uzytkownikId);
    Projekt updateProjekt(ProjektDto dto);
}