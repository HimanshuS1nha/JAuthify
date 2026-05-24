package com.himanshu.jauthify.dto;

import com.himanshu.jauthify.enums.OtpPurpose;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ResendOTPRequest {
    @NotNull(message = "Purpose is required")
    private OtpPurpose purpose;
}
