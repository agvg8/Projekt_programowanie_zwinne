package com.project.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;

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

    @Column(nullable = false)
    private Integer kolejnosc;

    @Column(name = "dataczas_dodania")
    private LocalDateTime dataczasDodania;

    @ManyToOne
    @JoinColumn(name = "projekt_id")
    @JsonIgnoreProperties({"zadania"})
    private Projekt projekt;

    public Zadanie() {}

    public Zadanie(String nazwa, String opis, Integer kolejnosc) {
        this.nazwa = nazwa;
        this.opis = opis;
        this.kolejnosc = kolejnosc;
    }

    public Integer getZadanieId() { return zadanieId; }
    public void setZadanieId(Integer zadanieId) { this.zadanieId = zadanieId; }
    public String getNazwa() { return nazwa; }
    public void setNazwa(String nazwa) { this.nazwa = nazwa; }
    public String getOpis() { return opis; }
    public void setOpis(String opis) { this.opis = opis; }
    public Integer getKolejnosc() { return kolejnosc; }
    public void setKolejnosc(Integer kolejnosc) { this.kolejnosc = kolejnosc; }
    public LocalDateTime getDataczasDodania() { return dataczasDodania; }
    public void setDataczasDodania(LocalDateTime dataczasDodania) { this.dataczasDodania = dataczasDodania; }
    public Projekt getProjekt() { return projekt; }
    public void setProjekt(Projekt projekt) { this.projekt = projekt; }
}