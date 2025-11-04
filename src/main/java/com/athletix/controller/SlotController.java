package com.athletix.controller;

import com.athletix.dto.slot.SlotRequest;
import com.athletix.dto.slot.SlotResponse;
import com.athletix.service.SlotService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/slots")
@RequiredArgsConstructor
public class SlotController {
    private final SlotService slotService;

    @PostMapping("/add/{venueId}")
    public ResponseEntity<SlotResponse> add(@PathVariable Long venueId,
                                            @Valid @RequestBody SlotRequest req,
                                            @RequestHeader("Authorization") String auth) {
        return ResponseEntity.ok(slotService.addSlot(venueId, req, auth));
    }

    @DeleteMapping("/remove/{slotId}")
    public ResponseEntity<?> remove(@PathVariable Long slotId,
                                    @RequestHeader("Authorization") String auth) {
        slotService.removeSlot(slotId, auth);
        return ResponseEntity.ok("Slot removed");
    }

    @GetMapping("/available/{venueId}")
    public ResponseEntity<List<SlotResponse>> available(@PathVariable Long venueId) {
        return ResponseEntity.ok(slotService.getAvailableSlots(venueId));
    }
}
