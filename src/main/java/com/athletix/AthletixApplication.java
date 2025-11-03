package com.athletix;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;

@SpringBootApplication
public class AthletixApplication {

	public static void main(String[] args) {

		// Load .env file into environment
		Dotenv dotenv = Dotenv.configure()
				.directory("./")
				.ignoreIfMissing()
				.load();

		System.setProperty("DB_HOST", dotenv.get("DB_HOST", "localhost"));
		System.setProperty("DB_PORT", dotenv.get("DB_PORT", "5432"));
		System.setProperty("DB_NAME", dotenv.get("DB_NAME", "athletix"));
		System.setProperty("DB_USERNAME", dotenv.get("DB_USERNAME", "postgres"));
		System.setProperty("DB_PASSWORD", dotenv.get("DB_PASSWORD", "password"));
		System.setProperty("JWT_SECRET", dotenv.get("JWT_SECRET", "fallback-secret"));

		new SpringApplicationBuilder(AthletixApplication.class).run(args);
	}

}
