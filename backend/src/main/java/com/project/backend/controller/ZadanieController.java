package com.project.backend.controller;

import com.project.backend.dto.ZadanieDto;
import com.project.backend.model.Priorytet;
import com.project.backend.model.Status;
import com.project.backend.model.Zadanie;
import com.project.backend.service.ZadanieServiceImpl;
import com.project.backend.service.ProjektService;
import jakarta.validation.Valid;
import jakarta.validation.ValidationException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;


@RequestMapping("/api/zadanie")
@CrossOrigin(origins = "http://localhost:5173")
@Controller
@RequiredArgsConstructor
public class ZadanieController {
    private final ZadanieServiceImpl zadanieService;
    private final ProjektService projektService;

    @GetMapping()
    public ResponseEntity<Page<Zadanie>> getZadania(
            @RequestParam(name = "nazwa", required = false) String nazwa,
            Pageable pageable) {
        if (nazwa != null && !nazwa.trim().isEmpty()) {
            return ResponseEntity.ok(zadanieService.searchByNazwa(nazwa, pageable));
        }
        return ResponseEntity.ok(zadanieService.getZadania(pageable));
    }

    @PutMapping("/{zadanieId}")
    public ResponseEntity<Void> updateZadanie(@Valid @RequestBody Zadanie zadanie, @PathVariable("zadanieId") Integer zadanieId) {
        return zadanieService.getZadanieOptional(zadanieId)
                .map(p -> {
                    zadanie.setZadanieId(zadanieId);
                    zadanieService.setZadanie(zadanie);
                    return new ResponseEntity<Void>(HttpStatus.OK);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/{zadanieId}")
    public ResponseEntity<Zadanie> getZadanie(@PathVariable("zadanieId") Integer zadanieId) {
        return zadanieService.getZadanieOptional(zadanieId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping()
    public ResponseEntity<Void> createZadanie(@Valid @RequestBody Zadanie zadanie) {
        zadanieService.setZadanie(zadanie);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/{zadanieId}")
    public ResponseEntity<Void> deleteZadanie(@PathVariable("zadanieId") Integer zadanieId) {
        return zadanieService.getZadanieOptional(zadanieId).map(p -> {
            zadanieService.deleteZadanie(zadanieId);
            return new ResponseEntity<Void>(HttpStatus.OK);
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PatchMapping("/{zadanieId}/status")
    public ResponseEntity<Void> updateStatus(
            @PathVariable Integer zadanieId,
            @RequestParam Status status
    ) {
        try {
            zadanieService.updateStatus(zadanieId, status);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{zadanieId}/priorytet")
    public ResponseEntity<Void> updatePriorytet(
            @PathVariable Integer zadanieId,
            @RequestParam Priorytet priorytet
            ) {
        try {
            zadanieService.updatePriorytet(zadanieId, priorytet);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{zadanieId}/przypisz/zadanie/{projektId}")
    public ResponseEntity<Void> przypiszZadanie(@PathVariable Integer zadanieId, @PathVariable Integer projektId)
    {
        zadanieService.przypiszZadanie(zadanieId, projektId);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{zadanieId}/usun/zadanie/{projektId}")
    public ResponseEntity<String> usunPrzypisanieZadania(@PathVariable Integer zadanieId, @PathVariable Integer projektId)
    {
        try {
            zadanieService.usunPrzypisanieZadania(zadanieId, projektId);
            return ResponseEntity.ok().build();
        } catch (ValidationException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
    }
    @PatchMapping("/update")
    public ResponseEntity<Void> updateZadanie(@Valid @RequestBody ZadanieDto zadanie) {
        zadanieService.updateZadanie(zadanie);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{zadanieId}/przypisz/zadanie/{projektId}")
    public ResponseEntity<Void> przypiszZadanie(@PathVariable Integer zadanieId, @PathVariable Integer projektId)
    {
        zadanieService.przypiszZadanie(zadanieId, projektId);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{zadanieId}/usun/zadanie/{projektId}")
    public ResponseEntity<String> usunPrzypisanieZadania(@PathVariable Integer zadanieId, @PathVariable Integer projektId)
    {
        try {
            zadanieService.przypiszZadanie(zadanieId, projektId);
            return ResponseEntity.ok().build();
        } catch (ValidationException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
    }
}