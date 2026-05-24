package com.himanshu.jauthify.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateOrganizationRequest {
    @NotBlank(message = "Organization Name is required")
    private String organizationName;
}
