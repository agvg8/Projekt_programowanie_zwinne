package com.project.backend.notification.service;

import java.util.List;

public interface EmailSender {
    void send(String from, List<String> recipients, String subject, String body);
}
