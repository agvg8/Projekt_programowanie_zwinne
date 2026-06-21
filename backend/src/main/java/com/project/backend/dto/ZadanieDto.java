package com.project.backend.dto;

import com.project.backend.model.Priorytet;
import com.project.backend.model.Status;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@NoArgsConstructor
@Setter
@Getter
public class ZadanieDto {
    private Integer zadanieId;
    @NotBlank(message = "Nazwa zadania jest wymagana")
    @Size(max = 50, message = "Nazwa nie może być dłuższa niż {max} znaków!")
    private String nazwa;
    @Size(max = 1000, message = "Opis nie może być dłuższy niż {max} znaków!")
    private String opis;
    @NotNull
    private Integer kolejnosc;
    private LocalDateTime dataOddania;
    @NotNull
    private Priorytet priorytet;
    @NotNull
    private Status status;
}
