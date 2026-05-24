package com.himanshu.jauthify.dto;

import java.time.LocalDateTime;

import com.himanshu.jauthify.entity.Member;
import com.himanshu.jauthify.enums.MemberRole;

import lombok.Data;

@Data
public class MemberDTO {
    private String id;
    private MemberRole role;
    private String name;
    private String email;
    private LocalDateTime createdAt;
    private String userId;

    public static MemberDTO toDTO(Member member) {
        MemberDTO memberDTO = new MemberDTO();

        memberDTO.setId(member.getId().toString());
        memberDTO.setRole(member.getRole());
        memberDTO.setName(member.getUser().getName());
        memberDTO.setEmail(member.getUser().getEmail());
        memberDTO.setCreatedAt(member.getCreatedAt());
        memberDTO.setUserId(member.getUser().getId().toString());

        return memberDTO;
    }
}
