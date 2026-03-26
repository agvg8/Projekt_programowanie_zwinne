package com.project.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;

@Setter
@Getter
@NoArgsConstructor
@Entity
@Table(name = "zadanie")
public class Zadanie {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "zadanie_id")
    private Integer zadanieId;

    @Column(nullable = false, length = 50)
    private String nazwa;

    @Column(length = 1000)
    private String opis;

    @Column
    private Integer kolejnosc;

    @Column(name = "dataczas_dodania", nullable = false)
    private LocalDateTime dataczasDodania;

    @LastModifiedDate
    @Column(name = "dataczas_modyfikacji", insertable = false)
    private LocalDateTime lastModifiedDate;

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