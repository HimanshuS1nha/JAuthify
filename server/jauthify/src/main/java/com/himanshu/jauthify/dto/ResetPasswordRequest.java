package com.himanshu.jauthify.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ResetPasswordRequest {
    @NotNull(message = "New Password is required")
    @Size(min = 8, message = "New Password must be atleast 8 characters long")
    private String newPassword;

    @NotNull(message = "Confirm Password is required")
    @Size(min = 8, message = "Confirm Password must be atleast 8 characters long")
    private String confirmPassword;
}
