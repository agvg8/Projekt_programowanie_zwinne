package com.project.backend;

import com.project.backend.model.Student;
import com.project.backend.repository.StudentRepository;
import com.project.backend.service.StudentServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class StudentServiceUnitTest {

    @Mock
    private StudentRepository studentRepository;

    @InjectMocks
    private StudentServiceImpl studentService;

    private Student student;

    @BeforeEach
    void setUp() {
        student = new Student();
        student.setStudentId(1);
    }

    @Test
    void getStudentOptional_shouldReturnStudent() {
        when(studentRepository.findById(1)).thenReturn(Optional.of(student));

        Optional<Student> result = studentService.getStudentOptional(1);

        assertTrue(result.isPresent());
        assertEquals(1, result.get().getStudentId());
    }

    @Test
    void getStudent_shouldReturnStudent_whenExists() {
        when(studentRepository.findById(1)).thenReturn(Optional.of(student));

        Student result = studentService.getStudent(1);

        assertNotNull(result);
        assertEquals(1, result.getStudentId());
    }

    @Test
    void getStudent_shouldThrowException_whenNotFound() {
        when(studentRepository.findById(1)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> studentService.getStudent(1));

        assertEquals("Nie znaleziono studneta z id: 1", ex.getMessage());
    }

    @Test
    void setStudent_shouldSaveAndReturnStudent() {
        when(studentRepository.save(student)).thenReturn(student);

        Student result = studentService.setStudent(student);

        assertEquals(student, result);
        verify(studentRepository, times(1)).save(student);
    }

    @Test
    void deleteStudent_shouldCallRepository() {
        studentService.deleteStudent(student);

        verify(studentRepository, times(1)).delete(student);
    }

    @Test
    void getStudenci_shouldReturnPageOfStudents() {
        Pageable pageable = PageRequest.of(0, 10);

        Page<Student> page = new PageImpl<>(List.of(student));

        when(studentRepository.findAll(pageable)).thenReturn(page);

        Page<Student> result = studentService.getStudenci(pageable);

        assertEquals(1, result.getContent().size());
        verify(studentRepository).findAll(pageable);
    }
}