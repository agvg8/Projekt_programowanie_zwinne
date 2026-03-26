package com.project.backend.service;

import com.project.backend.model.Student;
import org.springframework.data.domain.Page;


import org.springframework.data.domain.Pageable;
import java.util.Optional;

public interface StudentService {
    Optional<Student> getStudentOptional(Integer studentId);

    Student getStudent(Integer studentId);

    Student setStudent(Student student);

    void deleteStudent(Student student);

    Page<Student> getStudenci(Pageable pageable);
}
