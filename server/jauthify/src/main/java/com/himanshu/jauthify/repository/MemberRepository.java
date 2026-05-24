package com.himanshu.jauthify.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.himanshu.jauthify.entity.Member;
import com.himanshu.jauthify.entity.Organization;
import com.himanshu.jauthify.enums.MemberRole;

public interface MemberRepository extends JpaRepository<Member, UUID> {
    @Query("SELECT m.organization FROM Member m WHERE m.user.id = ?1 ORDER BY m.organization.updatedAt DESC")
    List<Organization> findOrganizationsByUserId(UUID userId);

    @Modifying
    @Query("UPDATE Member m set m.role=?3 WHERE m.id=?1 AND m.organization.id=?2")
    void updateRole(String memberId, String organizationId, MemberRole role);

    List<Member> findAllByOrganizationId(UUID organizationId);

    @Query("SELECT m from Member m WHERE m.user.email=?1 AND m.organization.id=?2")
    Optional<Member> findByUserEmailAndOrganizationId(String userEmail, UUID organizationId);

    @Modifying
    void deleteByOrganizationId(UUID organizationId);

    long countByOrganizationId(UUID organizationId);

    @Modifying
    void deleteByIdAndOrganizationId(UUID id, UUID organizationId);
}
