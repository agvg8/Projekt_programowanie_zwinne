package com.project.backend.repository;

import com.project.backend.model.Uzytkownik;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UzytkownikRepository extends JpaRepository<Uzytkownik, Integer> {
    Page<Uzytkownik> findByNazwiskoStartsWithIgnoreCase(String nazwisko, Pageable pageable);
}
