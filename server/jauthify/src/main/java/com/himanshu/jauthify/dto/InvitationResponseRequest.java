package com.himanshu.jauthify.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class InvitationResponseRequest {
    @NotBlank(message = "Invitation ID is required")
    private String inviteId;
}
