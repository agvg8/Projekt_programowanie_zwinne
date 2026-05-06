package com.project.backend.model;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class UzytkownikRolaConverter implements AttributeConverter<RolaUzytkownika, String> {
    @Override
    public String convertToDatabaseColumn(RolaUzytkownika attribute) {
        return attribute == null ? null : attribute.getValue();
    }

    @Override
    public RolaUzytkownika convertToEntityAttribute(String dbData) {
        return dbData == null ? null : RolaUzytkownika.fromValue(dbData);
    }
}
