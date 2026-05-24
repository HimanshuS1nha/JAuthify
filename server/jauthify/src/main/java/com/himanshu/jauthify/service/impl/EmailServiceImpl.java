package com.himanshu.jauthify.service.impl;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpStatus;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StreamUtils;

import com.himanshu.jauthify.exception.JAuthifyException;
import com.himanshu.jauthify.service.EmailService;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;

@Service("emailService")
@RequiredArgsConstructor
@Transactional
public class EmailServiceImpl implements EmailService {
    private final JavaMailSender javaMailSender;

    @Value("${frontend.url}")
    private String frontendUrl;

    private String loadEmailVerificationTemplate() throws IOException {
        ClassPathResource resource = new ClassPathResource("templates/email-verification.html");
        return StreamUtils.copyToString(resource.getInputStream(), StandardCharsets.UTF_8);
    }

    private String loadInviteTemplate() throws IOException {
        ClassPathResource resource = new ClassPathResource("templates/organization-join-invite.html");
        return StreamUtils.copyToString(resource.getInputStream(), StandardCharsets.UTF_8);
    }

    private String loadResetPasswordTemplate() throws IOException {
        ClassPathResource resource = new ClassPathResource("templates/reset-password.html");
        return StreamUtils.copyToString(resource.getInputStream(), StandardCharsets.UTF_8);
    }

    @Override
    public void sendVerificationEmail(String to, String subject, String otp) throws JAuthifyException {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            String emailHtml = loadEmailVerificationTemplate();
            emailHtml = emailHtml.replace("{{otp}}", otp);

            helper.setTo(to);
            helper.setText(emailHtml, true);
            helper.setSubject(subject);

            javaMailSender.send(message);
        } catch (Exception e) {
            throw new JAuthifyException("Unable to send verification email. Please try again later!",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public void sendOrganizationInviteEmail(String to, String organizationName, String inviteId)
            throws JAuthifyException {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            String emailHtml = loadInviteTemplate();
            emailHtml = emailHtml.replace("{{organizationName}}", organizationName);
            emailHtml = emailHtml.replace("{{inviteUrl}}", frontendUrl + "/join/" + inviteId);

            helper.setTo(to);
            helper.setText(emailHtml, true);
            helper.setSubject("Invitation to Join " + organizationName);

            javaMailSender.send(message);
        } catch (Exception e) {
            throw new JAuthifyException("Unable to invitation email. Please try again later!",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public void sendResetPasswordEmail(String to, String otp) throws JAuthifyException {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            String emailHtml = loadResetPasswordTemplate();
            emailHtml = emailHtml.replace("{{otp}}", otp);

            helper.setTo(to);
            helper.setText(emailHtml, true);
            helper.setSubject("Reset Password");

            javaMailSender.send(message);
        } catch (Exception e) {
            throw new JAuthifyException("Unable to invitation email. Please try again later!",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
