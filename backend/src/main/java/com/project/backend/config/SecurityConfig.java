package com.project.backend.config;

import jakarta.ws.rs.HttpMethod;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        // rejestracja - ALL (no auth)
                        .requestMatchers("/auth/register").permitAll()

                        // przypisywanie użytkownika do projektu
                        .requestMatchers(HttpMethod.PATCH,
                                "/api/projekt/*/przypisz/uzytkownik/*",
                                "/api/projekt/*/usun/uzytkownik/*")
                        .hasAnyRole("USER", "MANAGER", "ADMIN")

                        // odczyt projektów i zadań - USER, MANAGER, ADMIN
                        .requestMatchers(HttpMethod.GET,
                                "/api/projekt/**",
                                "/api/zadanie/**")
                        .hasAnyRole("USER", "MANAGER", "ADMIN")

                        // modyfikacja projektów i zadań - MANAGER, ADMIN
                        .requestMatchers(HttpMethod.POST,
                                "/api/projekt/**",
                                "/api/zadanie/**")
                        .hasAnyRole("MANAGER", "ADMIN")

                        .requestMatchers(HttpMethod.PUT,
                                "/api/projekt/**",
                                "/api/zadanie/**")
                        .hasAnyRole("MANAGER", "ADMIN")

                        .requestMatchers(HttpMethod.PATCH,
                                "/api/projekt/**",
                                "/api/zadanie/**")
                        .hasAnyRole("MANAGER", "ADMIN")

                        .requestMatchers(HttpMethod.DELETE,
                                "/api/projekt/**",
                                "/api/zadanie/**")
                        .hasAnyRole("MANAGER", "ADMIN")

                        // modyfikacja pól użytkowników
                        .requestMatchers("/api/uzytkownik/**").hasAnyRole("ADMIN")
                        .anyRequest().authenticated())
                .oauth2ResourceServer(oauth ->
                        oauth.jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter())));
        return http.build();
    }

    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(jwt -> {
            Map<String, Object> realmAccess = jwt.getClaim("realm_access");
            if (realmAccess == null || realmAccess.get("roles") == null) {
                return Collections.emptyList();
            }
            List<String> roles = (List<String>) realmAccess.get("roles");
            return roles.stream().map(role -> (GrantedAuthority) new SimpleGrantedAuthority("ROLE_" + role)).toList();
        });

        return converter;
    }
}