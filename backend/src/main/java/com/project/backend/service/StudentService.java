package com.project.backend.service;

import com.project.backend.model.Student;
import org.springframework.data.domain.Page;


import org.springframework.data.domain.Pageable;
import java.util.Optional;

public interface StudentService {
    Optional<Student> getStudent(Integer studentId);

    Student setStudent(Student student);

    void deleteStudent(Student studentId);

    Page<Student> getStudenci(Pageable pageable);
}
