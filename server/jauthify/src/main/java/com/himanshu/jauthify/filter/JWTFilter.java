package com.himanshu.jauthify.filter;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.himanshu.jauthify.entity.Member;
import com.himanshu.jauthify.security.JWTService;
import com.himanshu.jauthify.security.MyUserDetails;
import com.himanshu.jauthify.security.MyUserService;
import com.himanshu.jauthify.service.MemberService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JWTFilter extends OncePerRequestFilter {
    private final JWTService jwtService;
    private final MyUserService userDetailsService;
    private final MemberService memberService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String accessToken = null;

        if (request.getRequestURI().startsWith("/api/auth/") && !request.getRequestURI().equals("/api/auth/me")
                && !request.getRequestURI().equals("/api/auth/change-password")
                && !request.getRequestURI().equals("/api/auth/session")
                && !request.getRequestURI().equals("/api/auth/logout")
                && !request.getRequestURI().equals("/api/auth/logout-all")) {
            filterChain.doFilter(request, response);
            return;
        }

        Cookie[] cookies = request.getCookies();

        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("accessToken".equals(cookie.getName())) {
                    accessToken = cookie.getValue();
                    break;
                }
            }
        }

        if (accessToken != null) {
            String email = null;

            try {
                email = jwtService.extractSubject(accessToken);
            } catch (Exception e) {
                throw new BadCredentialsException("Unauthorized! Please login again");
            }

            if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                // Type cast to MyUserDetails so that organizationId can be set on the object
                try {
                    String organizationId = (String) jwtService.extractClaim(accessToken,
                            (claims) -> claims.get("organizationId"));
                    if (organizationId == null) {
                        // Will return BadCredentialsException in the catch block
                        if (!request.getRequestURI().startsWith("/api/organization")
                                && !request.getRequestURI().startsWith("/api/auth/logout")
                                && !request.getRequestURI().equals("/api/auth/login")
                                && !request.getRequestURI().equals("/api/auth/me")) {
                            throw new Exception("Please create an organization before proceeding");
                        }
                    }

                    MyUserDetails userDetails = null;

                    if (organizationId != null) {
                        Member member = memberService.getByEmailAndOrganizationId(email, organizationId);

                        List<GrantedAuthority> authorities = List
                                .of(new SimpleGrantedAuthority("ROLE_" + member.getRole()));

                        userDetails = userDetailsService.buildWithAuthoritiesAndOrganizationId(email,
                                authorities, organizationId);
                    } else {
                        userDetails = userDetailsService.buildWithAuthoritiesAndOrganizationId(email,
                                Collections.emptyList(), null);
                    }

                    if (!userDetails.getIsEmailVerified() && request.getRequestURI().startsWith("/api/verify-email")) {
                        throw new Exception("Please verify your email first");
                    }

                    if (jwtService.verifyToken(accessToken, userDetails)) {
                        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                                userDetails, null, userDetails.getAuthorities());

                        authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                    }
                } catch (Exception e) {
                    throw new BadCredentialsException(e.getMessage());
                }
            }
        }
        filterChain.doFilter(request, response);
    }

}
