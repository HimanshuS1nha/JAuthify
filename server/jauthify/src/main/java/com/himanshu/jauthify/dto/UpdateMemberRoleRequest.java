package com.himanshu.jauthify.dto;

import com.himanshu.jauthify.enums.MemberRole;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateMemberRoleRequest {
    @NotNull(message = "Role is required")
    private MemberRole role;
}
