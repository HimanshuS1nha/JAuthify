package com.himanshu.jauthify.service;

import java.util.List;

import com.himanshu.jauthify.entity.Member;
import com.himanshu.jauthify.entity.Organization;
import com.himanshu.jauthify.entity.User;
import com.himanshu.jauthify.enums.MemberRole;
import com.himanshu.jauthify.exception.JAuthifyException;

public interface MemberService {
    String createMember(User user, MemberRole role, Organization organization) throws JAuthifyException;

    List<Organization> findOrganizationsByUserId(String userId);

    void updateRole(String memberId, String organizationId, MemberRole role) throws JAuthifyException;

    List<Member> getAllMembersByOrganizationId(String organizationId) throws JAuthifyException;

    Member getByEmailAndOrganizationId(String email, String organizationId) throws JAuthifyException;

    void deleteByOrganization(String organizationId) throws JAuthifyException;

    void removeMember(String memberId, String organizationId) throws JAuthifyException;
}
