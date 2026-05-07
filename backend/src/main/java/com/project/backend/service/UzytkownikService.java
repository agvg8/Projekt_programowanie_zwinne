package com.project.backend.service;

import com.project.backend.model.Uzytkownik;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

public interface UzytkownikService {
    Optional<Uzytkownik> getUzytkownikOptional(Integer uzytkownikId);

    Uzytkownik getUzytkownik(Integer uzytkownikId);

    Uzytkownik setUzytkownik(Uzytkownik uzytkownik);

    void deleteUzytkownik(Uzytkownik uzytkownik);

    Page<Uzytkownik> getUzytkownicy(Pageable pageable);
}
