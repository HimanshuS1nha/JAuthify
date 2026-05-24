package com.himanshu.jauthify.service;

import java.util.List;

import com.himanshu.jauthify.dto.MemberDTO;
import com.himanshu.jauthify.entity.Organization;
import com.himanshu.jauthify.entity.User;
import com.himanshu.jauthify.enums.MemberRole;
import com.himanshu.jauthify.exception.JAuthifyException;

public interface OrganizationService {
    Organization getById(String organizationId) throws JAuthifyException;

    String createOrganization(String orgName, User user) throws JAuthifyException;

    List<Organization> findAllByUserId(String userId);

    String updateRole(String memberId, String organizationId, MemberRole role) throws JAuthifyException;

    List<MemberDTO> getAllMembers(String organizationId) throws JAuthifyException;

    void deleteOrganization(String userEmail, String organizationId) throws JAuthifyException;
}
