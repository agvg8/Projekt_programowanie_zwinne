package com.project.backend.controller;

import com.project.backend.dto.RegisterRequest;
import com.project.backend.service.AuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.logging.Logger;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final static Logger logger = Logger.getLogger("auth-controller");

    @PostMapping("/register")
    public ResponseEntity<Void> register(@Valid @RequestBody RegisterRequest request) {
        logger.info(request.toString());
        authService.register(request);
        return ResponseEntity.ok().build();
    }
}