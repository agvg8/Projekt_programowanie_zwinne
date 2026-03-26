package com.project.backend.service;

import java.net.URI;
import java.util.Optional;

import com.project.backend.repository.ZadanieRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import com.project.backend.exception.HttpException;
import com.project.backend.model.Zadanie;

@Service
@RequiredArgsConstructor
public class ZadanieServiceImpl implements ZadanieService {
    private static final Logger logger = LoggerFactory.getLogger(ZadanieServiceImpl.class);
    private final ZadanieRepository zadanieRepository;
    @Override
    public Optional<Zadanie> getZadanie(Integer zadanieId) {
        return zadanieRepository.findById(zadanieId);
    }

    @Override
    public Zadanie setZadanie(Zadanie zadanie) {
        return zadanieRepository.save(zadanie);
    }

    @Override
    public void deleteZadanie(Integer zadanieId) {
        zadanieRepository.deleteById(zadanieId);
    }

    @Override
    public Page<Zadanie> getZadania(Pageable pageable) {
        return zadanieRepository.findZadania(pageable);
    }
}