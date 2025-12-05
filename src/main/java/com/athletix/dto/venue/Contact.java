package com.athletix.dto.venue;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record Contact(
//        @NotBlank(message = "Phone is required") String phone,
//        @NotBlank(message = "Email is required") @Email(message = "Invalid email") String email

        String phone,
        String email) {}