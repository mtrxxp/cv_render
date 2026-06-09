package com.mtrxxp.backend.service;

import com.mtrxxp.backend.models.License;
import com.mtrxxp.backend.repository.LicenseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
public class LicenseService {
    private final LicenseRepository licenseRepository;

    @Transactional
    public License validateAndResetIfNeeded(License license) {
        if (license.getLastResetAt() == null) {
            license.setLastResetAt(LocalDateTime.now());
            license.setAppliedToday(0);
            return licenseRepository.save(license);
        }

        long hoursSinceLastReset = ChronoUnit.HOURS.between(license.getLastResetAt(), LocalDateTime.now());

        if (hoursSinceLastReset >= 24) {
            license.setAppliedToday(0);
            license.setLastResetAt(LocalDateTime.now());
            return licenseRepository.save(license);
        }

        return license;
    }

    public boolean isLicenseActive(License license) {
        return license.getExpiresAt().isAfter(LocalDateTime.now());
    }

    public boolean canApply(License license) {
        if (!isLicenseActive(license)) {
            return false;
        }

        license = validateAndResetIfNeeded(license);

        if ("PRO".equalsIgnoreCase(license.getTier()) || "UNLIMITED".equalsIgnoreCase(license.getTier())) {
            return true;
        }

        return license.getAppliedToday() < license.getDailyLimit();
    }

    @Transactional
    public License incrementApplicationCount(License license) {
        license.setAppliedToday(license.getAppliedToday() + 1);
        return licenseRepository.save(license);
    }
}
