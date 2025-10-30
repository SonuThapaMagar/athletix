package com.athletix.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Athletix.entity.User;
import com.Athletix.repository.UserRepository;

@RestController
@RequestMapping("/api/webhook")
public class ClerkWebhookController {

	private final UserRepository userRepository;

	@Value("${clerk.webhook.secret}")
	private String webhookSecret;

	public ClerkWebhookController(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	@PostMapping("/clerk")
	public ResponseEntity<?> handle(@RequestBody Map<String, Object> payload) {
		String type = (String) payload.get("type");

		if ("user.created".equals(type)) {
			Map<String, Object> data = (Map<String, Object>) payload.get("data");
			String clerkId = (String) data.get("id");

			var emails = (java.util.List<Map<String, String>>) data.get("email_addresses");
			String email = emails.get(0).get("email_address");

			Map<String, Object> metadata = (Map<String, Object>) data.get("public_metadata");
			String role = metadata != null ? (String) metadata.get("role") : "PLAYER";

			User user = User.builder().clerkId(clerkId).email(email).role(role).build();
			userRepository.save(user);

			userRepository.save(user);
		}
		return ResponseEntity.ok().build();
	}

}
