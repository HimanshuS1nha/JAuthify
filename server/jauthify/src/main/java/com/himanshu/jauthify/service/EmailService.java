package com.himanshu.jauthify.service;

import com.himanshu.jauthify.exception.JAuthifyException;

public interface EmailService {
    void sendVerificationEmail(String to, String subject, String otp) throws JAuthifyException;

    void sendOrganizationInviteEmail(String to, String organizationName, String inviteId) throws JAuthifyException;

    void sendResetPasswordEmail(String to, String otp) throws JAuthifyException;
}
