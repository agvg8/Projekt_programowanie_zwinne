package com.project.backend.controller;

import com.project.backend.model.Projekt;
import com.project.backend.model.Zadanie;
import com.project.backend.service.ProjektService;
import com.project.backend.service.ProjektServiceImpl;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projekt")
@CrossOrigin(origins = "http://localhost:5173")
@Tag(name = "Projekt")
@RequiredArgsConstructor
public class ProjektRestController {
    private final ProjektService projektService;

    @GetMapping("/{projektId}")
    public ResponseEntity<Projekt> getProjekt(@PathVariable("projektId") Integer projektId) {
        return ResponseEntity.ok(projektService.getProjekt(projektId));
    }

    @PostMapping
    public ResponseEntity<Void> createProjekt(@Valid @RequestBody Projekt projekt) {
        Projekt saved = projektService.setProjekt(projekt);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .header("Location", "/api/projekt/" + saved.getProjektId())
                .build();
    }

    @PutMapping("/{projektId}")
    public ResponseEntity<Void> updateProjekt(@Valid @RequestBody Projekt projekt, @PathVariable("projektId") Integer projektId) {
        return projektService.getProjektOptional(projektId)
                .map(p -> {
                    projekt.setProjektId(projektId);
                    projektService.setProjekt(projekt);
                    return new ResponseEntity<Void>(HttpStatus.OK);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{projektId}")
    public ResponseEntity<Void> deleteProjekt(@PathVariable("projektId") Integer projektId) {
        return projektService.getProjektOptional(projektId).map(p -> {
            projektService.deleteProjekt(projektId);
            return new ResponseEntity<Void>(HttpStatus.OK);
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping
    public Page<Projekt> getProjekty(Pageable pageable) {
        return projektService.getProjekty(pageable);
    }

    @GetMapping(params = "nazwa")
    public Page<Projekt> getProjektyByNazwa(@RequestParam(name = "nazwa") String nazwa, Pageable pageable) {
        return projektService.searchByNazwa(nazwa, pageable);
    }

    @GetMapping("/{projektId}/zadania")
    public List<Zadanie> getZadaniaByProjekt(@PathVariable Integer projektId){
        return projektService.getProjekt(projektId).getZadania();
    }
}