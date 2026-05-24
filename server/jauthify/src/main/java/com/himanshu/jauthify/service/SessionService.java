package com.himanshu.jauthify.service;

import java.util.List;

import com.himanshu.jauthify.dto.TokenResponse;
import com.himanshu.jauthify.entity.Session;
import com.himanshu.jauthify.entity.User;
import com.himanshu.jauthify.exception.JAuthifyException;

public interface SessionService {
    String create(User user, String ipAddress, String userAgent, String activeOrganizationId);

    TokenResponse generateNewTokens(String refreshToken) throws JAuthifyException;

    Session getById(String sessionId) throws JAuthifyException;

    Boolean deleteSession(String refreshToken) throws JAuthifyException;

    void deleteAllSessions(String userId) throws JAuthifyException;

    void deleteByActiveOrganizationId(String organizationId);

    TokenResponse updateSession(String organizationId, String refreshToken) throws JAuthifyException;

    List<Session> getByUserId(String userId) throws JAuthifyException;
}
