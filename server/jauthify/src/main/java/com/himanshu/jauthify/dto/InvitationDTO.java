package com.himanshu.jauthify.dto;

import java.time.LocalDateTime;

import com.himanshu.jauthify.entity.Invitation;
import com.himanshu.jauthify.enums.InvitationStatus;
import com.himanshu.jauthify.enums.MemberRole;

import lombok.Data;

@Data
public class InvitationDTO {
    private String id;
    private String inviteeEmail;
    private String inviterName;
    private InvitationStatus status;
    private MemberRole role;
    private LocalDateTime expiresAt;
    private LocalDateTime createdAt;

    public static InvitationDTO toDto(Invitation invitation) {
        InvitationDTO invitationDTO = new InvitationDTO();
        invitationDTO.setId(invitation.getId().toString());
        invitationDTO.setCreatedAt(invitation.getCreatedAt());
        invitationDTO.setExpiresAt(invitation.getExpiresAt());
        invitationDTO.setInviteeEmail(invitation.getInviteeEmail());
        invitationDTO.setInviterName(invitation.getInviter().getName());
        invitationDTO.setRole(invitation.getRole());
        invitationDTO.setStatus(invitation.getStatus());

        return invitationDTO;
    }
}
