package com.project.backend.service;

import com.project.backend.model.ProjektZalacznik;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ProjektZalacznikService {
    ProjektZalacznik addZalacznik(Integer projektId, MultipartFile file);
    List<ProjektZalacznik> getZalaczniki(Integer projektId);
    DownloadedAttachment downloadZalacznik(Integer projektId, Integer zalacznikId);

    record DownloadedAttachment(Resource resource, String contentType, String filename) {
    }
}

