package com.himanshu.jauthify.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.himanshu.jauthify.dto.InvitationDTO;
import com.himanshu.jauthify.dto.InvitationResponse;
import com.himanshu.jauthify.entity.Invitation;
import com.himanshu.jauthify.entity.Organization;
import com.himanshu.jauthify.entity.User;
import com.himanshu.jauthify.enums.InvitationStatus;
import com.himanshu.jauthify.enums.MemberRole;
import com.himanshu.jauthify.exception.JAuthifyException;
import com.himanshu.jauthify.repository.InvitationRepository;
import com.himanshu.jauthify.service.EmailService;
import com.himanshu.jauthify.service.InvitationService;

import lombok.RequiredArgsConstructor;

@Service("invitationService")
@RequiredArgsConstructor
@Transactional
public class InvitationServiceImpl implements InvitationService {
    private final InvitationRepository invitationRepository;
    private final EmailService emailService;

    @Override
    public void createInvitation(Organization organization, User inviter, String inviteeEmail,
            MemberRole role) throws JAuthifyException {
        Invitation invitation = new Invitation();
        invitation.setInviteeEmail(inviteeEmail);
        invitation.setInviter(inviter);
        invitation.setOrganization(organization);
        invitation.setRole(role);
        invitation.setStatus(InvitationStatus.Pending);
        invitation.setExpiresAt(LocalDateTime.now().plusDays(1)); // 1 day expiry

        invitation = invitationRepository.save(invitation);

        emailService.sendOrganizationInviteEmail(inviteeEmail, organization.getName(), invitation.getId().toString());
    }

    @Override
    public Invitation acceptInvitation(String inviteeEmail, String inviteId) throws JAuthifyException {
        Invitation invitation = invitationRepository.findById(UUID.fromString(inviteId))
                .orElseThrow(() -> new JAuthifyException("Invitation not found", HttpStatus.NOT_FOUND));

        if (!InvitationStatus.Pending.equals(invitation.getStatus())
                || !inviteeEmail.equals(invitation.getInviteeEmail())) {
            // No need to reveal any internal details
            throw new JAuthifyException("Invitation not found", HttpStatus.NOT_FOUND);
        }

        if (!inviteeEmail.equals(invitation.getInviteeEmail())) {
            // No need to reveal any internal details
            throw new JAuthifyException("Invitation not found", HttpStatus.NOT_FOUND);
        }

        if (invitation.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new JAuthifyException("Invitation has expired", HttpStatus.FORBIDDEN);
        }

        invitation.setStatus(InvitationStatus.Accepted);

        return invitation;
    }

    @Override
    public void rejectInvitation(String inviteeEmail, String inviteId) throws JAuthifyException {
        Invitation invitation = invitationRepository.findById(UUID.fromString(inviteId))
                .orElseThrow(() -> new JAuthifyException("Invitation not found", HttpStatus.NOT_FOUND));

        if (!InvitationStatus.Pending.equals(invitation.getStatus())
                || !inviteeEmail.equals(invitation.getInviteeEmail())) {
            // No need to reveal any internal details
            throw new JAuthifyException("Invitation not found", HttpStatus.NOT_FOUND);
        }

        if (invitation.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new JAuthifyException("Invitation has expired", HttpStatus.FORBIDDEN);
        }

        invitation.setStatus(InvitationStatus.Rejected);
    }

    @Override
    public List<InvitationDTO> getAllInvitations(String organizationId) throws JAuthifyException {
        return invitationRepository.findByOrganizationId(UUID.fromString(organizationId)).stream()
                .map(invitation -> InvitationDTO.toDto(invitation)).toList();
    }

    @Override
    public void deleteByOrganization(String organizationId) throws JAuthifyException {
        invitationRepository.deleteByOrganizationId(UUID.fromString(organizationId));
    }

    @Override
    public void deleteInvitation(String inviteId, String inviteeEmail, String organizationId) throws JAuthifyException {
        invitationRepository.deleteByIdAndInviteeEmailAndOrganizationId(UUID.fromString(inviteId), inviteeEmail,
                UUID.fromString(organizationId));
    }

    @Override
    public InvitationResponse getInvitation(String inviteId, String inviteeEmail) throws JAuthifyException {
        Invitation invitation = invitationRepository.findByIdAndInviteeEmail(UUID.fromString(inviteId), inviteeEmail)
                .orElseThrow(() -> new JAuthifyException("Invitation not found", HttpStatus.NOT_FOUND));

        if (invitation.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new JAuthifyException("Invitation has expired", HttpStatus.FORBIDDEN);
        }

        return new InvitationResponse(inviteId, invitation.getOrganization().getName(),
                invitation.getInviter().getName());
    }

}
