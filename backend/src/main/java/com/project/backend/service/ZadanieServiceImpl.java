package com.project.backend.service;

import java.net.URI;
import java.util.Optional;
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
public class ZadanieServiceImpl implements ZadanieService {
    private static final Logger logger = LoggerFactory.getLogger(ZadanieServiceImpl.class);
    private final RestClient restClient;

    public ZadanieServiceImpl(RestClient restClient) {
        this.restClient = restClient;
    }

    private String getResourcePath() { return "/api/zadania"; }
    private String getResourcePath(Integer id) { return String.format("%s/%d", getResourcePath(), id); }

    @Override
    public Optional<Zadanie> getZadanie(Integer zadanieId) {
        Zadanie zadanie = restClient.get().uri(getResourcePath(zadanieId)).retrieve()
                .onStatus(HttpStatusCode::isError, (req, res) -> { throw new HttpException(res.getStatusCode(), res.getHeaders()); })
                .body(Zadanie.class);
        return Optional.ofNullable(zadanie);
    }

    @Override
    public Zadanie setZadanie(Zadanie zadanie) {
        if (zadanie.getZadanieId() != null) {
            restClient.put().uri(getResourcePath(zadanie.getZadanieId())).contentType(MediaType.APPLICATION_JSON).body(zadanie).retrieve().toBodilessEntity();
            return zadanie;
        } else {
            return restClient.post().uri(getResourcePath()).contentType(MediaType.APPLICATION_JSON).body(zadanie).retrieve().body(Zadanie.class);
        }
    }

    @Override
    public void deleteZadanie(Integer zadanieId) {
        restClient.delete().uri(getResourcePath(zadanieId)).retrieve().toBodilessEntity();
    }

    @Override
    public Page<Zadanie> getZadania(Pageable pageable) {
        URI uri = ServiceUtil.getURI(getResourcePath(), pageable);
        return restClient.get().uri(uri).retrieve().body(new ParameterizedTypeReference<RestResponsePage<Zadanie>>() {});
    }
}