package com.mtrxxp.backend.repository;

import com.mtrxxp.backend.models.License;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface LicenseRepository extends JpaRepository<License, Long> {
    Optional<License> findByLicenseKey(UUID licenseKey);
    Optional<License> findByUserId(Long userId);
}
