package com.project.backend.service;

import java.util.Optional;

import com.project.backend.model.Uzytkownik;
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
    private final UzytkownikService uzytkownikService;

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
    @Transactional
    public void przypiszUzytkownika(Integer projektId, Integer uzytkownikId) {
        Projekt projekt = getProjekt(projektId);
        Uzytkownik uzytkownik = uzytkownikService.getUzytkownik(uzytkownikId);
        projekt.getUzytkownicy().add(uzytkownik);
        setProjekt(projekt);
    }

    @Override
    @Transactional
    public void usunPrzypisanieUzytkownika(Integer projektId, Integer uzytkownikId) {
        Projekt projekt = getProjekt(projektId);
        projekt.getUzytkownicy().removeIf(u -> u.getUzytkownikId().equals(uzytkownikId));
        setProjekt(projekt);
    }
}