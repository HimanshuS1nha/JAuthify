package com.himanshu.jauthify.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ForgotPasswordVerifyRequest {
    @NotNull(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;

    @NotNull(message = "OTP is required")
    @Size(min = 6, max = 6, message = "OTP must be 6 digits long")
    @Pattern(regexp = "\\d{6}", message = "OTP must only contain digits")
    private String otp;
}
