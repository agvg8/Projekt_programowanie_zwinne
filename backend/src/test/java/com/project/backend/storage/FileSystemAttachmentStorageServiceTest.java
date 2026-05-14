package com.project.backend.storage;

import com.project.backend.service.storage.FileSystemAttachmentStorageService;
import org.junit.jupiter.api.Test;
import org.springframework.core.io.Resource;
import org.springframework.mock.web.MockMultipartFile;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;

import static org.junit.jupiter.api.Assertions.assertTrue;

public class FileSystemAttachmentStorageServiceTest {

    @Test
    void storeAndLoad_roundTrip() throws Exception {
        Path tempDir = Files.createTempDirectory("attachments-test-");
        FileSystemAttachmentStorageService service = new FileSystemAttachmentStorageService(tempDir.toString());

        MockMultipartFile file = new MockMultipartFile(
                "file",
                "test.txt",
                "text/plain",
                "hello".getBytes(StandardCharsets.UTF_8)
        );

        String stored = service.store(file);
        Resource resource = service.loadAsResource(stored);

        assertTrue(resource.exists());
        assertTrue(resource.isReadable());
    }
}

