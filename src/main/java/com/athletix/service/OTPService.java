package com.athletix.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class OTPService {

    private final EmailService emailService;

    // Store OTPs in memory with expiration (consider Redis for production)
    private final Map<String, OTPData> otpStore = new ConcurrentHashMap<>();

    private static final int OTP_LENGTH = 6;
    private static final int OTP_EXPIRY_MINUTES = 10;
    private static final SecureRandom random = new SecureRandom();

    public String generateOTP(String email) {
        // Generate 6-digit OTP
        String otp = String.format("%06d", random.nextInt(1000000));

        // Store with expiration
        otpStore.put(email, new OTPData(otp, LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES)));

        // Send email
        String subject = "Password Reset OTP - Athletix";
        String message = String.format(
                "Your OTP for password reset is: %s\n\n" +
                        "This OTP will expire in %d minutes.\n\n" +
                        "If you didn't request this, please ignore this email.",
                otp, OTP_EXPIRY_MINUTES
        );

        emailService.sendEmail(email, subject, message);

        return otp; // Return for testing purposes only
    }

    public boolean verifyOTP(String email, String otp) {
        OTPData storedData = otpStore.get(email);

        if (storedData == null) {
            return false;
        }

        // Check expiration
        if (LocalDateTime.now().isAfter(storedData.expiryTime)) {
            otpStore.remove(email);
            return false;
        }

        // Verify OTP
        boolean isValid = storedData.otp.equals(otp);

        if (isValid) {
            otpStore.remove(email); // Remove after successful verification
        }

        return isValid;
    }

    public void clearOTP(String email) {
        otpStore.remove(email);
    }

    // Inner class to store OTP data
    private static class OTPData {
        String otp;
        LocalDateTime expiryTime;

        OTPData(String otp, LocalDateTime expiryTime) {
            this.otp = otp;
            this.expiryTime = expiryTime;
        }
    }
}