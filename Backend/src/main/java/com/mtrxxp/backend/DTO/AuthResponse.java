package com.mtrxxp.backend.DTO;

import java.util.UUID;

public record AuthResponse(
        String email,
        UUID licenseKey,
        String tier,
        String message
) {
}
