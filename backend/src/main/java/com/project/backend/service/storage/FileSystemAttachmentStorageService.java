package com.project.backend.service.storage;

import com.project.backend.exception.HttpException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileSystemAttachmentStorageService implements AttachmentStorageService {
    private final Path storageRoot;

    public FileSystemAttachmentStorageService(
            @Value("${attachments.storage.path}") String storagePath
    ) {
        this.storageRoot = Paths.get(storagePath).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.storageRoot);
        } catch (IOException e) {
            throw new HttpException("Nie mozna utworzyc katalogu na zalaczniki", e);
        }
    }

    @Override
    public String store(MultipartFile file) {
        String originalName = file.getOriginalFilename();
        String extension = "";
        if (originalName != null && originalName.contains(".")) {
            extension = originalName.substring(originalName.lastIndexOf('.'));
        }
        String storedFilename = UUID.randomUUID() + extension;
        Path target = storageRoot.resolve(storedFilename).normalize();
        if (!target.startsWith(storageRoot)) {
            throw new HttpException(HttpStatus.BAD_REQUEST, new HttpHeaders());
        }

        try {
            Files.copy(file.getInputStream(), target);
        } catch (IOException e) {
            throw new HttpException("Nie mozna zapisac zalacznika", e);
        }

        return storedFilename;
    }

    @Override
    public Resource loadAsResource(String storedFilename) {
        try {
            Path filePath = storageRoot.resolve(storedFilename).normalize();
            if (!filePath.startsWith(storageRoot)) {
                throw new HttpException(HttpStatus.BAD_REQUEST, new HttpHeaders());
            }
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists() && resource.isReadable()) {
                return resource;
            }
            throw new HttpException(HttpStatus.NOT_FOUND, new HttpHeaders());
        } catch (MalformedURLException e) {
            throw new HttpException("Nie mozna odczytac zalacznika", e);
        }
    }
}

