package com.project.backend.notification.model;

import com.project.backend.model.Projekt;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "projekt_status_notification",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_notification_projekt_week", columnNames = {"projekt_id", "week_start"})
        }
)
@Getter
@Setter
@NoArgsConstructor
public class ProjektStatusNotification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "notification_id")
    private Long notificationId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "projekt_id", nullable = false)
    private Projekt projekt;

    @Column(name = "week_start", nullable = false)
    private LocalDate weekStart;

    @Column(name = "sent_at", nullable = false)
    private LocalDateTime sentAt;

    @Column(name = "recipient_count", nullable = false)
    private Integer recipientCount;
}
