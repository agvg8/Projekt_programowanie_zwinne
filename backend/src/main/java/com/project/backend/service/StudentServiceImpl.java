package com.project.backend.service;

import com.project.backend.model.Student;
import com.project.backend.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class StudentServiceImpl implements StudentService {

    public final StudentRepository studentRepository;

    @Override
    public Optional<Student> getStudentOptional(Integer studentId) {
        return studentRepository.findById(studentId);
    }

    @Override
    public Student getStudent(Integer studentId) {
        return getStudentOptional(studentId).orElseThrow(
                () -> new RuntimeException(("Nie znaleziono studneta z id: " + studentId))
        );
    }

    @Override
    public Student setStudent(Student student) {
        return studentRepository.save(student);
    }

    @Override
    public void deleteStudent(Student student) {
        studentRepository.delete(student);
    }

    @Override
    public Page<Student> getStudenci(Pageable pageable) {
        return studentRepository.findAll(pageable);
    }
}