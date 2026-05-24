package com.himanshu.jauthify.dto;

import java.time.LocalDateTime;

import com.himanshu.jauthify.entity.Session;

import lombok.Data;

@Data
public class SessionResponse {
    private String id;
    private String browserName;
    private String osName;
    private LocalDateTime expiresAt;
    private LocalDateTime createdAt;

    public static SessionResponse toDTO(Session session, String osName, String browserName) {
        SessionResponse sessionResponse = new SessionResponse();

        sessionResponse.setBrowserName(browserName);
        sessionResponse.setOsName(osName);
        sessionResponse.setId(session.getId().toString());
        sessionResponse.setCreatedAt(session.getCreatedAt());
        sessionResponse.setExpiresAt(session.getExpiresAt());

        return sessionResponse;
    }
}
