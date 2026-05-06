package com.project.backend.controller;

import com.project.backend.model.StatusZadania;
import com.project.backend.model.Zadanie;
import com.project.backend.service.ZadanieServiceImpl;
import com.project.backend.service.ProjektService;
import jakarta.validation.Valid;
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
    public ResponseEntity<Page<Zadanie>> getZadania(Pageable pageable) {
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
    public ResponseEntity<Void> createZadanie(@Valid @RequestBody Zadanie zadanie){
        zadanieService.setZadanie(zadanie);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/{zadanieId}")
    public ResponseEntity<Void> deleteZadanie(@PathVariable("zadanieId") Integer zadanieId){
        return zadanieService.getZadanieOptional(zadanieId).map(p -> {
            zadanieService.deleteZadanie(zadanieId);
            return new ResponseEntity<Void>(HttpStatus.OK);
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PatchMapping("/{zadanieId}/status")
    public ResponseEntity<Void> updateStatus(
            @PathVariable Integer zadanieId,
            @RequestParam StatusZadania status
    ) {
        try {
            zadanieService.updateStatus(zadanieId, status);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}