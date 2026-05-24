package com.himanshu.jauthify.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.repository.CrudRepository;

import com.himanshu.jauthify.entity.VerificationOtp;

public interface EmailVerificationOtpRepository extends CrudRepository<VerificationOtp, UUID> {
    @Modifying
    void deleteByUserId(UUID userId);

    Optional<VerificationOtp> findByUserId(UUID userId);
}
