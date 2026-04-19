package com.project.backend;

import com.project.backend.controller.ProjektRestController;
import com.project.backend.model.Projekt;
import com.project.backend.service.ProjektServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.Optional;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;
import static org.junit.jupiter.api.Assertions.assertAll;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class ProjektRestControllerUnitTest {

    @Mock
    private ProjektServiceImpl mockProjektService;

    @InjectMocks
    private ProjektRestController projectController;

    @Test
    void getProject_whenValidId_shouldReturnGivenProject() {
        Projekt projekt = new Projekt("Nazwa1", "Opis1");
        projekt.setProjektId(1);

        when(mockProjektService.getProjekt(1)).thenReturn(projekt);

        ResponseEntity<Projekt> responseEntity = projectController.getProjekt(1);

        assertAll(
                () -> assertEquals(HttpStatus.OK, responseEntity.getStatusCode()),
                () -> assertEquals(projekt, responseEntity.getBody())
        );
    }

    @Test
    void createProject_whenValidData_shouldCreateProject() {
        MockHttpServletRequest request = new MockHttpServletRequest();
        RequestContextHolder.setRequestAttributes(new ServletRequestAttributes(request));

        Projekt projekt = new Projekt("Nazwa1", "Opis1");
        projekt.setProjektId(1);

        when(mockProjektService.setProjekt(any(Projekt.class))).thenReturn(projekt);

        ResponseEntity<Void> responseEntity = projectController.createProjekt(projekt);

        assertThat(responseEntity.getStatusCode(), is(HttpStatus.CREATED));
        assertThat(responseEntity.getHeaders().getLocation().getPath(), is("/api/projekt/1"));
    }

    @Test
    void deleteProject_whenInvalidId_shouldReturnNotFound() {
        when(mockProjektService.getProjektOptional(100)).thenReturn(Optional.empty());

        ResponseEntity<Void> responseEntity = projectController.deleteProjekt(100);

        assertThat(responseEntity.getStatusCode(), is(HttpStatus.NOT_FOUND));
    }
}