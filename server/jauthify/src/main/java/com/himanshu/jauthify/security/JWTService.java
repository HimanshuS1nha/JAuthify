package com.himanshu.jauthify.security;

import java.util.Date;
import java.util.function.Function;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JWTService {

    @Value("${jwt.secret}")
    private String secret;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    private String generateToken(String subject, Date expiry, String organizationId) {
        if (organizationId == null) {
            return Jwts.builder().subject(subject).issuedAt(new Date(System.currentTimeMillis()))
                    .expiration(expiry)
                    .signWith(this.getSigningKey())
                    .compact();
        } else {
            return Jwts.builder().subject(subject).issuedAt(new Date(System.currentTimeMillis()))
                    .expiration(expiry)
                    .signWith(this.getSigningKey())
                    .claim("organizationId", organizationId)
                    .compact();
        }
    }

    public String generateAccessToken(String subject, String organizationId) {
        return this.generateToken(subject, new Date(System.currentTimeMillis() + 1000 * 60 * 15), organizationId); // 15
                                                                                                                   // minutes
    }

    public String generateResetPasswordToken(String subject) {
        return this.generateToken(subject, new Date(System.currentTimeMillis() + 1000 * 60 * 15), null);
    }

    public String generateRefreshToken(String subject, Date expiry) {
        return this.generateToken(subject, expiry, null);
    }

    public Claims extractAllClaims(String token) {
        return Jwts.parser().verifyWith(this.getSigningKey()).build()
                .parseSignedClaims(token).getPayload();
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        return claimsResolver.apply(extractAllClaims(token));
    }

    public String extractSubject(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public Boolean verifyToken(String token, UserDetails userDetails) {
        final String email = extractSubject(token);

        return email.equals(userDetails.getUsername()) && extractExpiration(token).after(new Date());
    }
}
