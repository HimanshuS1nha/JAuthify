package com.himanshu.jauthify.service;

import com.himanshu.jauthify.dto.ChangePasswordRequest;
import com.himanshu.jauthify.dto.LoginRequest;
import com.himanshu.jauthify.dto.LoginResponse;
import com.himanshu.jauthify.dto.RegisterRequest;
import com.himanshu.jauthify.entity.User;
import com.himanshu.jauthify.enums.OtpPurpose;
import com.himanshu.jauthify.exception.JAuthifyException;

public interface UserService {
    String register(RegisterRequest userData) throws JAuthifyException;

    LoginResponse login(LoginRequest userData, String ipAddress, String userAgent) throws JAuthifyException;

    User findByEmail(String userEmail) throws JAuthifyException;

    void verifyEmail(String userEmail, String otp) throws JAuthifyException;

    void changePassword(ChangePasswordRequest passwords, String userEmail) throws JAuthifyException;

    void forgotPassword(String email) throws JAuthifyException;

    String verifyForgotPasswordAttempt(String email, String otp) throws JAuthifyException;

    void resetPassword(String resetPasswordToken, String newPassword) throws JAuthifyException;

    void resendOtp(String userEmail, OtpPurpose purpose) throws JAuthifyException;
}
