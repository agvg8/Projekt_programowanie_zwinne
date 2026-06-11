package com.project.backend.service.storage;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

public interface AttachmentStorageService {
    String store(MultipartFile file);
    Resource loadAsResource(String storedFilename);
}

