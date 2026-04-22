package com.project.backend.notification.service.impl;

import com.project.backend.model.Projekt;
import com.project.backend.model.Student;
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
        Set<Student> students = projekt.getStudenci();
        if (students == null || students.isEmpty()) {
            return Collections.emptyList();
        }

        return students.stream()
                .map(Student::getEmail)
                .filter(Objects::nonNull)
                .map(String::trim)
                .filter(email -> !email.isEmpty())
                .distinct()
                .toList();
    }
}
