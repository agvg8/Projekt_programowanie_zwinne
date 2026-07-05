package com.project.backend.controller;

import com.project.backend.dto.UzytkownikDto;
import com.project.backend.model.Uzytkownik;
import com.project.backend.service.AuthService;
import com.project.backend.service.UzytkownikService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.logging.Logger;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/uzytkownik")
public class UzytkownikController {
    private final AuthService authService;
    private final UzytkownikService uzytkownikService;
    Logger logger = Logger.getLogger("UzytkowniController");

    @PatchMapping("/update")
    public ResponseEntity<Void> updateUzytkownik(@Valid @RequestBody UzytkownikDto dto) {
        logger.info(dto.toString());
        authService.updateUser(dto);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable Integer userId) {
        authService.deleteUser(userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<Page<Uzytkownik>> getUsers(Pageable pageable) {
        return ResponseEntity.ok(uzytkownikService.getUzytkownicy(pageable));
    }
}
