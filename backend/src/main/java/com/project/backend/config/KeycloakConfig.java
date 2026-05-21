package com.project.backend.config;

import org.keycloak.OAuth2Constants;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class KeycloakConfig {

    @Value("${keycloak.server-url}")
    private String serverUrl;

    @Value("${keycloak.realm}")
    private String realm;

    @Value("${keycloak.admin-username}")
    private String adminUsername;

    @Value("${keycloak.admin-password}")
    private String adminPassword;

    @Value("${keycloak.client-id}")
    private String clientId;

    @Bean
    public Keycloak keycloak() {

        return KeycloakBuilder.builder()
                .serverUrl(serverUrl)
                .realm("master")
                .grantType(OAuth2Constants.PASSWORD)
                .clientId(clientId)
                .username(adminUsername)
                .password(adminPassword)
                .build();
    }
}
