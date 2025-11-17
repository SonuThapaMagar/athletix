package com.athletix.config;

import com.athletix.entity.Role;
import com.athletix.entity.User;
import com.athletix.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AdminInit implements ApplicationRunner {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        String adminEmail="admin@athletix.com";

        if (userRepository.findByEmail(adminEmail).isEmpty()) {
            User superAdmin = User.builder()
                    .email(adminEmail)
                    .password(passwordEncoder.encode("Athletix@123"))
                    .name("SUPER_ADMIN")
                    .phone("9800000000")
                    .role(Role.ADMIN)
                    .active(true)
                    .build();

            userRepository.save(superAdmin);
            System.out.println("Super Admin created: admin@athletix.com / password123");
        } else {
            System.out.println("Super Admin already exists. Skipping creation.");
        }
    }
}
