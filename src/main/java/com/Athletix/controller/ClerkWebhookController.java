//package com.athletix.controller;
//
//import java.util.Base64;
//import java.util.List;
//import java.util.Map;
//
//import com.athletix.entity.Role;
//import com.fasterxml.jackson.databind.ObjectMapper;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import com.athletix.entity.User;
//import com.athletix.repository.UserRepository;
//
//import javax.crypto.Mac;
//import javax.crypto.spec.SecretKeySpec;
//
//@RestController
//@RequestMapping("/api/webhook")
//public class ClerkWebhookController {
//
//	private final UserRepository userRepository;
//
//	@Value("${clerk.webhook.secret}")
//	private String webhookSecret;
//
//	public ClerkWebhookController(UserRepository userRepository) {
//		this.userRepository = userRepository;
//	}
//
//	@PostMapping("/clerk")
//	public ResponseEntity<?> handle(@RequestBody Map<String, Object> payload) {
//		System.out.println("✅ Webhook hit: " + payload);
//		handleUserCreated(payload);
//		return ResponseEntity.ok("Webhook received");
//	}
//
//	@SuppressWarnings("unchecked")
//	private void handleUserCreated(Map<String, Object> payload) {
//		if (!"user.created".equals(payload.get("type"))) return;
//
//		Map<String, Object> data = (Map<String, Object>) payload.get("data");
//		String clerkId = (String) data.get("id");
//		List<Map<String, String>> emails = (List<Map<String, String>>) data.get("email_addresses");
//		String email = emails.get(0).get("email_address");
//
//		Role role;
//		Map<String, Object> meta = (Map<String, Object>) data.get("public_metadata");
//		if (meta != null && meta.get("role") != null)
//			role = Role.valueOf(meta.get("role").toString().toUpperCase());
//        else {
//            role = Role.PLAYER;
//        }
//
//        userRepository.findByClerkId(clerkId)
//				.ifPresentOrElse(u -> {}, () -> {
//					User u = User.builder()
//							.clerkId(clerkId)
//							.email(email)
//							.role(role)
//							.build();
//					userRepository.save(u);
//				});
//	}
//}
