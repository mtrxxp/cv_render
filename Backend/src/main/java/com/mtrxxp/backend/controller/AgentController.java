package com.mtrxxp.backend.controller;

import com.mtrxxp.backend.models.License;
import com.mtrxxp.backend.repository.LicenseRepository;
import com.mtrxxp.backend.service.LicenseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/agent")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AgentController {
    private final LicenseRepository licenseRepository;
    private final LicenseService licenseService;

    /**
     * Валидация лицензионного ключа десктоп-приложением
     * Endpoint для проверки валидности ключа и получения конфигурации
     */
    @PostMapping("/validate")
    public ResponseEntity<?> validateLicenseKey(@RequestBody Map<String, String> request) {
        try {
            String licenseKeyStr = request.get("licenseKey");

            if (licenseKeyStr == null || licenseKeyStr.isBlank()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "License key is required"));
            }

            UUID licenseKey = UUID.fromString(licenseKeyStr);

            License license = licenseRepository.findByLicenseKey(licenseKey)
                    .orElseThrow(() -> new RuntimeException("Invalid license key"));

            license = licenseService.validateAndResetIfNeeded(license);

            if (!licenseService.isLicenseActive(license)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of(
                                "error", "License has expired",
                                "expiredAt", license.getExpiresAt()
                        ));
            }

            Map<String, Object> response = new HashMap<>();
            response.put("valid", true);
            response.put("tier", license.getTier());
            response.put("dailyLimit", license.getDailyLimit());
            response.put("appliedToday", license.getAppliedToday());
            response.put("canApply", licenseService.canApply(license));
            response.put("expiresAt", license.getExpiresAt());
            response.put("isActive", true);

            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Invalid license key format"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Регистрация отправленной заявки от десктоп-приложения
     * Инкрементирует счетчик appliedToday
     */
    @PostMapping("/application")
    public ResponseEntity<?> registerApplication(@RequestBody Map<String, String> request) {
        try {
            String licenseKeyStr = request.get("licenseKey");

            if (licenseKeyStr == null || licenseKeyStr.isBlank()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "License key is required"));
            }

            UUID licenseKey = UUID.fromString(licenseKeyStr);

            License license = licenseRepository.findByLicenseKey(licenseKey)
                    .orElseThrow(() -> new RuntimeException("Invalid license key"));

            if (!licenseService.canApply(license)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of(
                                "error", "Daily limit reached or license expired",
                                "appliedToday", license.getAppliedToday(),
                                "dailyLimit", license.getDailyLimit()
                        ));
            }

            license = licenseService.incrementApplicationCount(license);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("appliedToday", license.getAppliedToday());
            response.put("dailyLimit", license.getDailyLimit());
            response.put("remainingToday", license.getDailyLimit() - license.getAppliedToday());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Получение статистики по лицензии для отображения в десктоп-приложении
     */
    @GetMapping("/stats")
    public ResponseEntity<?> getLicenseStats(@RequestHeader("X-Agent-License-Key") String licenseKeyStr) {
        try {
            UUID licenseKey = UUID.fromString(licenseKeyStr);

            License license = licenseRepository.findByLicenseKey(licenseKey)
                    .orElseThrow(() -> new RuntimeException("Invalid license key"));

            license = licenseService.validateAndResetIfNeeded(license);

            Map<String, Object> response = new HashMap<>();
            response.put("tier", license.getTier());
            response.put("appliedToday", license.getAppliedToday());
            response.put("dailyLimit", license.getDailyLimit());
            response.put("expiresAt", license.getExpiresAt());
            response.put("isActive", licenseService.isLicenseActive(license));
            response.put("canApply", licenseService.canApply(license));

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}
