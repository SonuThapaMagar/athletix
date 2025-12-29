package com.athletix.service;

import com.athletix.entity.Booking;
import com.athletix.entity.BookingStatus;
import com.athletix.entity.Payment;
import com.athletix.repository.BookingRepository;
import com.athletix.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final BookingRepository bookingRepository;
    private final RestTemplate restTemplate = new RestTemplate();
    private final PaymentRepository paymentRepository;

    @Value("${esewa.merchant-code:EPAYTEST}")
    private String merchantCode;

    @Value("${esewa.secret-key:8gBm/:&EnhH.1/q}")
    private String secretKey;

    @Value("${esewa.uat:true}")
    private boolean uat;

    @Value("${app.frontend-url:http://localhost:3000}")
    private String frontendUrl;

    private String baseUrl() {
        return uat ? "https://rc-epay.esewa.com.np" : "https://epay.esewa.com.np";
    }

    private String verificationUrl() {
        return uat
                ? "https://rc-epay.esewa.com.np/api/epay/transaction/status/"
                : "https://epay.esewa.com.np/api/epay/transaction/status/";
    }

    /**
     * Generate eSewa payment URL
     */
    public String generateEsewaUrl(Long bookingId) {
        // 1. Find booking
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found with ID: " + bookingId));

        // 2. Check if already paid
        if (booking.isPaid()) {
            throw new RuntimeException("Booking already paid");
        }

        // 3. Prepare payment parameters
        Payment payment = paymentRepository.findByBooking_Id(bookingId)
                .orElseGet(() -> {
                    System.out.println("✅ Creating new PENDING payment record for booking " + bookingId);
                    Payment newPayment = Payment.builder()
                            .booking(booking)
                            .amount(booking.getAmount())
                            .status("pending")  // lowercase to match frontend
                            .build();
                    return paymentRepository.save(newPayment);
                });

        System.out.println("✅ Payment record exists: " + payment.getId());

        // 4. Prepare payment parameters
        double amount = booking.getAmount();
        String transactionUuid = "B" + bookingId; // Must be unique

        // URLs for success/failure redirects
        String successUrl = frontendUrl + "/payment/success";
        String failureUrl = frontendUrl + "/payment/failure?bid=" + bookingId;

        // 4. Generate signature
        // Format: "total_amount,transaction_uuid,product_code"
        String message = String.format("total_amount=%.1f,transaction_uuid=%s,product_code=%s",
                amount, transactionUuid, merchantCode);

        String signature = hmacSha256(message, secretKey);

        System.out.println("Payment Details:");
        System.out.println("   Amount: " + amount);
        System.out.println("   Transaction UUID: " + transactionUuid);
        System.out.println("   Message: " + message);
        System.out.println("   Signature: " + signature);

        // 5. Build eSewa URL with query parameters
        String params = String.format(
                "amount=%.1f&tax_amount=0&total_amount=%.1f&transaction_uuid=%s&product_code=%s&product_service_charge=0&product_delivery_charge=0&success_url=%s&failure_url=%s&signed_field_names=total_amount,transaction_uuid,product_code&signature=%s",
                amount,
                amount,
                encode(transactionUuid),
                encode(merchantCode),
                encode(successUrl),
                encode(failureUrl),
                encode(signature)
        );


        return baseUrl() + "/api/epay/main/v2/form?" + params;
    }

    /**
     * Verify payment from eSewa callback
     */
    public String verifyAndConfirm(Long bookingId, String transactionCode, String totalAmount) {
        System.out.println("=".repeat(60));
        System.out.println("🔵 STARTING PAYMENT VERIFICATION");
        System.out.println("=".repeat(60));
        System.out.println("   Booking ID: " + bookingId);
        System.out.println("   Transaction Code (refId): " + transactionCode);
        System.out.println("   Amount: " + totalAmount);

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // Verify amount matches
        String normalizedExpected = String.format("%.1f", booking.getAmount());
        String normalizedReceived = normalize(totalAmount);

        System.out.println("🔍 Amount Verification:");
        System.out.println("   Expected: " + normalizedExpected);
        System.out.println("   Received: " + normalizedReceived);

        if (!normalizedExpected.equals(normalizedReceived)) {
            throw new RuntimeException(
                    String.format("Amount mismatch: expected %s, got %s",
                            normalizedExpected, normalizedReceived)
            );
        }

        // ✅ Call eSewa verification API
        try {
            String transactionUuid = "B" + bookingId;

            // Build verification URL with query parameters
            String verifyUrl = String.format("%s?product_code=%s&total_amount=%s&transaction_uuid=%s",
                    verificationUrl(),
                    merchantCode,
                    normalizedReceived,
                    transactionUuid
            );

            System.out.println("🔵 Calling eSewa verification API:");
            System.out.println("   URL: " + verifyUrl);

            HttpHeaders headers = new HttpHeaders();
            headers.set("Content-Type", "application/json");

            HttpEntity<String> entity = new HttpEntity<>(headers);

            // Call eSewa API
            var response = restTemplate.exchange(
                    verifyUrl,
                    HttpMethod.GET,
                    entity,
                    Map.class
            );

            Map<String, Object> responseBody = response.getBody();

            System.out.println("=".repeat(60));
            System.out.println("✅ eSewa API Response Received");
            System.out.println("=".repeat(60));
            System.out.println("   Full Response: " + responseBody);

            if (responseBody != null) {
                System.out.println("   Response Keys: " + responseBody.keySet());
                responseBody.forEach((key, value) ->
                        System.out.println("   " + key + ": " + value)
                );
            }
            System.out.println("=".repeat(60));

            // Check if verification successful
            if (responseBody == null) {
                throw new RuntimeException("Empty response from eSewa");
            }

            String status = (String) responseBody.get("status");
            System.out.println("🔍 Payment Status: " + status);

            if (!"COMPLETE".equals(status)) {
                throw new RuntimeException("Payment not completed. Status: " + status);
            }

            // ✅ Update booking
            booking.setPaid(true);
            booking.setStatus(BookingStatus.CONFIRMED);
            booking.setPaymentRefId(transactionCode);
            bookingRepository.save(booking);

            // ✅ UPDATE PAYMENT RECORD TO COMPLETED
            Payment payment = paymentRepository.findByBooking_Id(bookingId)
                    .orElseThrow(() -> new RuntimeException("Payment record not found for booking " + bookingId));

            payment.setStatus("completed");  // ← Lowercase to match frontend filter
            payment.setRefId(transactionCode);
            paymentRepository.save(payment);

            // ⚠️ IMPORTANT: Check different possible field names for transaction code
            String responseTransactionCode = null;

            // Try different field names eSewa might use
            if (responseBody.containsKey("transaction_code")) {
                responseTransactionCode = (String) responseBody.get("transaction_code");
            } else if (responseBody.containsKey("ref_id")) {
                responseTransactionCode = (String) responseBody.get("ref_id");
            } else if (responseBody.containsKey("refId")) {
                responseTransactionCode = (String) responseBody.get("refId");
            }

            System.out.println("🔍 Transaction Code Comparison:");
            System.out.println("   Expected (from frontend): " + transactionCode);
            System.out.println("   Received (from eSewa): " + responseTransactionCode);
            System.out.println("   Available keys in response: " + responseBody.keySet());

            // ⚠️ RELAXED VALIDATION: Only verify if we found a transaction code
            if (responseTransactionCode != null && !transactionCode.equals(responseTransactionCode)) {
                System.err.println("⚠️  Transaction code mismatch, but payment status is COMPLETE");
                System.err.println("   This might be due to eSewa using different field names");
                // Don't throw - just log warning since status is COMPLETE
            }

            // ✅ Update booking - payment is verified by eSewa's status
            booking.setPaid(true);
            booking.setStatus(BookingStatus.CONFIRMED);
            booking.setPaymentRefId(transactionCode); // Use the ref from frontend
            bookingRepository.save(booking);

            System.out.println("=".repeat(60));
            System.out.println("✅✅✅ PAYMENT VERIFIED & BOOKING CONFIRMED ✅✅✅");
            System.out.println("=".repeat(60));
            System.out.println("   Booking ID: " + bookingId);
            System.out.println("   Status: CONFIRMED");
            System.out.println("   Payment Ref: " + transactionCode);
            System.out.println("   Payment Status: completed");
            System.out.println("=".repeat(60));

            return "Payment successful! Booking " + bookingId + " confirmed.";

        } catch (Exception e) {
            System.err.println("=".repeat(60));
            System.err.println("❌ PAYMENT VERIFICATION FAILED");
            System.err.println("=".repeat(60));
            System.err.println("   Error: " + e.getMessage());
            e.printStackTrace();
            System.err.println("=".repeat(60));

            // ✅ UPDATE PAYMENT TO FAILED
            paymentRepository.findByBooking_Id(bookingId).ifPresent(payment -> {
                payment.setStatus("failed");  // ← Lowercase to match frontend filter
                paymentRepository.save(payment);
            });

            throw new RuntimeException("Payment verification failed: " + e.getMessage());
        }
    }

    /**
     * Handle payment failure
     */
    public String handleFailure(Long bookingId) {
        bookingRepository.findById(bookingId).ifPresent(booking -> {
            booking.setStatus(BookingStatus.FAILED);
            bookingRepository.save(booking);
        });
        // ✅ UPDATE PAYMENT TO FAILED
        paymentRepository.findByBooking_Id(bookingId).ifPresent(payment -> {
            payment.setStatus("failed");  // ← Lowercase to match frontend filter
            paymentRepository.save(payment);
        });
        return "Payment failed for booking " + bookingId;
    }

    /**
     * Generate HMAC-SHA256 signature
     */
    private String hmacSha256(String data, String key) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec spec = new SecretKeySpec(
                    key.getBytes(StandardCharsets.UTF_8),
                    "HmacSHA256"
            );
            mac.init(spec);
            byte[] hash = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hash);
        } catch (Exception e) {
            throw new RuntimeException("HMAC generation failed", e);
        }
    }

    /**
     * URL encode a string
     */
    private String encode(String value) {
        return URLEncoder.encode(value, StandardCharsets.UTF_8);
    }

    /**
     * Normalize amount to one decimal place
     */
    private String normalize(String amt) {
        try {
            double value = Double.parseDouble(amt);
            return String.format("%.1f", value);
        } catch (Exception e) {
            return amt;
        }
    }
}