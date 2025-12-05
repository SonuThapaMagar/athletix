package com.athletix.dto.auth;

import com.athletix.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record RegisterRequest(
        @NotBlank(message = "Name is required")
        String name,

        @Email(message = "Invalid email")
        @NotBlank(message = "Email is required")
        String email,

        @NotBlank(message = "Password is required")
        String password,


        String location,

        @NotBlank(message = "Phone number is required")
        String phone,
        Role role
) {}
