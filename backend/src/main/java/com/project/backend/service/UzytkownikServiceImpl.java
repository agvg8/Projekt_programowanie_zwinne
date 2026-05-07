package com.project.backend.service;

import com.project.backend.model.Uzytkownik;
import com.project.backend.repository.UzytkownikRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UzytkownikServiceImpl implements UzytkownikService {

    public final UzytkownikRepository uzytkownikRepository;

    @Override
    public Optional<Uzytkownik> getUzytkownikOptional(Integer uzytkownikId) {
        return uzytkownikRepository.findById(uzytkownikId);
    }

    @Override
    public Uzytkownik getUzytkownik(Integer uzytkownikId) {
        return getUzytkownikOptional(uzytkownikId).orElseThrow(
                () -> new RuntimeException(("Nie znaleziono uzytkownika z id: " + uzytkownikId))
        );
    }

    @Override
    public Uzytkownik setUzytkownik(Uzytkownik uzytkownik) {
        return uzytkownikRepository.save(uzytkownik);
    }

    @Override
    public void deleteUzytkownik(Uzytkownik uzytkownik) {
        uzytkownikRepository.delete(uzytkownik);
    }

    @Override
    public Page<Uzytkownik> getUzytkownicy(Pageable pageable) {
        return uzytkownikRepository.findAll(pageable);
    }
}
