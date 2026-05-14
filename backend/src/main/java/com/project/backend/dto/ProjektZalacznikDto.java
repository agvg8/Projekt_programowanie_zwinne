package com.project.backend.dto;

import com.project.backend.model.ProjektZalacznik;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ProjektZalacznikDto {
    private Integer zalacznikId;
    private String filename;
    private String contentType;
    private long size;
    private LocalDateTime uploadedAt;
    private String downloadUrl;

    public static ProjektZalacznikDto from(ProjektZalacznik zalacznik, String downloadUrl) {
        return new ProjektZalacznikDto(
                zalacznik.getZalacznikId(),
                zalacznik.getOriginalFilename(),
                zalacznik.getContentType(),
                zalacznik.getSize(),
                zalacznik.getUploadedAt(),
                downloadUrl
        );
    }

}

