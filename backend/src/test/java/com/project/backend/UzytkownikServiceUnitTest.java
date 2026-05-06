package com.project.backend;

import com.project.backend.model.Uzytkownik;
import com.project.backend.repository.UzytkownikRepository;
import com.project.backend.service.UzytkownikServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UzytkownikServiceUnitTest {

    @Mock
    private UzytkownikRepository uzytkownikRepository;

    @InjectMocks
    private UzytkownikServiceImpl uzytkownikService;

    private Uzytkownik uzytkownik;

    @BeforeEach
    void setUp() {
        uzytkownik = new Uzytkownik();
        uzytkownik.setUzytkownikId(1);
    }

    @Test
    void getUzytkownikOptional_shouldReturnUzytkownik() {
        when(uzytkownikRepository.findById(1)).thenReturn(Optional.of(uzytkownik));

        Optional<Uzytkownik> result = uzytkownikService.getUzytkownikOptional(1);

        assertTrue(result.isPresent());
        assertEquals(1, result.get().getUzytkownikId());
    }

    @Test
    void getUzytkownik_shouldReturnUzytkownik_whenExists() {
        when(uzytkownikRepository.findById(1)).thenReturn(Optional.of(uzytkownik));

        Uzytkownik result = uzytkownikService.getUzytkownik(1);

        assertNotNull(result);
        assertEquals(1, result.getUzytkownikId());
    }

    @Test
    void getUzytkownik_shouldThrowException_whenNotFound() {
        when(uzytkownikRepository.findById(1)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> uzytkownikService.getUzytkownik(1));

        assertEquals("Nie znaleziono uzytkownika z id: 1", ex.getMessage());
    }

    @Test
    void setUzytkownik_shouldSaveAndReturnUzytkownik() {
        when(uzytkownikRepository.save(uzytkownik)).thenReturn(uzytkownik);

        Uzytkownik result = uzytkownikService.setUzytkownik(uzytkownik);

        assertEquals(uzytkownik, result);
        verify(uzytkownikRepository, times(1)).save(uzytkownik);
    }

    @Test
    void deleteUzytkownik_shouldCallRepository() {
        uzytkownikService.deleteUzytkownik(uzytkownik);

        verify(uzytkownikRepository, times(1)).delete(uzytkownik);
    }

    @Test
    void getUzytkownicy_shouldReturnPageOfUzytkownicy() {
        Pageable pageable = PageRequest.of(0, 10);

        Page<Uzytkownik> page = new PageImpl<>(List.of(uzytkownik));

        when(uzytkownikRepository.findAll(pageable)).thenReturn(page);

        Page<Uzytkownik> result = uzytkownikService.getUzytkownicy(pageable);

        assertEquals(1, result.getContent().size());
        verify(uzytkownikRepository).findAll(pageable);
    }
}
