package com.project.backend;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.jdbc.core.JdbcTemplate;

@SpringBootApplication
@EnableJpaAuditing
public class BackendApplication {
	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	@Bean
	public CommandLineRunner dropConstraints(JdbcTemplate jdbcTemplate) {
		return args -> {
			try {
				jdbcTemplate.execute("ALTER TABLE zadanie DROP CONSTRAINT IF EXISTS zadanie_status_check;");
				System.out.println("SUCCESSFULLY DROPPED zadanie_status_check CONSTRAINT!");
			} catch (Exception e) {
				System.err.println("Failed to drop zadanie_status_check: " + e.getMessage());
			}
			try {
				jdbcTemplate.execute("ALTER TABLE zadanie DROP CONSTRAINT IF EXISTS zadanie_priorytet_check;");
				System.out.println("SUCCESSFULLY DROPPED zadanie_priorytet_check CONSTRAINT!");
			} catch (Exception e) {
				System.err.println("Failed to drop zadanie_priorytet_check: " + e.getMessage());
			}
		};
	}
}