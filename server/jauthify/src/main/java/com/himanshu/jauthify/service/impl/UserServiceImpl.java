package com.himanshu.jauthify.service.impl;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.himanshu.jauthify.dto.ChangePasswordRequest;
import com.himanshu.jauthify.dto.LoginRequest;
import com.himanshu.jauthify.dto.LoginResponse;
import com.himanshu.jauthify.dto.RegisterRequest;
import com.himanshu.jauthify.dto.UserDTO;
import com.himanshu.jauthify.entity.Organization;
import com.himanshu.jauthify.entity.User;
import com.himanshu.jauthify.enums.OtpPurpose;
import com.himanshu.jauthify.exception.JAuthifyException;
import com.himanshu.jauthify.repository.UserRepository;
import com.himanshu.jauthify.security.JWTService;
import com.himanshu.jauthify.service.EmailService;
import com.himanshu.jauthify.service.VerificationOtpService;
import com.himanshu.jauthify.service.OrganizationService;
import com.himanshu.jauthify.service.SessionService;
import com.himanshu.jauthify.service.UserService;

import lombok.RequiredArgsConstructor;

@Service("userService")
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JWTService jwtService;
    private final SessionService sessionService;
    private final OrganizationService organizationService;
    private final EmailService emailService;
    private final VerificationOtpService verificationOtpService;

    @Override
    public String register(RegisterRequest userData) throws JAuthifyException {
        if (userRepository.findByEmail(userData.getEmail()).isPresent()) {
            throw new JAuthifyException("A user with this email already exists", HttpStatus.CONFLICT);
        }

        if (!userData.getPassword().equals(userData.getConfirmPassword())) {
            throw new JAuthifyException("Passwords do not match", HttpStatus.CONFLICT);
        }

        User user = new User();
        user.setEmail(userData.getEmail());
        user.setName(userData.getName());
        user.setPassword(passwordEncoder.encode(userData.getPassword()));

        user = userRepository.save(user);

        String otp = verificationOtpService.create(user, OtpPurpose.VerifyEmail);

        emailService.sendVerificationEmail(user.getEmail(), "Verify your email", otp);

        return "Account created successfully. Please check your email for an OTP";
    }

    @Override
    public User findByEmail(String userEmail) throws JAuthifyException {
        return userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new JAuthifyException("User not found", HttpStatus.NOT_FOUND));
    }

    @Override
    public LoginResponse login(LoginRequest userData, String ipAddress, String userAgent) throws JAuthifyException {
        try {
            authenticationManager
                    .authenticate(
                            new UsernamePasswordAuthenticationToken(userData.getEmail(), userData.getPassword(), null));

            UserDetails userDetails = userDetailsService.loadUserByUsername(userData.getEmail());

            User user = this.findByEmail(userDetails.getUsername());

            if (user.getEmailVerifiedAt() == null) {
                String otp = verificationOtpService.create(user, OtpPurpose.VerifyEmail);

                emailService.sendVerificationEmail(user.getEmail(), "Verify your email", otp);

                throw new JAuthifyException(
                        "Email not verified. Please verify your email. Check your email for the otp",
                        HttpStatus.FORBIDDEN);
            }

            List<Organization> organizations = organizationService.findAllByUserId(user.getId().toString());

            UserDTO userDTO = null;

            String refreshToken = null;
            String accessToken = null;

            if (organizations != null && !organizations.isEmpty()) {
                String organizationId = organizations.get(0).getId().toString();

                accessToken = jwtService.generateAccessToken(userDetails.getUsername(),
                        organizationId);

                refreshToken = sessionService.create(user, ipAddress, userAgent,
                        organizationId);

                userDTO = UserDTO.toDto(user, organizationId);

            } else {
                accessToken = jwtService.generateAccessToken(userDetails.getUsername(), null);
                refreshToken = sessionService.create(user, ipAddress, userAgent, null);
                userDTO = UserDTO.toDto(user, null);
            }

            LoginResponse response = new LoginResponse(accessToken, refreshToken, userDTO, !organizations.isEmpty());

            return response;
        } catch (AuthenticationException e) {
            throw new JAuthifyException("Invalid credentials", HttpStatus.UNAUTHORIZED);
        }
    }

    @Override
    public void verifyEmail(String userEmail, String otp) throws JAuthifyException {
        User user = this.findByEmail(userEmail);

        if (user.getEmailVerifiedAt() != null) {
            throw new JAuthifyException("Email is already verified", HttpStatus.CONFLICT);
        }

        verificationOtpService.verify(user, otp, OtpPurpose.VerifyEmail);

        user.setEmailVerifiedAt(LocalDateTime.now());

        userRepository.save(user);
    }

    @Override
    public void changePassword(ChangePasswordRequest passwords, String userEmail) throws JAuthifyException {
        if (!passwords.getNewPassword().equals(passwords.getConfirmNewPassword())) {
            throw new JAuthifyException("Passwords do not match", HttpStatus.CONFLICT);
        }

        User user = this.findByEmail(userEmail);

        if (!passwordEncoder.matches(passwords.getOldPassword(), user.getPassword())) {
            throw new JAuthifyException("Old password is incorrect", HttpStatus.FORBIDDEN);
        }

        user.setPassword(passwordEncoder.encode(passwords.getNewPassword()));

        userRepository.save(user);
    }

    @Override
    public void forgotPassword(String email) throws JAuthifyException {
        User user = this.findByEmail(email);

        String otp = verificationOtpService.create(user, OtpPurpose.ResetPassword);

        emailService.sendResetPasswordEmail(email, otp);
    }

    @Override
    public String verifyForgotPasswordAttempt(String email, String otp) throws JAuthifyException {
        User user = this.findByEmail(email);

        verificationOtpService.verify(user, otp, OtpPurpose.ResetPassword);

        return jwtService.generateResetPasswordToken(email);
    }

    @Override
    public void resetPassword(String resetPasswordToken, String newPassword) throws JAuthifyException {
        if (jwtService.extractExpiration(resetPasswordToken).after(new Date())) {
            throw new JAuthifyException("Token has expired", HttpStatus.UNAUTHORIZED);
        }

        String email = jwtService.extractSubject(resetPasswordToken);

        User user = this.findByEmail(email);

        user.setPassword(passwordEncoder.encode(newPassword));

        userRepository.save(user);
    }

    @Override
    public void resendOtp(String userEmail, OtpPurpose purpose) throws JAuthifyException {
        String otp = verificationOtpService.create(this.findByEmail(userEmail), purpose);

        emailService.sendVerificationEmail(userEmail, "Verify your email", otp);
    }

}
