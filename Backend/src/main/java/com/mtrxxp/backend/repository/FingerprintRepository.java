package com.mtrxxp.backend.repository;

import com.mtrxxp.backend.models.HardwareFingerprint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FingerprintRepository extends JpaRepository<HardwareFingerprint, Long> {
    boolean existsByVisitorId(String visitorId);
}
