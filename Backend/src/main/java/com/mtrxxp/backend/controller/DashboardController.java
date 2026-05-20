package com.mtrxxp.backend.controller;

import com.mtrxxp.backend.models.License;
import com.mtrxxp.backend.models.User;
import com.mtrxxp.backend.repository.LicenseRepository;
import com.mtrxxp.backend.repository.UserRepository;
import com.mtrxxp.backend.service.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/license")
    public ResponseEntity<?> getDashboardData(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7);
            String email = jwtService.extractEmail(token);

            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            License license = licenseRepository.findByUserId(user.getId())
                    .orElseThrow(() -> new RuntimeException("License not found for user ID: " + user.getId()));

            Map<String, Object> response = new HashMap<>();
            response.put("email", user.getEmail());
            response.put("licenseKey", license.getLicenseKey());
            response.put("tier", license.getTier());
            response.put("dailyLimit", license.getDailyLimit());
            response.put("appliedToday", license.getAppliedToday());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized access"));
        }
    }
}
