package com.project.backend.dto;

import com.project.backend.model.RolaUzytkownika;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UzytkownikDto {
    private Integer id;
    @NotBlank(message = "Imie nie może być puste")
    private String nazwisko;
    @NotBlank(message = "Nazwisko nie może być puste")
    private String imie;
    @Size(max = 50, message = "Email nie może być dłuższy niż {max} znaków!")
    private String email;
    @NotNull
    private RolaUzytkownika rola;
}
