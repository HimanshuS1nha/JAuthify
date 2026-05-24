package com.himanshu.jauthify.security;

import java.util.Collection;

import org.jspecify.annotations.Nullable;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.himanshu.jauthify.entity.User;

import lombok.Data;

@Data
public class MyUserDetails implements UserDetails {
    private final User user;
    private Collection<? extends GrantedAuthority> authorities;
    private String organizationId;
    private Boolean isEmailVerified;

    public MyUserDetails(User user) {
        this.user = user;
    }

    public MyUserDetails(User user, Collection<? extends GrantedAuthority> authorities, String organizationId) {
        this.user = user;
        this.authorities = authorities;
        this.organizationId = organizationId;
        this.isEmailVerified = user.getEmailVerifiedAt() != null;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return this.authorities;
    }

    @Override
    public @Nullable String getPassword() {
        return this.user.getPassword();
    }

    @Override
    public String getUsername() {
        return this.user.getEmail();
    }
}
