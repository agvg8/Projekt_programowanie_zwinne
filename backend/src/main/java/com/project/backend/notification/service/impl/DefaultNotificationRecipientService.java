package com.project.backend.notification.service.impl;

import com.project.backend.model.Projekt;
import com.project.backend.model.Uzytkownik;
import com.project.backend.notification.service.NotificationRecipientService;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.Set;

@Service
public class DefaultNotificationRecipientService implements NotificationRecipientService {
    @Override
    public List<String> resolveRecipients(Projekt projekt) {
        Set<Uzytkownik> uzytkownicy = projekt.getUzytkownicy();
        if (uzytkownicy == null || uzytkownicy.isEmpty()) {
            return Collections.emptyList();
        }

        return uzytkownicy.stream()
                .map(Uzytkownik::getEmail)
                .filter(Objects::nonNull)
                .map(String::trim)
                .filter(email -> !email.isEmpty())
                .distinct()
                .toList();
    }
}
