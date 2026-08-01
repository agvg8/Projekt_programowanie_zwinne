package com.project.backend.repository;

import com.project.backend.model.Uzytkownik;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UzytkownikRepository extends JpaRepository<Uzytkownik, Integer> {
    Page<Uzytkownik> findByNazwiskoStartsWithIgnoreCase(String nazwisko, Pageable pageable);

    Optional<Uzytkownik> findByEmailIgnoreCase(String email);

    Optional<Uzytkownik> findByImieIgnoreCaseAndNazwiskoIgnoreCase(String imie, String nazwisko);
}
