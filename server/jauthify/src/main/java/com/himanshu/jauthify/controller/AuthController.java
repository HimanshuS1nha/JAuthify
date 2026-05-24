package com.himanshu.jauthify.controller;

import org.springframework.web.bind.annotation.RestController;

import com.himanshu.jauthify.dto.ChangePasswordRequest;
import com.himanshu.jauthify.dto.EmailDTO;
import com.himanshu.jauthify.dto.ForgotPasswordVerifyRequest;
import com.himanshu.jauthify.dto.VerificationRequest;
import com.himanshu.jauthify.dto.LoginRequest;
import com.himanshu.jauthify.dto.LoginResponse;
import com.himanshu.jauthify.dto.MessageResponse;
import com.himanshu.jauthify.dto.RegisterRequest;
import com.himanshu.jauthify.dto.ResendOTPRequest;
import com.himanshu.jauthify.dto.ResetPasswordRequest;
import com.himanshu.jauthify.dto.SessionResponse;
import com.himanshu.jauthify.dto.TokenResponse;
import com.himanshu.jauthify.dto.UserDTO;
import com.himanshu.jauthify.entity.User;
import com.himanshu.jauthify.exception.JAuthifyException;
import com.himanshu.jauthify.security.MyUserDetails;
import com.himanshu.jauthify.service.SessionService;
import com.himanshu.jauthify.service.UserService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.Cookie;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import nl.basjes.parse.useragent.UserAgent;
import nl.basjes.parse.useragent.UserAgentAnalyzer;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {
    private final UserService userService;
    private final SessionService sessionService;
    private final UserAgentAnalyzer userAgentAnalyzer;

    @PostMapping("/register")
    public ResponseEntity<MessageResponse> register(@Valid @RequestBody RegisterRequest userData)
            throws JAuthifyException {
        return new ResponseEntity<>(new MessageResponse(userService.register(userData)), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<UserDTO> login(@Valid @RequestBody LoginRequest userData, HttpServletRequest request,
            HttpServletResponse response)
            throws JAuthifyException {
        String userAgent = request.getHeader("User-Agent");

        String ipAddress = null;
        if (request.getHeader("X-Forwarded-For") != null) {
            ipAddress = request.getHeader("X-Forwarded-For").split(",")[0];
        } else {
            ipAddress = request.getRemoteAddr();
        }

        LoginResponse loginResponse = userService.login(userData, ipAddress, userAgent);

        Cookie accessTokenCookie = new Cookie("accessToken", loginResponse.getAccessToken());
        accessTokenCookie.setHttpOnly(true);
        accessTokenCookie.setMaxAge(60 * 15);
        accessTokenCookie.setPath("/");
        accessTokenCookie.setPath("/");

        Cookie refreshTokenCookie = new Cookie("refreshToken", loginResponse.getRefreshToken());
        refreshTokenCookie.setHttpOnly(true);
        refreshTokenCookie.setMaxAge(60 * 60 * 24 * 10);
        refreshTokenCookie.setPath("/");

        response.addCookie(accessTokenCookie);
        response.addCookie(refreshTokenCookie);

        return new ResponseEntity<>(loginResponse.getUser(), HttpStatus.OK);
    }

    @GetMapping("/refresh")
    public ResponseEntity<?> refreshToken(HttpServletRequest request, HttpServletResponse response)
            throws JAuthifyException {
        String refreshToken = null;
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("refreshToken".equals(cookie.getName())) {
                    refreshToken = cookie.getValue();
                    break;
                }
            }
        }

        if (refreshToken == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        TokenResponse tokenResponse = sessionService.generateNewTokens(refreshToken);

        Cookie accessTokenCookie = new Cookie("accessToken", tokenResponse.getAccessToken());
        accessTokenCookie.setHttpOnly(true);
        accessTokenCookie.setMaxAge(60 * 15);
        accessTokenCookie.setPath("/");

        Cookie refreshTokenCookie = new Cookie("refreshToken", tokenResponse.getRefreshToken());
        refreshTokenCookie.setHttpOnly(true);
        refreshTokenCookie.setMaxAge(60 * 60 * 24 * 10);
        refreshTokenCookie.setPath("/");

        response.addCookie(accessTokenCookie);
        response.addCookie(refreshTokenCookie);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/logout")
    public ResponseEntity<MessageResponse> logoutUser(HttpServletRequest request, HttpServletResponse response)
            throws JAuthifyException {
        String refreshTokenCookie = null;

        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("refreshToken".equals(cookie.getName())) {
                    refreshTokenCookie = cookie.getValue();
                    break;
                }
            }
        }

        boolean isSessionDeleted = false;

        if (refreshTokenCookie != null) {
            isSessionDeleted = sessionService.deleteSession(refreshTokenCookie);
        }

        // Clear access token
        Cookie accessTokenCookie = new Cookie("accessToken", null);
        accessTokenCookie.setHttpOnly(true);
        accessTokenCookie.setMaxAge(0);
        accessTokenCookie.setPath("/");

        // Clear refresh token
        Cookie newRefreshTokenCookie = new Cookie("refreshToken", null);
        newRefreshTokenCookie.setHttpOnly(true);
        newRefreshTokenCookie.setMaxAge(0);
        newRefreshTokenCookie.setPath("/");

        response.addCookie(accessTokenCookie);
        response.addCookie(newRefreshTokenCookie);

        if (isSessionDeleted) {
            return new ResponseEntity<>(new MessageResponse("Logged out successfully"), HttpStatus.OK);
        } else {
            throw new JAuthifyException("Token is invalid or expired", HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/logout-all")
    public ResponseEntity<MessageResponse> logoutAllSessions(HttpServletResponse response,
            @AuthenticationPrincipal MyUserDetails userDetails) throws JAuthifyException {
        User user = userService.findByEmail(userDetails.getUsername());

        sessionService.deleteAllSessions(user.getId().toString());

        // Clear access token
        Cookie accessTokenCookie = new Cookie("accessToken", null);
        accessTokenCookie.setHttpOnly(true);
        accessTokenCookie.setMaxAge(0);
        accessTokenCookie.setPath("/");

        // Clear refresh token
        Cookie newRefreshTokenCookie = new Cookie("refreshToken", null);
        newRefreshTokenCookie.setHttpOnly(true);
        newRefreshTokenCookie.setMaxAge(0);
        newRefreshTokenCookie.setPath("/");

        response.addCookie(accessTokenCookie);
        response.addCookie(newRefreshTokenCookie);

        return new ResponseEntity<>(new MessageResponse("Logged out of all sessions successfully"), HttpStatus.OK);
    }

    @GetMapping("/me")
    public ResponseEntity<UserDTO> getAuthenticatedUser(@AuthenticationPrincipal MyUserDetails userDetails)
            throws JAuthifyException {
        return new ResponseEntity<>(
                UserDTO.toDto(userService.findByEmail(userDetails.getUsername()), userDetails.getOrganizationId()),
                HttpStatus.OK);
    }

    @PostMapping("/verify-email")
    public ResponseEntity<MessageResponse> verifyEmail(@Valid @RequestBody VerificationRequest request,
            @AuthenticationPrincipal MyUserDetails userDetails) throws JAuthifyException {
        userService.verifyEmail(request.getEmail(), request.getOtp());

        return new ResponseEntity<>(new MessageResponse("Email verified successfully"), HttpStatus.OK);
    }

    @PostMapping("/change-password")
    public ResponseEntity<MessageResponse> changePassword(@Valid @RequestBody ChangePasswordRequest request,
            @AuthenticationPrincipal MyUserDetails userDetails) throws JAuthifyException {
        userService.changePassword(request, userDetails.getUsername());

        return new ResponseEntity<>(new MessageResponse("Password changed successfully"), HttpStatus.OK);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<MessageResponse> forgotPassword(@Valid @RequestBody EmailDTO emailDTO)
            throws JAuthifyException {
        userService.forgotPassword(emailDTO.getEmail());

        return new ResponseEntity<>(new MessageResponse("OTP sent successfully"), HttpStatus.CREATED);
    }

    @PostMapping("/forgot-password/verify")
    public ResponseEntity<MessageResponse> verifyForgotPasswordAttempt(
            @Valid @RequestBody ForgotPasswordVerifyRequest request, HttpServletResponse response)
            throws JAuthifyException {
        userService.verifyForgotPasswordAttempt(request.getEmail(), request.getOtp());

        String resetPasswordToken = userService.verifyForgotPasswordAttempt(request.getEmail(), request.getOtp());

        Cookie resetPasswordCookie = new Cookie("reset-password", resetPasswordToken);
        resetPasswordCookie.setHttpOnly(true);
        resetPasswordCookie.setMaxAge(60 * 15);
        resetPasswordCookie.setPath("/");

        response.addCookie(resetPasswordCookie);

        return new ResponseEntity<>(new MessageResponse("OTP verified successfully"), HttpStatus.CREATED);
    }

    @PatchMapping("/reset-password")
    public ResponseEntity<MessageResponse> resetPassword(@Valid @RequestBody ResetPasswordRequest resetPasswordRequest,
            HttpServletRequest request) throws JAuthifyException {
        String resetPasswordToken = null;

        Cookie[] cookies = request.getCookies();

        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("reset-password".equals(cookie.getName())) {
                    resetPasswordToken = cookie.getValue();
                    break;
                }
            }
        }

        if (resetPasswordToken == null) {
            throw new JAuthifyException("Action not allowed.", HttpStatus.UNAUTHORIZED);
        }

        if (!resetPasswordRequest.getNewPassword().equals(resetPasswordRequest.getConfirmPassword())) {
            throw new JAuthifyException("Passwords do not match", HttpStatus.CONFLICT);
        }

        userService.resetPassword(resetPasswordToken, resetPasswordRequest.getNewPassword());

        return new ResponseEntity<>(new MessageResponse("Password reset successfully"), HttpStatus.OK);
    }

    @GetMapping("/session")
    public ResponseEntity<List<SessionResponse>> getSessions(@AuthenticationPrincipal MyUserDetails userDetails)
            throws JAuthifyException {
        User user = userService.findByEmail(userDetails.getUsername());

        List<SessionResponse> sessions = sessionService.getByUserId(user.getId().toString()).stream()
                .map(session -> {
                    UserAgent userAgent = userAgentAnalyzer.parse(session.getUserAgent());

                    return SessionResponse.toDTO(session, userAgent.getValue("OperatingSystemName"),
                            userAgent.getValue("AgentName"));
                }).toList();

        return new ResponseEntity<>(sessions, HttpStatus.OK);
    }

    @PostMapping("/resend-otp")
    public ResponseEntity<MessageResponse> resentOtp(@AuthenticationPrincipal UserDetails userDetails,
            @RequestBody ResendOTPRequest request) throws JAuthifyException {
        userService.resendOtp(userDetails.getUsername(), request.getPurpose());

        return new ResponseEntity<>(new MessageResponse("OTP resent successfully"), HttpStatus.CREATED);
    }

}
