package com.himanshu.jauthify.service;

import com.himanshu.jauthify.entity.User;
import com.himanshu.jauthify.enums.OtpPurpose;
import com.himanshu.jauthify.exception.JAuthifyException;

public interface VerificationOtpService {
    String create(User user, OtpPurpose purpose) throws JAuthifyException;

    Boolean verify(User user, String otp, OtpPurpose purpose) throws JAuthifyException;
}
