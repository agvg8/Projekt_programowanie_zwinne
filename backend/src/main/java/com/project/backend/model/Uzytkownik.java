package com.project.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@Entity
@Table(name = "uzytkownik",
        indexes = { @Index(name = "idx_nazwisko", columnList = "nazwisko", unique = false) })
@NoArgsConstructor
@Getter
@Setter
public class Uzytkownik {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "uzytkownik_id")
    private Integer uzytkownikId;

    @Column(nullable = false, length = 50)
    private String imie;

    @Column(nullable = false, length = 100)
    private String nazwisko;


    @Column(length = 50)
    private String email;


    @NotNull
    @Convert(converter = UzytkownikRolaConverter.class)
    @Column(nullable = false, length = 20)
    private RolaUzytkownika rola = RolaUzytkownika.USER;

    @ManyToMany(mappedBy = "uzytkownicy")
    @JsonIgnoreProperties({"uzytkownicy"})
    private Set<Projekt> projekty;

    public Uzytkownik(String imie, String nazwisko, String email, RolaUzytkownika rola) {
        this.imie = imie;
        this.nazwisko = nazwisko;
        this.email = email;
        this.rola = rola;
    }

    public Uzytkownik(String imie, String nazwisko, RolaUzytkownika rola) {
        this.imie = imie;
        this.nazwisko = nazwisko;
        this.rola = rola;
    }
}
