package com.project.backend.repository;

import com.project.backend.model.ProjektZalacznik;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProjektZalacznikRepository extends JpaRepository<ProjektZalacznik, Integer> {
    List<ProjektZalacznik> findByProjekt_ProjektIdOrderByUploadedAtDesc(Integer projektId);
    Optional<ProjektZalacznik> findByZalacznikIdAndProjekt_ProjektId(Integer zalacznikId, Integer projektId);
}

