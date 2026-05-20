package com.mtrxxp.backend.service;

import com.mtrxxp.backend.DTO.AuthResponse;
import com.mtrxxp.backend.DTO.LoginRequest;
import com.mtrxxp.backend.DTO.RegisterRequest;
import com.mtrxxp.backend.models.HardwareFingerprint;
import com.mtrxxp.backend.models.License;
import com.mtrxxp.backend.models.User;
import com.mtrxxp.backend.repository.FingerprintRepository;
import com.mtrxxp.backend.repository.LicenseRepository;
import com.mtrxxp.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final LicenseRepository licenseRepository;
    private final FingerprintRepository fingerprintRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthResponse loginUser(LoginRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new RuntimeException("Invalid email or password."));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid email or password.");
        }

        License license = licenseRepository.findById(user.getId())
                .orElseThrow(() -> new RuntimeException("License configuration missing for this account."));

        String token = jwtService.generateToken(user.getEmail());

        return new AuthResponse(
                user.getEmail(),
                license.getLicenseKey(),
                license.getTier(),
                token
        );
    }
    @Transactional
    public AuthResponse registerNewUser(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new RuntimeException("Email address is already registered.");
        }

        if (fingerprintRepository.existsByVisitorId(request.deviceFingerprint())) {
            throw new RuntimeException("Access Denied: This device has already claimed a Free Trial license.");
        }

        String securePasswordHash = passwordEncoder.encode(request.password());

        User user = User.builder()
                .email(request.email())
                .passwordHash(securePasswordHash)
                .build();
        User savedUser = userRepository.save(user);

        License license = License.builder()
                .user(savedUser)
                .licenseKey(UUID.randomUUID())
                .tier("FREE_TRIAL")
                .dailyLimit(50)
                .appliedToday(0)
                .expiresAt(LocalDateTime.now().plusDays(30))
                .build();
        License savedLicense = licenseRepository.save(license);

        HardwareFingerprint fingerprint = HardwareFingerprint.builder()
                .visitorId(request.deviceFingerprint())
                .associatedUser(savedUser)
                .build();
        fingerprintRepository.save(fingerprint);

        return new AuthResponse(
                savedUser.getEmail(),
                savedLicense.getLicenseKey(),
                savedLicense.getTier(),
                "License successfully provisioned."
        );
    }
}
