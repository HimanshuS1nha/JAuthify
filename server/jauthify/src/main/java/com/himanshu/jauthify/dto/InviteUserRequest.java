package com.himanshu.jauthify.dto;

import com.himanshu.jauthify.enums.MemberRole;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class InviteUserRequest {
    @NotNull(message = "Invitee Email is required")
    @Email(message = "Invitee Email must be valid")
    private String inviteeEmail;

    @NotNull(message = "Role is required")
    private MemberRole role;
}
