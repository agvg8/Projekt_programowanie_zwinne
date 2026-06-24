package com.project.backend;

import com.project.backend.model.Projekt;
import com.project.backend.model.Zadanie;
import com.project.backend.repository.ZadanieRepository;
import com.project.backend.service.ProjektService;
import com.project.backend.service.ZadanieServiceImpl;
import jakarta.validation.ValidationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ZadanieServiceUnitTest {

    @Mock
    private ZadanieRepository zadanieRepository;

    @Mock
    private ProjektService projektService;

    @InjectMocks
    private ZadanieServiceImpl zadanieService;

    private Zadanie zadanie;

    @BeforeEach
    void setUp() {
        zadanie = new Zadanie();
        zadanie.setZadanieId(1);
    }

    // -------------------------
    // getZadanieOptional
    // -------------------------

    @Test
    void getZadanieOptional_whenExists_shouldReturnZadanie() {
        when(zadanieRepository.findById(1)).thenReturn(Optional.of(zadanie));

        Optional<Zadanie> result = zadanieService.getZadanieOptional(1);

        assertTrue(result.isPresent());
        assertEquals(1, result.get().getZadanieId());
        verify(zadanieRepository).findById(1);
    }

    @Test
    void getZadanieOptional_whenNotExists_shouldReturnEmpty() {
        when(zadanieRepository.findById(1)).thenReturn(Optional.empty());

        Optional<Zadanie> result = zadanieService.getZadanieOptional(1);

        assertTrue(result.isEmpty());
        verify(zadanieRepository).findById(1);
    }

    @Test
    void getZadanie_whenExists_shouldReturnZadanie() {
        when(zadanieRepository.findById(1)).thenReturn(Optional.of(zadanie));

        Zadanie result = zadanieService.getZadanie(1);

        assertNotNull(result);
        assertEquals(1, result.getZadanieId());
    }

    @Test
    void getZadanie_whenNotExists_shouldThrowException() {
        when(zadanieRepository.findById(1)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> zadanieService.getZadanie(1));

        assertTrue(ex.getMessage().contains("Nie znaleziono zadania o id: 1"));
    }

    @Test
    void setZadanie_shouldSaveAndReturnEntity() {
        when(zadanieRepository.save(zadanie)).thenReturn(zadanie);

        Zadanie result = zadanieService.setZadanie(zadanie);

        assertEquals(zadanie, result);
        verify(zadanieRepository).save(zadanie);
    }

    @Test
    void deleteZadanie_shouldCallRepository() {
        doNothing().when(zadanieRepository).deleteById(1);

        zadanieService.deleteZadanie(1);

        verify(zadanieRepository).deleteById(1);
    }

    @Test
    void getZadania_shouldReturnPage() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Zadanie> page = new PageImpl<>(List.of(zadanie));

        when(zadanieRepository.findAll(pageable)).thenReturn(page);

        Page<Zadanie> result = zadanieService.getZadania(pageable);

        assertEquals(1, result.getContent().size());
        verify(zadanieRepository).findAll(pageable);
    }

    @Test
    void searchByNazwa_shouldReturnPage() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Zadanie> page = new PageImpl<>(List.of(zadanie));

        when(zadanieRepository.findByNazwaContainingIgnoreCase("Test", pageable)).thenReturn(page);

        Page<Zadanie> result = zadanieService.searchByNazwa("Test", pageable);

        assertEquals(1, result.getContent().size());
        verify(zadanieRepository).findByNazwaContainingIgnoreCase("Test", pageable);
    }

    @Test
    void getZadaniaByProjektAndNazwa_shouldReturnPage() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Zadanie> page = new PageImpl<>(List.of(zadanie));

        when(zadanieRepository.findByProjekt_ProjektIdAndNazwaContainingIgnoreCase(1, "Test", pageable)).thenReturn(page);

        Page<Zadanie> result = zadanieService.getZadaniaByProjektAndNazwa(1, "Test", pageable);

        assertEquals(1, result.getContent().size());
        verify(zadanieRepository).findByProjekt_ProjektIdAndNazwaContainingIgnoreCase(1, "Test", pageable);
    }

    @Test
    void powinienPrzypisacZadanieDoProjektu() {
        // given
        Integer zadanieId = 1;
        Integer projektId = 2;

        Zadanie zadanie = new Zadanie();
        zadanie.setZadanieId(zadanieId);

        Projekt projekt = new Projekt();
        projekt.setProjektId(projektId);

        when(zadanieRepository.findById(zadanieId)).thenReturn(Optional.of(zadanie));

        when(projektService.getProjekt(projektId)).thenReturn(projekt);

        when(zadanieRepository.save(zadanie)).thenReturn(zadanie);

        // when
        zadanieService.przypiszZadanie(zadanieId, projektId);

        // then
        assertNotNull(zadanie.getProjekt());
        assertEquals(projektId, zadanie.getProjekt().getProjektId());
        verify(projektService).getProjekt(projektId);
        verify(zadanieRepository).save(zadanie);
    }

    @Test
    void powinienUsunacPrzypisanieZadaniaZProjektu() throws ValidationException {
        // given
        Integer zadanieId = 1;
        Integer projektId = 2;

        Projekt projekt = new Projekt();
        projekt.setProjektId(projektId);

        Zadanie zadanie = new Zadanie();
        zadanie.setZadanieId(zadanieId);
        zadanie.setProjekt(projekt);

        when(zadanieRepository.findById(zadanieId)).thenReturn(Optional.of(zadanie));

        // when
        zadanieService.usunPrzypisanieZadania(zadanieId, projektId);

        // then
        assertNull(zadanie.getProjekt());

        verify(zadanieRepository).save(zadanie);
    }

    @Test
    void powinienRzucicWyjatekGdyZadanieNieJestPrzypisaneDoProjektu()
            throws ValidationException {

        // given
        Integer zadanieId = 1;
        Integer projektId = 2;

        Zadanie zadanie = new Zadanie();
        zadanie.setZadanieId(zadanieId);
        zadanie.setProjekt(null);

        when(zadanieRepository.findById(zadanieId)).thenReturn(Optional.of(zadanie));

        // when + then
        ValidationException exception = assertThrows(
                ValidationException.class,
                () -> zadanieService.usunPrzypisanieZadania(zadanieId, projektId)
        );

        assertEquals(
                "Zadanie nie jest przypisane do tego projektu",
                exception.getMessage()
        );

        verify(zadanieRepository, never()).save(any());
    }

    @Test
    void powinienRzucicWyjatekGdyZadanieJestPrzypisaneDoInnegoProjektu()
            throws ValidationException {

        // given
        Integer zadanieId = 1;
        Integer obecnyProjektId = 5;
        Integer wymaganyProjektId = 2;

        Projekt projekt = new Projekt();
        projekt.setProjektId(obecnyProjektId);

        Zadanie zadanie = new Zadanie();
        zadanie.setZadanieId(zadanieId);
        zadanie.setProjekt(projekt);

        when(zadanieRepository.findById(zadanieId))
                .thenReturn(Optional.of(zadanie));

        // when + then
        ValidationException exception = assertThrows(
                ValidationException.class,
                () -> zadanieService.usunPrzypisanieZadania(zadanieId, wymaganyProjektId)
        );

        assertEquals("Zadanie nie jest przypisane do tego projektu", exception.getMessage());

        verify(zadanieRepository, never()).save(any());
    }
}