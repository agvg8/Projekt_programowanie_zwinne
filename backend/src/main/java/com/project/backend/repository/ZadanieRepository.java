package com.project.backend.repository;

import java.util.List;

import com.project.backend.model.StatusZadania;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.project.backend.model.Zadanie;

public interface ZadanieRepository extends JpaRepository<Zadanie, Integer> {
    @Query("SELECT z FROM Zadanie z WHERE z.projekt.projektId = :projektId")
    Page<Zadanie> findZadaniaProjektu(@Param("projektId") Integer projektId, Pageable pageable);

    @Query("SELECT z FROM Zadanie z WHERE z.projekt.projektId = :projektId")
    List<Zadanie> findZadaniaProjektu(@Param("projektId") Integer projektId);

    long countByProjekt_ProjektId(Integer projektId);

    Page<Zadanie> findByStatus(StatusZadania status, Pageable pageable);
    Page<Zadanie> findByProjekt_ProjektId(Integer projektId, Pageable pageable);
}
