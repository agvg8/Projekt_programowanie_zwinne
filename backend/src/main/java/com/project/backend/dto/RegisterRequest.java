package com.project.backend.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@NoArgsConstructor
public class RegisterRequest {
    private String name;
    private String surname;
    private String email;
    private String password;
}
