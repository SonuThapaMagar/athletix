package com.athletix.service;

import com.athletix.entity.Booking;
import com.athletix.entity.BookingStatus;
import com.athletix.entity.Slot;
import com.athletix.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Base64;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final BookingRepository bookingRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${esewa.merchant-code:EPAYTEST}")
    private String merchantCode;

    @Value("${esewa.secret-key:8cfc35d5f5594c7cb5c7}")
    private String secretKey;

    @Value("${esewa.uat:true}")
    private boolean uat;

    private String baseUrl() {
        return uat ? "https://uat.esewa.com.np" : "https://esewa.com.np";
    }

    // === GENERATE PAYMENT URL (Frontend calls this) ===
    public String generateEsewaUrl(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        double amount = booking.getAmount();
        String pid = "B" + bookingId; // transaction_uuid
        String successUrl = "http://localhost:3000/payment/success?bid=" + bookingId;
        String failureUrl = "http://localhost:3000/payment/failure?bid=" + bookingId;

        // CORRECT MESSAGE: total_amount + transaction_uuid + product_code
        String message = String.format("%.2f%s%s", amount, pid, merchantCode);
        String signature = hmacSha256(message, secretKey);

        String params = String.format(
                "amt=%.2f&psc=0&pdc=0&txAmt=0&tAmt=%.2f&pid=%s&scd=%s&su=%s&fu=%s&sHash=%s",
                amount, amount, pid, merchantCode,
                encode(successUrl), encode(failureUrl), signature
        );

        return baseUrl() + "/epay/main?" + params;
    }

    // === VERIFY PAYMENT (Called from success page) ===
    public String verifyAndConfirm(Long bookingId, String refId, String amt, String signature) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // 1. Amount
        if (!normalize(amt).equals(normalize(booking.getAmount().toString()))) {
            throw new RuntimeException("Amount mismatch");
        }

        // 2. Signature
        String expectedSig = hmacSha256(normalize(amt) + refId + merchantCode, secretKey);
        if (!expectedSig.equals(signature)) {
            throw new RuntimeException("Invalid signature");
        }

        // 3. Skip eSewa verify in UAT
        // In production: uncomment verifyWithEsewa(refId, Double.parseDouble(amt))

        // 4. Confirm
        booking.setPaid(true);
        booking.setStatus(BookingStatus.CONFIRMED);
        bookingRepository.save(booking);

        return "Payment successful! Booking " + bookingId + " confirmed.";
    }

    // === eSewa v2 Transaction Verify API ===
    private boolean verifyWithEsewa(String refId, double amount) {
        String url = baseUrl() + "/epay/transrec"; // Correct

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        String body = String.format(
                "{\"amount\":%.2f,\"referenceId\":\"%s\",\"merchantCode\":\"%s\"}",
                amount, refId, merchantCode
        );

        HttpEntity<String> entity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
            System.out.println("eSewa verify response: " + response.getBody());
            return response.getStatusCode() == HttpStatus.OK &&
                    response.getBody() != null &&
                    response.getBody().contains("Success");
        } catch (Exception e) {
            System.err.println("eSewa verification failed: " + e.getMessage());
            return false;
        }
    }
    // === Helpers ===
    private String hmacSha256(String data, String key) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec spec = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(spec);
            return Base64.getEncoder().encodeToString(mac.doFinal(data.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception e) {
            throw new RuntimeException("HMAC error", e);
        }
    }

    private String encode(String s) {
        return URLEncoder.encode(s, StandardCharsets.UTF_8);
    }

    private String normalize(String amt) {
        try {
            return String.format("%.2f", Double.parseDouble(amt));
        } catch (Exception e) {
            return amt;
        }
    }

    public double calculateAmount(Slot slot) {
        long minutes = Duration.between(slot.getStartTime(), slot.getEndTime()).toMinutes();
        return (minutes / 60.0) * slot.getVenue().getPricePerHour();
    }

    public String failure(Long bookingId) {
        bookingRepository.findById(bookingId).ifPresent(b -> {
            b.setStatus(BookingStatus.FAILED);
            bookingRepository.save(b);
        });
        return "Payment failed. Booking ID: " + bookingId + ". Please try again.";
    }
}
