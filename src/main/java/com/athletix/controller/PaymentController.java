package com.athletix.controller;

import com.athletix.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @GetMapping("/test")
    public String test() {
        return "Payment controller working!";
    }

    @GetMapping("/esewa/initiate/{bookingId}")
    public ResponseEntity<String> initiate(@PathVariable Long bookingId) {
        System.out.println("Initiating eSewa payment for bookingId = " + bookingId);
        String url = paymentService.generateEsewaUrl(bookingId);
        System.out.println("Generated URL: " + url);
        return ResponseEntity.ok(url);
    }

    @PostMapping("/esewa/verify")
    public ResponseEntity<String> verify(@RequestBody VerifyRequest req) {
        String msg = paymentService.verifyAndConfirm(
                req.bookingId(),
                req.refId(),        // This is transactionUuid (e.g., "B1")
                req.amt(),
                req.signature()
        );
        return ResponseEntity.ok(msg);
    }

    @GetMapping("/esewa/failure")
    public ResponseEntity<String> failure(@RequestParam Long bookingId) {
        return ResponseEntity.ok(paymentService.failure(bookingId));
    }
}

record VerifyRequest(Long bookingId, String refId, String amt, String signature) {}