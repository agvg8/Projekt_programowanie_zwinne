package com.project.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "zadanie",
    indexes = {
        @Index(name = "idx_zadanie_status", columnList = "status"),
        @Index(name = "idx_zadanie_projekt", columnList = "projekt_id")
})
@NoArgsConstructor
@Getter
@Setter
public class Zadanie {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "zadanie_id")
    private Integer zadanieId;

    @Column(nullable = false, length = 50)
    private String nazwa;

    @Column(length = 1000)
    private String opis;

    @Column(nullable = false)
    private Integer kolejnosc;

    @Column(name = "dataczas_dodania")
    private LocalDateTime dataczasDodania;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusZadania status = StatusZadania.MEDIUM;

    @ManyToOne
    @JoinColumn(name = "projekt_id")
    @JsonIgnoreProperties({"zadania"})
    private Projekt projekt;

    public Zadanie(String nazwa, String opis, Integer kolejnosc) {
        this.nazwa = nazwa;
        this.opis = opis;
        this.kolejnosc = kolejnosc;
    }
}