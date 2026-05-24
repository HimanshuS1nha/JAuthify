package com.himanshu.jauthify.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ChangePasswordRequest {
    @NotBlank(message = "Old Password is required")
    @Size(min = 8, message = "Old Password must be atleast 8 characters long")
    private String oldPassword;

    @NotBlank(message = "New Password is required")
    @Size(min = 8, message = "Old Password must be atleast 8 characters long")
    private String newPassword;
    
    @NotBlank(message = "Confirm New Password is required")
    @Size(min = 8, message = "Old Password must be atleast 8 characters long")
    private String confirmNewPassword;
}
