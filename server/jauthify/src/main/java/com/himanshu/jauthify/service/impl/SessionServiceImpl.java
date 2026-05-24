package com.himanshu.jauthify.service.impl;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.himanshu.jauthify.dto.TokenResponse;
import com.himanshu.jauthify.entity.Organization;
import com.himanshu.jauthify.entity.Session;
import com.himanshu.jauthify.entity.User;
import com.himanshu.jauthify.exception.JAuthifyException;
import com.himanshu.jauthify.repository.SessionRepository;
import com.himanshu.jauthify.security.JWTService;
import com.himanshu.jauthify.service.OrganizationService;
import com.himanshu.jauthify.service.SessionService;

import lombok.RequiredArgsConstructor;

@Service("sessionService")
@RequiredArgsConstructor
@Transactional
public class SessionServiceImpl implements SessionService {
    private final JWTService jwtService;
    private final SessionRepository sessionRepository;
    private final OrganizationService organizationService;

    @Override
    public String create(User user, String ipAddress, String userAgent, String activeOrganizationId) {
        LocalDateTime expiresAt = LocalDateTime.now().plusDays(10);

        Session session = new Session();
        session.setIpAddress(ipAddress);
        session.setUser(user);
        session.setLastUsedAt(LocalDateTime.now());
        session.setUserAgent(userAgent);
        session.setExpiresAt(expiresAt);
        session.setActiveOrganizationId(activeOrganizationId);

        String sessionId = sessionRepository.save(session).getId().toString();
        session.setId(UUID.fromString(sessionId));

        String refreshToken = jwtService.generateRefreshToken(sessionId,
                Date.from(expiresAt.atZone(ZoneId.systemDefault()).toInstant()));

        session.setRefreshTokenHash(DigestUtils.sha256Hex(refreshToken));

        sessionRepository.save(session);

        return refreshToken;
    }

    @Override
    public TokenResponse generateNewTokens(String refreshToken) throws JAuthifyException {
        if (!jwtService.extractExpiration(refreshToken).after(new Date())) {
            throw new JAuthifyException("Token has expired. Please login again", HttpStatus.UNAUTHORIZED);
        }

        String sessionId = jwtService.extractSubject(refreshToken);
        if (sessionId == null) {
            throw new JAuthifyException("Token is invalid. Please login again", HttpStatus.UNAUTHORIZED);
        }

        Session session = sessionRepository.findById(UUID.fromString(sessionId)).orElseThrow(
                () -> new JAuthifyException("Token is invalid. Please login again", HttpStatus.UNAUTHORIZED));

        String refreshTokenHash = DigestUtils.sha256Hex(refreshToken);

        if (!session.getRefreshTokenHash().equals(refreshTokenHash)) {
            throw new JAuthifyException("Token is invalid. Please login again", HttpStatus.UNAUTHORIZED);
        }

        LocalDateTime expiresAt = LocalDateTime.now().plusDays(10);

        String newRefreshToken = jwtService.generateRefreshToken(sessionId,
                Date.from(expiresAt.atZone(ZoneId.systemDefault()).toInstant()));

        session.setExpiresAt(expiresAt);
        session.setLastUsedAt(LocalDateTime.now());
        session.setRefreshTokenHash(DigestUtils.sha256Hex(newRefreshToken));

        if (session.getActiveOrganizationId() == null) {
            List<Organization> organizations = organizationService
                    .findAllByUserId(session.getUser().getId().toString());
            if (!organizations.isEmpty()) {
                session.setActiveOrganizationId(organizations.get(0).getId().toString());
            }
        }

        sessionRepository.save(session);

        String newAccessToken = jwtService.generateAccessToken(session.getUser().getEmail(),
                session.getActiveOrganizationId());

        return new TokenResponse(newAccessToken, newRefreshToken);
    }

    @Override
    public Session getById(String sessionId) throws JAuthifyException {
        return sessionRepository.findById(UUID.fromString(sessionId)).orElseThrow(
                () -> new JAuthifyException("Session not found. Please login again!", HttpStatus.UNAUTHORIZED));
    }

    @Override
    public Boolean deleteSession(String refreshToken) throws JAuthifyException {
        if (!jwtService.extractExpiration(refreshToken).after(new Date())) {
            return false;
        }

        String sessionId = jwtService.extractSubject(refreshToken);
        if (sessionId == null) {
            return false;
        }

        Session session = sessionRepository.findById(UUID.fromString(sessionId)).orElseThrow(
                () -> new JAuthifyException("Token is invalid. Unable to logout", HttpStatus.UNAUTHORIZED));

        String refreshTokenHash = DigestUtils.sha256Hex(refreshToken);

        if (!session.getRefreshTokenHash().equals(refreshTokenHash)) {
            return false;
        }

        sessionRepository.delete(session);

        return true;
    }

    @Override
    public void deleteAllSessions(String userId) throws JAuthifyException {
        sessionRepository.deleteByUserId(UUID.fromString(userId));
    }

    @Override
    public void deleteByActiveOrganizationId(String organizationId) {
        sessionRepository.deleteByActiveOrganizationId(organizationId);
    }

    @Override
    public TokenResponse updateSession(String organizationId, String refreshToken) throws JAuthifyException {
        if (!jwtService.extractExpiration(refreshToken).after(new Date())) {
            throw new JAuthifyException("Please login again", HttpStatus.UNAUTHORIZED);
        }

        String sessionId = jwtService.extractSubject(refreshToken);
        if (sessionId == null) {
            throw new JAuthifyException("Please login again", HttpStatus.UNAUTHORIZED);
        }

        Session session = sessionRepository.findById(UUID.fromString(sessionId))
                .orElseThrow(() -> new JAuthifyException("Session not found", HttpStatus.NOT_FOUND));

        LocalDateTime expiresAt = LocalDateTime.now().plusDays(10);

        session.setActiveOrganizationId(organizationId);
        session.setExpiresAt(expiresAt);

        String newAccessToken = jwtService.generateAccessToken(session.getUser().getEmail(),
                session.getActiveOrganizationId());

        String newRefreshToken = jwtService.generateRefreshToken(sessionId,
                Date.from(expiresAt.atZone(ZoneId.systemDefault()).toInstant()));

        sessionRepository.save(session);

        return new TokenResponse(newAccessToken, newRefreshToken);
    }

    @Override
    public List<Session> getByUserId(String userId) throws JAuthifyException {
        return sessionRepository.findByUserId(UUID.fromString(userId));
    }

}
