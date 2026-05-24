package com.himanshu.jauthify.service.impl;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.himanshu.jauthify.entity.Member;
import com.himanshu.jauthify.entity.Organization;
import com.himanshu.jauthify.entity.User;
import com.himanshu.jauthify.enums.MemberRole;
import com.himanshu.jauthify.exception.JAuthifyException;
import com.himanshu.jauthify.repository.MemberRepository;
import com.himanshu.jauthify.service.MemberService;

import lombok.RequiredArgsConstructor;

@Service("memberService")
@RequiredArgsConstructor
@Transactional
public class MemberServiceImpl implements MemberService {
    private final MemberRepository memberRepository;

    @Override
    public String createMember(User user, MemberRole role, Organization organization) throws JAuthifyException {
        Member member = new Member();
        member.setUser(user);
        member.setRole(role);
        member.setOrganization(organization);

        memberRepository.save(member);

        return "Member created successfully";
    }

    @Override
    public List<Organization> findOrganizationsByUserId(String userId) {
        return memberRepository.findOrganizationsByUserId(UUID.fromString(userId));
    }

    @Override
    public void updateRole(String memberId, String organizationId, MemberRole role) throws JAuthifyException {
        memberRepository.updateRole(memberId, organizationId, role);
    }

    @Override
    public List<Member> getAllMembersByOrganizationId(String organizationId) throws JAuthifyException {
        return memberRepository.findAllByOrganizationId(UUID.fromString(organizationId));
    }

    @Override
    public Member getByEmailAndOrganizationId(String email, String organizationId) throws JAuthifyException {
        return memberRepository.findByUserEmailAndOrganizationId(email, UUID.fromString(organizationId))
                .orElseThrow(() -> new JAuthifyException("Member not found", HttpStatus.NOT_FOUND));
    }

    @Override
    public void deleteByOrganization(String organizationId) throws JAuthifyException {
        memberRepository.deleteByOrganizationId(UUID.fromString(organizationId));
    }

    @Override
    public void removeMember(String memberId, String organizationId)throws JAuthifyException {
        memberRepository.deleteByIdAndOrganizationId(UUID.fromString(memberId), UUID.fromString(organizationId));
    }

}
