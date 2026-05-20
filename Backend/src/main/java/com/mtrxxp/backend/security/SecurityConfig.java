package com.mtrxxp.backend.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // ИСПРАВЛЕНО: Убрали слэш на конце и добавили звездочки, чтобы пускало любые запросы авторизации (register, login)
                        .requestMatchers("/auth/**").permitAll()

                        // ИСПРАВЛЕНО: Если личный кабинет обрабатывает токен вручную через try-catch внутри контроллера,
                        // ставим .permitAll(), чтобы фильтр Spring Security не блокировал его на входе.
                        .requestMatchers("/dashboard/license").permitAll()

                        // Если твой коллега-робот будет слать запросы на адреса вроде /agent/...
                        .requestMatchers("/agent/**").permitAll()

                        .anyRequest().authenticated()
                );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // ИСПРАВЛЕНО: Разрешаем любые порты для localhost и 127.0.0.1,
        // чтобы запросы от Nginx и Vite внутри докера и снаружи не резались
        configuration.setAllowedOriginPatterns(List.of(
                "http://localhost:[*]",
                "http://127.0.0.1:[*]"
        ));

        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // КРИТИЧЕСКИ ВАЖНО: Добавили заголовки для бесперебойной работы робота твоего коллеги (например X-Agent-License-Key)
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "Cache-Control", "X-Agent-License-Key"));
        configuration.setExposedHeaders(List.of("Authorization"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}