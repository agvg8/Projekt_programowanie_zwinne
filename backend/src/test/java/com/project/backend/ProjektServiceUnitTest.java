package com.project.backend;

import com.project.backend.model.Projekt;
import com.project.backend.model.Uzytkownik;
import com.project.backend.repository.ProjektRepository;
import com.project.backend.repository.ZadanieRepository;
import com.project.backend.service.ProjektServiceImpl;
import com.project.backend.service.UzytkownikService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProjektServiceUnitTest {

    @Mock
    private ProjektRepository projektRepository;

    @Mock
    private ZadanieRepository zadanieRepository;

    @InjectMocks
    private ProjektServiceImpl projektService;

    @Mock
    private UzytkownikService uzytkownikService;

    private Projekt projekt;

    @BeforeEach
    void setUp() {
        projekt = new Projekt("Test", "Opis");
        projekt.setProjektId(1);
    }
    @Test
    void getProjektOptional_shouldReturnProject() {
        when(projektRepository.findById(1)).thenReturn(Optional.of(projekt));

        Optional<Projekt> result = projektService.getProjektOptional(1);

        assertTrue(result.isPresent());
        assertEquals("Test", result.get().getNazwa());
    }

    @Test
    void getProjekt_shouldReturnProject_whenExists() {
        when(projektRepository.findById(1)).thenReturn(Optional.of(projekt));

        Projekt result = projektService.getProjekt(1);

        assertNotNull(result);
        assertEquals(1, result.getProjektId());
    }

    @Test
    void getProjekt_shouldThrowException_whenNotFound() {
        when(projektRepository.findById(1)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> projektService.getProjekt(1));

        assertEquals("Nie znaleziono projektu o id: 1", ex.getMessage());
    }

    @Test
    void setProjekt_shouldSaveAndReturnProject() {
        when(projektRepository.save(projekt)).thenReturn(projekt);

        Projekt result = projektService.setProjekt(projekt);

        assertEquals(projekt, result);
        verify(projektRepository, times(1)).save(projekt);
    }

    @Test
    void deleteProjekt_shouldDeleteTasksAndProject() {
        Integer id = 1;

        when(zadanieRepository.findZadaniaProjektu(id)).thenReturn(List.of());

        projektService.deleteProjekt(id);

        verify(zadanieRepository).findZadaniaProjektu(id);
        verify(zadanieRepository).deleteAll(anyList());
        verify(projektRepository).deleteById(id);
    }

    @Test
    void getProjekty_shouldReturnPage() {
        Pageable pageable = PageRequest.of(0, 10);

        Page<Projekt> page = new PageImpl<>(List.of(projekt));

        when(projektRepository.findAll(pageable)).thenReturn(page);

        Page<Projekt> result = projektService.getProjekty(pageable);

        assertEquals(1, result.getContent().size());
        verify(projektRepository).findAll(pageable);
    }

    @Test
    void searchByNazwa_shouldReturnFilteredProjects() {
        Pageable pageable = PageRequest.of(0, 10);

        Page<Projekt> page = new PageImpl<>(List.of(projekt));

        when(projektRepository.findByNazwaContainingIgnoreCase("test", pageable))
                .thenReturn(page);

        Page<Projekt> result = projektService.searchByNazwa("test", pageable);

        assertEquals(1, result.getContent().size());
        verify(projektRepository)
                .findByNazwaContainingIgnoreCase("test", pageable);
    }
    @Test
    void powinienPrzypisacUzytkownikaDoProjektu() {
        // given
        Integer projektId = 1;
        Integer uzytkownikId = 2;

        Projekt projekt = new Projekt();
        projekt.setProjektId(projektId);
        projekt.setUzytkownicy(new HashSet<>());

        Uzytkownik uzytkownik = new Uzytkownik();
        uzytkownik.setUzytkownikId(uzytkownikId);

        when(projektRepository.findById(projektId))
                .thenReturn(Optional.of(projekt));

        when(uzytkownikService.getUzytkownik(uzytkownikId))
                .thenReturn(uzytkownik);

        when(projektRepository.save(projekt))
                .thenReturn(projekt);

        // when
        projektService.przypiszUzytkownika(projektId, uzytkownikId);

        // then
        assertEquals(1, projekt.getUzytkownicy().size());
        assertTrue(projekt.getUzytkownicy().contains(uzytkownik));

        verify(projektRepository).save(projekt);
    }

    @Test
    void powinienUsunacPrzypisanieUzytkownikaZProjektu() {
        // given
        Integer projektId = 1;
        Integer uzytkownikId = 2;

        Uzytkownik uzytkownik1 = new Uzytkownik();
        uzytkownik1.setUzytkownikId(uzytkownikId);

        Uzytkownik uzytkownik2 = new Uzytkownik();
        uzytkownik2.setUzytkownikId(3);

        Projekt projekt = new Projekt();
        projekt.setProjektId(projektId);
        projekt.setUzytkownicy(new HashSet<>(Set.of(uzytkownik1, uzytkownik2)));

        when(projektRepository.findById(projektId)).thenReturn(Optional.of(projekt));

        when(projektRepository.save(projekt)).thenReturn(projekt);

        // when
        projektService.usunPrzypisanieUzytkownika(projektId, uzytkownikId);

        // then
        assertEquals(1, projekt.getUzytkownicy().size());

        assertFalse(projekt.getUzytkownicy()
                        .stream()
                        .anyMatch(u -> u.getUzytkownikId().equals(uzytkownikId))
        );

        assertTrue(projekt.getUzytkownicy().contains(uzytkownik2));

        verify(projektRepository).save(projekt);
    }
}