package com.project.backend.service;

import com.project.backend.model.ProjektZalacznik;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ProjektZalacznikService {
    ProjektZalacznik addZalacznik(Integer projektId, MultipartFile file);
    List<ProjektZalacznik> getZalaczniki(Integer projektId);
    DownloadedAttachment downloadZalacznik(Integer projektId, Integer zalacznikId);

    class DownloadedAttachment {
        private final Resource resource;
        private final String contentType;
        private final String filename;

        public DownloadedAttachment(Resource resource, String contentType, String filename) {
            this.resource = resource;
            this.contentType = contentType;
            this.filename = filename;
        }

        public Resource getResource() {
            return resource;
        }

        public String getContentType() {
            return contentType;
        }

        public String getFilename() {
            return filename;
        }
    }
}

