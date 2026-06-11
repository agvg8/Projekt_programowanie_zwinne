package com.project.backend.service;

import com.project.backend.exception.HttpException;
import com.project.backend.model.Projekt;
import com.project.backend.model.ProjektZalacznik;
import com.project.backend.repository.ProjektZalacznikRepository;
import com.project.backend.service.storage.AttachmentStorageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ProjektZalacznikServiceImpl implements ProjektZalacznikService {
    private final ProjektService projektService;
    private final ProjektZalacznikRepository projektZalacznikRepository;
    private final AttachmentStorageService storageService;
    private final Set<String> allowedTypes;
    private final Long maxSizeBytes;

    public ProjektZalacznikServiceImpl(
            ProjektService projektService,
            ProjektZalacznikRepository projektZalacznikRepository,
            AttachmentStorageService storageService,
            @Value("${attachments.allowed-types}") String allowedTypes,
            @Value("${attachments.max-size-bytes}") long maxSizeBytes
    ) {
        this.projektService = projektService;
        this.projektZalacznikRepository = projektZalacznikRepository;
        this.storageService = storageService;
        this.allowedTypes = Arrays.stream(allowedTypes.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toSet());
        this.maxSizeBytes = maxSizeBytes;
    }

    @Override
    public ProjektZalacznik addZalacznik(Integer projektId, MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new HttpException("Plik nie może być pusty!");
        }
        if (file.getSize() > maxSizeBytes) {
            throw new HttpException(HttpStatus.PAYLOAD_TOO_LARGE, new HttpHeaders());
        }
        String contentType = file.getContentType();
        if (contentType == null || !allowedTypes.contains(contentType)) {
            throw new HttpException(HttpStatus.UNSUPPORTED_MEDIA_TYPE, new HttpHeaders());
        }

        Projekt projekt = projektService.getProjekt(projektId);
        String storedFilename = storageService.store(file);

        ProjektZalacznik zalacznik = new ProjektZalacznik();
        zalacznik.setProjekt(projekt);
        zalacznik.setOriginalFilename(file.getOriginalFilename());
        zalacznik.setStoredFilename(storedFilename);
        zalacznik.setContentType(contentType);
        zalacznik.setSize(file.getSize());

        return projektZalacznikRepository.save(zalacznik);
    }

    @Override
    public List<ProjektZalacznik> getZalaczniki(Integer projektId) {
        projektService.getProjekt(projektId);
        return projektZalacznikRepository.findByProjekt_ProjektIdOrderByUploadedAtDesc(projektId);
    }

    @Override
    public DownloadedAttachment downloadZalacznik(Integer projektId, Integer zalacznikId) {
        ProjektZalacznik zalacznik = projektZalacznikRepository
                .findByZalacznikIdAndProjekt_ProjektId(zalacznikId, projektId)
                .orElseThrow(() -> new HttpException(HttpStatus.NOT_FOUND, new HttpHeaders()));
        return new DownloadedAttachment(
                storageService.loadAsResource(zalacznik.getStoredFilename()),
                zalacznik.getContentType(),
                zalacznik.getOriginalFilename()
        );
    }
}

