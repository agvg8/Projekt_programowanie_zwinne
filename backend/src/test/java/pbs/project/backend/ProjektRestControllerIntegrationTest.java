package com.project.rest;

import static org.hamcrest.Matchers.containsString;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInfo;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.json.JacksonTester;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.web.bind.MethodArgumentNotValidException;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.project.backend.model.Projekt;
import com.project.backend.service.ProjektService;

@SpringBootTest
@AutoConfigureMockMvc
@WithMockUser(username = "admin", password = "password123")
public class ProjektRestControllerIntegrationTest {

    private final String apiPath = "/api/projekty";

    @MockBean
    private ProjektService mockProjektService;

    @Autowired
    private MockMvc mockMvc;

    private JacksonTester<Projekt> jacksonTester;

    @BeforeEach
    public void before(TestInfo testInfo) {
        System.out.printf("-- METODA -> %s%n", testInfo.getTestMethod().get().getName());
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        JacksonTester.initFields(this, mapper);
    }

    @AfterEach
    public void after(TestInfo testInfo) {
        System.out.printf("<- KONIEC -- %s%n", testInfo.getTestMethod().get().getName());
    }

    @Test
    public void getProject_whenValidId_shouldReturnGivenProject() throws Exception {
        Projekt projekt = new Projekt("Nazwa2", "Opis2");
        projekt.setProjektId(2);

        when(mockProjektService.getProjekt(2)).thenReturn(Optional.of(projekt));

        mockMvc.perform(get(apiPath + "/{projektId}", 2).accept(MediaType.APPLICATION_JSON))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.projektId").value(2))
                .andExpect(jsonPath("$.nazwa").value("Nazwa2"));

        verify(mockProjektService, times(1)).getProjekt(2);
    }

    @Test
    public void createProject_whenValidData_shouldReturnCreatedStatusWithLocation() throws Exception {
        Projekt projekt = new Projekt("Nazwa3", "Opis3");
        String jsonProjekt = jacksonTester.write(projekt).getJson();

        Projekt savedProjekt = new Projekt("Nazwa3", "Opis3");
        savedProjekt.setProjektId(3);

        when(mockProjektService.setProjekt(any(Projekt.class))).thenReturn(savedProjekt);

        mockMvc.perform(post(apiPath)
                        .content(jsonProjekt)
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.ALL))
                .andExpect(status().isCreated())
                .andExpect(header().string("location", containsString(apiPath + "/3")));
    }

    @Test
    public void getProjectsAndVerifyPagingParams() throws Exception {
        mockMvc.perform(get(apiPath)
                        .param("page", "5")
                        .param("size", "15")
                        .param("sort", "nazwa,desc"))
                .andExpect(status().isOk());

        ArgumentCaptor<Pageable> pageableCaptor = ArgumentCaptor.forClass(Pageable.class);
        verify(mockProjektService).getProjekty(pageableCaptor.capture());

        PageRequest pageable = (PageRequest) pageableCaptor.getValue();
        assertEquals(5, pageable.getPageNumber());
        assertEquals(15, pageable.getPageSize());
        assertEquals(Sort.Direction.DESC, pageable.getSort().getOrderFor("nazwa").getDirection());
    }
}