package com.project.backend.dto;

import com.project.backend.model.RolaUzytkownika;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UzytkownikDto {
    private Integer id;
    private String imie;
    private String nazwisko;
    private String email;
    private RolaUzytkownika rola;
}
