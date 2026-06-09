package com.mtrxxp.backend.controller;

import com.mtrxxp.backend.models.License;
import com.mtrxxp.backend.models.User;
import com.mtrxxp.backend.repository.LicenseRepository;
import com.mtrxxp.backend.repository.UserRepository;
import com.mtrxxp.backend.service.JwtService;
import com.mtrxxp.backend.service.LicenseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/dashboard")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class DashboardController {
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final LicenseRepository licenseRepository;
    private final LicenseService licenseService;

    @GetMapping("/license")
    public ResponseEntity<?> getDashboardData(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7);
            String email = jwtService.extractEmail(token);

            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            License license = licenseRepository.findByUserId(user.getId())
                    .orElseThrow(() -> new RuntimeException("License not found for user ID: " + user.getId()));

            // Проверяем и обновляем счетчик если прошло 24 часа
            license = licenseService.validateAndResetIfNeeded(license);

            // Вычисляем сколько дней осталось до истечения лицензии
            String expiresIn = calculateExpiresIn(license.getExpiresAt());

            Map<String, Object> response = new HashMap<>();
            response.put("email", user.getEmail());
            response.put("licenseKey", license.getLicenseKey());
            response.put("tier", license.getTier());
            response.put("dailyLimit", license.getDailyLimit());
            response.put("appliedToday", license.getAppliedToday());
            response.put("expiresIn", expiresIn);
            response.put("expiresAt", license.getExpiresAt());
            response.put("isActive", licenseService.isLicenseActive(license));

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized access"));
        }
    }

    private String calculateExpiresIn(LocalDateTime expiresAt) {
        LocalDateTime now = LocalDateTime.now();

        if (expiresAt.isBefore(now)) {
            return "Expired";
        }

        Duration duration = Duration.between(now, expiresAt);
        long days = duration.toDays();

        if (days > 0) {
            return days + " days";
        } else {
            long hours = duration.toHours();
            return hours + " hours";
        }
    }
}
