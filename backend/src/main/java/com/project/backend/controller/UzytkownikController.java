package com.project.backend.controller;

import com.project.backend.dto.UzytkownikDto;
import com.project.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/uzytkownik")
public class UzytkownikController {
    private final AuthService authService;

    @PatchMapping("/update")
    public ResponseEntity<Void> updateUzytkownik(@Valid @RequestBody UzytkownikDto dto) {
        authService.updateUser(dto);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable Integer userId) {
        authService.deleteUser(userId);
        return ResponseEntity.ok().build();
    }
}
