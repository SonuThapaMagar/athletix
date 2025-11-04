package com.athletix.service;

import com.athletix.entity.Slot;
import com.athletix.repository.SlotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PaymentService {
    private final SlotRepository slotRepository;
    public String initiateEsewa(Long slotId) {
        Slot slot = slotRepository.findById(slotId)
                .orElseThrow(() -> new RuntimeException("Slot not found"));

        if (!slot.isBooked()) throw new RuntimeException("Not booked");

        double amount = calculateAmount(slot);

        return String.format(
                "https://uat.esewa.com.np/#/home?amt=%s&pid=%s&scd=EPAYTEST&tAmt=%s&su=%s&fu=%s",
                amount, slotId, amount,
                "http://localhost:8080/api/payments/esewa/success?sid=" + slotId,
                "http://localhost:8080/api/payments/esewa/failure"
        );
    }

    public String esewaSuccess(Long slotId) {
        // In real app: verify signature
        Slot slot = slotRepository.findById(slotId).orElseThrow();
        // Mark as paid (add paid field later if needed)
        return "Payment successful! Booking confirmed.";
    }

    private double calculateAmount(Slot slot) {
        long minutes = java.time.Duration.between(slot.getStartTime(), slot.getEndTime()).toMinutes();
        return (minutes / 60.0) * slot.getVenue().getPricePerHour();
    }
}
