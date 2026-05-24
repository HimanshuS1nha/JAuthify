package com.himanshu.jauthify.dto;

import com.himanshu.jauthify.enums.MemberRole;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MemberRoleResponse {
    private MemberRole role;
}
