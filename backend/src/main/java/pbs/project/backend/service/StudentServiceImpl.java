package com.project.service;

import java.net.URI;
import java.util.Optional;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import com.project.model.Student;

@Service
public class StudentServiceImpl implements StudentService {
    private final RestClient restClient;
    public StudentServiceImpl(RestClient restClient) { this.restClient = restClient; }

    private String getResourcePath() { return "/api/studenci"; }

    @Override
    public Optional<Student> getStudent(Integer studentId) {
        return Optional.ofNullable(restClient.get().uri(getResourcePath() + "/" + studentId).retrieve().body(Student.class));
    }

    @Override
    public Student setStudent(Student student) {
        if (student.getStudentId() != null) {
            restClient.put().uri(getResourcePath() + "/" + student.getStudentId()).contentType(MediaType.APPLICATION_JSON).body(student).retrieve().toBodilessEntity();
            return student;
        } else {
            return restClient.post().uri(getResourcePath()).contentType(MediaType.APPLICATION_JSON).body(student).retrieve().body(Student.class);
        }
    }

    @Override
    public void deleteStudent(Integer studentId) {
        restClient.delete().uri(getResourcePath() + "/" + studentId).retrieve().toBodilessEntity();
    }

    @Override
    public Page<Student> getStudenci(Pageable pageable) {
        URI uri = ServiceUtil.getURI(getResourcePath(), pageable);
        return restClient.get().uri(uri).retrieve().body(new ParameterizedTypeReference<RestResponsePage<Student>>() {});
    }
}