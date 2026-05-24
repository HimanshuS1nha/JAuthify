package com.himanshu.jauthify.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;

import com.himanshu.jauthify.entity.Invitation;

public interface InvitationRepository extends JpaRepository<Invitation, UUID> {
    List<Invitation> findByOrganizationId(UUID organizationId);

    long countByOrganizationId(UUID organizationId);

    @Modifying
    void deleteByOrganizationId(UUID organizationId);

    @Modifying
    void deleteByIdAndInviteeEmailAndOrganizationId(UUID id, String inviteeEmail, UUID organizationId);

    Optional<Invitation> findByIdAndInviteeEmail(UUID id, String inviteeEmail);
}
