package com.himanshu.jauthify.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.repository.CrudRepository;

import com.himanshu.jauthify.entity.Session;

public interface SessionRepository extends CrudRepository<Session, UUID> {
    @Modifying
    void deleteByUserId(UUID userId);

    @Modifying
    void deleteByActiveOrganizationId(String activeOrganizationId);

    long countByUserId(UUID userId);

    List<Session> findByUserId(UUID userId);
}
