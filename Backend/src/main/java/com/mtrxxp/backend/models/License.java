package com.mtrxxp.backend.models;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
@Table(name = "licenses")
public class License {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    User user;
    @Column(name = "license_key", unique = true, nullable = false)
    UUID licenseKey;
    @Column(nullable = false)
    String tier;
    @Column(name = "daily_limit", nullable = false)
    Integer dailyLimit;
    @Column(name = "applied_today")
    Integer appliedToday;
    @Column(name = "expires_at", nullable = false)
    LocalDateTime expiresAt;
    @Column(name = "last_reset_at")
    LocalDateTime lastResetAt;
    @PrePersist
    protected void onCreate() {
        if (this.licenseKey == null) {
            this.licenseKey = UUID.randomUUID();
        }
        if (this.appliedToday == null) {
            this.appliedToday = 0;
        }
        this.lastResetAt = LocalDateTime.now();
    }
}
