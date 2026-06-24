package com.project.backend.controller;

import com.project.backend.dto.ProjektZalacznikDto;
import com.project.backend.model.Projekt;
import com.project.backend.model.ProjektZalacznik;
import com.project.backend.model.Zadanie;
import com.project.backend.service.ProjektService;
import com.project.backend.service.ProjektZalacznikService;
import com.project.backend.service.ZadanieService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/projekt")
@CrossOrigin(origins = "http://localhost:5173")
@Tag(name = "Projekt")
@RequiredArgsConstructor
public class ProjektRestController {
    private final ProjektService projektService;
    private final ProjektZalacznikService projektZalacznikService;
    private final ZadanieService zadanieService;

    @GetMapping("/{projektId}")
    public ResponseEntity<Projekt> getProjekt(@PathVariable("projektId") Integer projektId) {
        return ResponseEntity.ok(projektService.getProjekt(projektId));
    }

    @PostMapping
    public ResponseEntity<Void> createProjekt(@Valid @RequestBody Projekt projekt) {
        Projekt saved = projektService.setProjekt(projekt);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .header("Location", "/api/projekt/" + saved.getProjektId())
                .build();
    }

    @PutMapping("/{projektId}")
    public ResponseEntity<Void> updateProjekt(@Valid @RequestBody Projekt projekt, @PathVariable("projektId") Integer projektId) {
        return projektService.getProjektOptional(projektId)
                .map(p -> {
                    projekt.setProjektId(projektId);
                    projektService.setProjekt(projekt);
                    return new ResponseEntity<Void>(HttpStatus.OK);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{projektId}")
    public ResponseEntity<Void> deleteProjekt(@PathVariable("projektId") Integer projektId) {
        return projektService.getProjektOptional(projektId).map(p -> {
            projektService.deleteProjekt(projektId);
            return new ResponseEntity<Void>(HttpStatus.OK);
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping
    public Page<Projekt> getProjekty(Pageable pageable) {
        return projektService.getProjekty(pageable);
    }

    @GetMapping(params = "nazwa")
    public Page<Projekt> getProjektyByNazwa(@RequestParam(name = "nazwa") String nazwa, Pageable pageable) {
        return projektService.searchByNazwa(nazwa, pageable);
    }

    @GetMapping("/{projektId}/zadania")
    public Page<Zadanie> getZadaniaByProjekt(
            @PathVariable Integer projektId,
            @RequestParam(name = "nazwa", required = false) String nazwa,
            Pageable pageable){
        if (nazwa != null && !nazwa.trim().isEmpty()) {
            return zadanieService.getZadaniaByProjektAndNazwa(projektId, nazwa, pageable);
        }
        return zadanieService.getZadaniaByProjekt(projektId, pageable);
    }

    @PostMapping(value = "/{projektId}/zalaczniki", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProjektZalacznikDto> uploadZalacznik(
            @PathVariable Integer projektId,
            @RequestParam("file") MultipartFile file,
            HttpServletRequest request
    ) {

        ProjektZalacznik zalacznik = projektZalacznikService.addZalacznik(projektId, file);
        String downloadUrl = "/api/projekt/" + projektId + "/zalaczniki/" + zalacznik.getZalacznikId();
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .header(HttpHeaders.LOCATION, downloadUrl)
                .body(ProjektZalacznikDto.from(zalacznik, downloadUrl));
    }

    @GetMapping("/{projektId}/zalaczniki")
    public List<ProjektZalacznikDto> getZalaczniki(@PathVariable Integer projektId) {
        return projektZalacznikService.getZalaczniki(projektId).stream()
                .map(z -> ProjektZalacznikDto.from(
                        z,
                        "/api/projekt/" + projektId + "/zalaczniki/" + z.getZalacznikId()
                ))
                .toList();
    }

    @GetMapping("/{projektId}/zalaczniki/{zalacznikId}")
    public ResponseEntity<Resource> downloadZalacznik(
            @PathVariable Integer projektId,
            @PathVariable Integer zalacznikId
    ) {
        ProjektZalacznikService.DownloadedAttachment attachment =
                projektZalacznikService.downloadZalacznik(projektId, zalacznikId);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(attachment.contentType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + attachment.filename() + "\"")
                .body(attachment.resource());
    }

    @PatchMapping("/{projektId}/przypisz/uzytkownik/{uzytkownikId}")
    public ResponseEntity<Void> przypiszUzytkownika(@PathVariable Integer projektId, @PathVariable Integer uzytkownikId)
    {
        projektService.przypiszUzytkownika(projektId, uzytkownikId);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{projektId}/usun/uzytkownik/{uzytkownikId}")
    public ResponseEntity<Void> usunUzytkownika(@PathVariable Integer projektId, @PathVariable Integer uzytkownikId)
    {
        projektService.usunPrzypisanieUzytkownika(projektId, uzytkownikId);
        return ResponseEntity.ok().build();
    }
}
