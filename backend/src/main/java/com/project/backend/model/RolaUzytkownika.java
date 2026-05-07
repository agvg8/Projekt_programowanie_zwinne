package com.project.backend.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.Arrays;

@Getter(onMethod_ = @JsonValue)
@RequiredArgsConstructor
public enum RolaUzytkownika {
    USER("user"),
    MANAGER("manager"),
    ADMIN("admin");

    private final String value;

    @JsonCreator
    public static RolaUzytkownika fromValue(String value) {
        return Arrays.stream(values())
                .filter(rola -> rola.value.equals(value))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Nieprawidlowa rola: " + value));
    }
}
