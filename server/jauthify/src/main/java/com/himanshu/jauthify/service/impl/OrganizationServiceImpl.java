package com.himanshu.jauthify.service.impl;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.himanshu.jauthify.dto.MemberDTO;
import com.himanshu.jauthify.entity.Member;
import com.himanshu.jauthify.entity.Organization;
import com.himanshu.jauthify.entity.User;
import com.himanshu.jauthify.enums.MemberRole;
import com.himanshu.jauthify.exception.JAuthifyException;
import com.himanshu.jauthify.repository.OrganizationRepository;
import com.himanshu.jauthify.service.MemberService;
import com.himanshu.jauthify.service.OrganizationService;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;

@Service("organizationService")
@RequiredArgsConstructor
@Transactional
public class OrganizationServiceImpl implements OrganizationService {
    private final OrganizationRepository organizationRepository;
    private final MemberService memberService;

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Organization getById(String organizationId) throws JAuthifyException {
        return organizationRepository.findById(UUID.fromString(organizationId))
                .orElseThrow(() -> new JAuthifyException("Organization not found", HttpStatus.NOT_FOUND));
    }

    @Override
    public String createOrganization(String orgName, User user) throws JAuthifyException {
        Organization organization = new Organization();
        organization.setName(orgName);
        organization.setSlug(orgName + UUID.randomUUID());

        UUID organizationId = organizationRepository.save(organization).getId();
        organization.setId(organizationId);

        memberService.createMember(user, MemberRole.Owner, organization);

        return "Organization created successfully";
    }

    @Override
    public List<Organization> findAllByUserId(String userId) {
        return memberService.findOrganizationsByUserId(userId);
    }

    @Override
    public String updateRole(String memberId, String organizationId, MemberRole role) throws JAuthifyException {
        memberService.updateRole(memberId, organizationId, role);

        return "Role updated successfully";
    }

    @Override
    public List<MemberDTO> getAllMembers(String organizationId) throws JAuthifyException {
        return memberService.getAllMembersByOrganizationId(organizationId).stream()
                .map(member -> MemberDTO.toDTO(member)).toList();
    }

    @Override
    public void deleteOrganization(String userEmail, String organizationId) throws JAuthifyException {
        Member member = memberService.getByEmailAndOrganizationId(userEmail, organizationId);
        if (member.getRole() != MemberRole.Owner) {
            throw new JAuthifyException("Only owners are allowed to delete an organization", HttpStatus.FORBIDDEN);
        }

        memberService.deleteByOrganization(organizationId);

        // Cleart the context
        entityManager.flush();
        entityManager.clear();

        organizationRepository.deleteById(UUID.fromString(organizationId));
    }
}
