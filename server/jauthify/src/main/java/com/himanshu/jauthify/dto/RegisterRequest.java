package com.himanshu.jauthify.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank(message = "Name is required")
    private String name;

    @NotNull(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;

    @NotNull(message = "Password is required")
    @Size(min = 8, message = "Password must be atleast 8 characters long")
    private String password;
    @NotNull(message = "Confirm Password is required")
    @Size(min = 8, message = "Confirm Password must be atleast 8 characters long")
    private String confirmPassword;
}
