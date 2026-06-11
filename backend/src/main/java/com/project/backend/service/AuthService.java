package com.project.backend.service;

import com.project.backend.dto.RegisterRequest;
import com.project.backend.model.RolaUzytkownika;
import com.project.backend.model.Uzytkownik;

import jakarta.ws.rs.core.Response;

import lombok.RequiredArgsConstructor;

import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.RealmResource;

import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.RoleRepresentation;
import org.keycloak.representations.idm.UserRepresentation;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final Keycloak keycloak;

    private final UzytkownikService uzytkownikService;

    @Value("${keycloak.realm}")
    private String realm;

    public void register(RegisterRequest request) {

        RealmResource realmResource = keycloak.realm(realm);

        UserRepresentation user = new UserRepresentation();

        user.setEnabled(true);
        user.setFirstName(request.getName());
        user.setLastName(request.getSurname());
        user.setEmail(request.getEmail());
        user.setUsername(request.getName() + "_" + request.getSurname());

        Response response = realmResource.users().create(user);

        if (response.getStatus() != 201) {
            String error = response.readEntity(String.class);
            throw new RuntimeException(
                    "Cannot create user in Keycloak. " +
                            "Status: " + response.getStatus() +
                            " Error: " + error
            );
        }

        String userId = response.getLocation()
                .getPath()
                .replaceAll(".*/([^/]+)$", "$1");

        CredentialRepresentation password = new CredentialRepresentation();

        password.setTemporary(false);
        password.setType(CredentialRepresentation.PASSWORD);

        password.setValue(request.getPassword());

        realmResource.users()
                .get(userId)
                .resetPassword(password);

        RoleRepresentation userRole = realmResource
                .roles()
                .get("USER")
                .toRepresentation();

        realmResource.users()
                .get(userId)
                .roles()
                .realmLevel()
                .add(List.of(userRole));

        Uzytkownik uzytkownik = new Uzytkownik();
        uzytkownik.setImie(request.getName());
        uzytkownik.setNazwisko(request.getSurname());
        uzytkownik.setEmail(request.getEmail());
        uzytkownik.setRola(RolaUzytkownika.USER);
        uzytkownikService.setUzytkownik(uzytkownik);
    }
}