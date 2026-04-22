package com.project.backend.notification.service;

import com.project.backend.model.Projekt;

import java.util.List;

public interface NotificationRecipientService {
    List<String> resolveRecipients(Projekt projekt);
}
