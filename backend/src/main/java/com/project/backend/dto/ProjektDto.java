package com.project.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@NoArgsConstructor
@Getter
@Setter
public class ProjektDto {
    private Integer projektId;
    @NotBlank(message = "Nazwa projektu jest wymagana")
    @Size(min = 3, max = 50, message = "Nazwa musi zawierać od {min} do {max} znaków!")
    private String nazwa;
    @Size(max = 1000, message = "Opis nie może być dłuższy niż {max} znaków!")
    private String opis;
    private LocalDateTime dataOddania;
}
