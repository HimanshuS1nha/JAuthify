package com.himanshu.jauthify.service.impl;

import java.security.SecureRandom;
import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.himanshu.jauthify.entity.VerificationOtp;
import com.himanshu.jauthify.enums.OtpPurpose;
import com.himanshu.jauthify.entity.User;
import com.himanshu.jauthify.exception.JAuthifyException;
import com.himanshu.jauthify.repository.EmailVerificationOtpRepository;
import com.himanshu.jauthify.service.VerificationOtpService;

import lombok.RequiredArgsConstructor;

@Service("emailVerificationService")
@RequiredArgsConstructor
@Transactional
public class VerificationOtpServiceImpl implements VerificationOtpService {
    private final EmailVerificationOtpRepository emailVerificationOtpRepository;
    private final PasswordEncoder passwordEncoder;

    private static final SecureRandom secureRandom = new SecureRandom();

    private static String generateOtp() {
        StringBuilder otp = new StringBuilder();

        for (int i = 0; i < 6; i++) {
            otp.append(secureRandom.nextInt(10));
        }

        return otp.toString();
    }

    @Override
    public String create(User user, OtpPurpose purpose) throws JAuthifyException {
        // Delete all (1) pre-exisiting records
        emailVerificationOtpRepository.deleteByUserId(user.getId());

        String otp = generateOtp();
        String otpHash = passwordEncoder.encode(otp);

        VerificationOtp emailVerificationOtp = new VerificationOtp();
        emailVerificationOtp.setCreatedAt(LocalDateTime.now());
        emailVerificationOtp.setUser(user);
        emailVerificationOtp.setOtpHash(otpHash);
        emailVerificationOtp.setExpiresAt(LocalDateTime.now().plusMinutes(5)); // 5 mins expiry
        emailVerificationOtp.setOtpPurpose(purpose);

        emailVerificationOtpRepository.save(emailVerificationOtp);

        // Return the unhashed otp
        return otp;
    }

    @Override
    public Boolean verify(User user, String otp, OtpPurpose purpose) throws JAuthifyException {
        VerificationOtp emailVerificationOtp = emailVerificationOtpRepository.findByUserId(user.getId())
                .orElseThrow(() -> new JAuthifyException("OTP record not found", HttpStatus.NOT_FOUND));

        if (!emailVerificationOtp.getOtpPurpose().equals(purpose)) {
            throw new JAuthifyException("OTP record not found", HttpStatus.NOT_FOUND);
        }

        if (emailVerificationOtp.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new JAuthifyException("OTP has expired. Please generate a new one", HttpStatus.FORBIDDEN);
        }

        if (!passwordEncoder.matches(otp, emailVerificationOtp.getOtpHash())) {
            throw new JAuthifyException("Incorrect OTP", HttpStatus.FORBIDDEN);
        }

        emailVerificationOtpRepository.deleteByUserId(user.getId());

        return true;
    }

}
