package com.himanshu.jauthify.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class DeleteInvitationRequest {
    @NotNull(message = "Invitee Email is required")
    @Email(message = "Invitee Email must be valid")
    private String inviteeEmail;
}
