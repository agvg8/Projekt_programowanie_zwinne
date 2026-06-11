package com.project.backend.controller;

import com.project.backend.dto.UzytkownikDto;
import com.project.backend.service.AuthService;
import com.project.backend.service.UzytkownikService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/uzytkownik")
public class UzytkownikController {
    private final AuthService authService;

    @PatchMapping("/update")
    public ResponseEntity<Void> updateUzytkownik(@RequestBody UzytkownikDto dto) {
        authService.updateUser(dto);
        return ResponseEntity.ok().build();
    }
}
