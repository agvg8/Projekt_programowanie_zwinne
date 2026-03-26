package com.project.backend.service;

import java.net.URI;
import java.util.Optional;

import com.project.backend.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import com.project.backend.model.Student;

@Service
@RequiredArgsConstructor
public class StudentServiceImpl implements StudentService {

    public final StudentRepository studentRepository;

    @Override
    public Optional<Student> getStudent(Integer studentId) {

    }

    @Override
    public Student setStudent(Student student) {
    }

    @Override
    public void deleteStudent(Student studentId) {

    }

    @Override
    public Page<Student> getStudenci(Pageable pageable) {
        return null;
    }

    @Override
    public Page<Student> getStudenci(Pageable pageable) {

    }
}