package com.himanshu.jauthify.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.himanshu.jauthify.entity.Organization;

public interface OrganizationRepository extends JpaRepository<Organization, UUID> {
}
