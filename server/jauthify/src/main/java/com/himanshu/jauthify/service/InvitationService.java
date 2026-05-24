package com.himanshu.jauthify.service;

import java.util.List;

import com.himanshu.jauthify.dto.InvitationDTO;
import com.himanshu.jauthify.dto.InvitationResponse;
import com.himanshu.jauthify.entity.Invitation;
import com.himanshu.jauthify.entity.Organization;
import com.himanshu.jauthify.entity.User;
import com.himanshu.jauthify.enums.MemberRole;
import com.himanshu.jauthify.exception.JAuthifyException;

public interface InvitationService {
    void createInvitation(Organization organization, User inviter, String inviteeEmail, MemberRole role)
            throws JAuthifyException;

    Invitation acceptInvitation(String inviteeEmail, String inviteId) throws JAuthifyException;

    void rejectInvitation(String inviteeEmail, String inviteId) throws JAuthifyException;

    List<InvitationDTO> getAllInvitations(String organizationId) throws JAuthifyException;

    void deleteByOrganization(String organizationId) throws JAuthifyException;

    void deleteInvitation(String inviteId, String inviteeEmail, String organizationId) throws JAuthifyException;

    InvitationResponse getInvitation(String inviteId, String inviteeEmail) throws JAuthifyException;
}
