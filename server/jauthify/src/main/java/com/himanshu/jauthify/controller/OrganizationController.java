package com.himanshu.jauthify.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.himanshu.jauthify.dto.CreateOrganizationRequest;
import com.himanshu.jauthify.dto.InvitationDTO;
import com.himanshu.jauthify.dto.InvitationResponse;
import com.himanshu.jauthify.dto.InvitationResponseRequest;
import com.himanshu.jauthify.dto.InviteUserRequest;
import com.himanshu.jauthify.dto.MemberDTO;
import com.himanshu.jauthify.dto.MemberRoleResponse;
import com.himanshu.jauthify.dto.MessageResponse;
import com.himanshu.jauthify.dto.OrganizationDTO;
import com.himanshu.jauthify.dto.TokenResponse;
import com.himanshu.jauthify.dto.UpdateMemberRoleRequest;
import com.himanshu.jauthify.entity.Invitation;
import com.himanshu.jauthify.entity.Organization;
import com.himanshu.jauthify.entity.User;
import com.himanshu.jauthify.enums.MemberRole;
import com.himanshu.jauthify.exception.JAuthifyException;
import com.himanshu.jauthify.security.JWTService;
import com.himanshu.jauthify.security.MyUserDetails;
import com.himanshu.jauthify.service.InvitationService;
import com.himanshu.jauthify.service.MemberService;
import com.himanshu.jauthify.service.OrganizationService;
import com.himanshu.jauthify.service.SessionService;
import com.himanshu.jauthify.service.UserService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/organization")
@RequiredArgsConstructor
@Validated
public class OrganizationController {
        private final OrganizationService organizationService;
        private final UserService userService;
        private final SessionService sessionService;
        private final InvitationService invitationService;
        private final MemberService memberService;
        private final JWTService jwtService;

        @PostMapping
        public ResponseEntity<MessageResponse> createOrganization(@Valid @RequestBody CreateOrganizationRequest request,
                        @AuthenticationPrincipal UserDetails userDetails) throws JAuthifyException {
                User user = userService.findByEmail(userDetails.getUsername());
                return new ResponseEntity<>(
                                new MessageResponse(
                                                organizationService.createOrganization(request.getOrganizationName(),
                                                                user)),
                                HttpStatus.CREATED);
        }

        @GetMapping("/active")
        public ResponseEntity<OrganizationDTO> getActiveOrganization(
                        @AuthenticationPrincipal MyUserDetails myUserDetails)
                        throws JAuthifyException {

                OrganizationDTO organizationDTO = OrganizationDTO
                                .toDTO(organizationService.getById(myUserDetails.getOrganizationId()));

                return new ResponseEntity<>(organizationDTO, HttpStatus.OK);
        }

        @GetMapping
        public ResponseEntity<List<OrganizationDTO>> findOrganizationsByUserId(
                        @AuthenticationPrincipal UserDetails userDetails) throws JAuthifyException {
                User user = userService.findByEmail(userDetails.getUsername());

                List<OrganizationDTO> organizationDTOs = organizationService.findAllByUserId(user.getId().toString())
                                .stream().map(organization -> OrganizationDTO.toDTO(organization)).toList();

                return new ResponseEntity<>(organizationDTOs, HttpStatus.OK);
        }

        @PreAuthorize("hasAnyRole('Owner', 'Admin')")
        @PatchMapping("/member/{memberId}")
        public ResponseEntity<MessageResponse> updateRoleById(@Valid @RequestBody UpdateMemberRoleRequest request,
                        @PathVariable String memberId, @AuthenticationPrincipal MyUserDetails userDetails)
                        throws JAuthifyException {
                if (request.getRole() == MemberRole.Owner) {
                        throw new JAuthifyException("Cannot update the owner of an organization", HttpStatus.FORBIDDEN);
                }

                return new ResponseEntity<>(
                                new MessageResponse(organizationService.updateRole(memberId,
                                                userDetails.getOrganizationId(), request.getRole())),
                                HttpStatus.OK);
        }

        @PreAuthorize("hasAnyRole('Owner', 'Admin')")
        @DeleteMapping("/member/{memberId}")
        public ResponseEntity<MessageResponse> removeMember(
                        @PathVariable String memberId, @AuthenticationPrincipal MyUserDetails userDetails)
                        throws JAuthifyException {
                memberService.removeMember(memberId, userDetails.getOrganizationId());

                return new ResponseEntity<>(new MessageResponse("Member removed successfully"), HttpStatus.OK);
        }

        @GetMapping("/member")
        public ResponseEntity<List<MemberDTO>> getAllMembersForActiveOrganization(
                        @AuthenticationPrincipal MyUserDetails userDetails) throws JAuthifyException {

                return new ResponseEntity<>(organizationService.getAllMembers(userDetails.getOrganizationId()),
                                HttpStatus.OK);
        }

        @PreAuthorize("hasAnyRole('Owner')")
        @DeleteMapping("/{organizationId}")
        public ResponseEntity<MessageResponse> deleteOrganization(@NotNull @PathVariable String organizationId,
                        @AuthenticationPrincipal MyUserDetails userDetails, HttpServletRequest request,
                        HttpServletResponse response)
                        throws JAuthifyException {
                User user = userService.findByEmail(userDetails.getUsername());

                List<Organization> organizations = organizationService.findAllByUserId(user.getId().toString());
                if (organizations.size() == 1 && organizations.get(0).getId().toString().equals(organizationId)) {
                        throw new JAuthifyException("Cannot delete your only remaining organization",
                                        HttpStatus.FORBIDDEN);
                }

                if (userDetails.getOrganizationId().equals(organizationId)) {
                        Organization newOrganization = organizations.stream()
                                        .filter((org) -> !org.getId().equals(UUID.fromString(organizationId)))
                                        .toList().get(0);

                        String userAgent = request.getHeader("User-Agent");

                        String ipAddress = null;
                        if (request.getHeader("X-Forwarded-For") != null) {
                                ipAddress = request.getHeader("X-Forwarded-For").split(",")[0];
                        } else {
                                ipAddress = request.getRemoteAddr();
                        }

                        String refreshToken = sessionService.create(user, ipAddress, userAgent,
                                        newOrganization.getId().toString());

                        String accessToken = jwtService.generateAccessToken(user.getEmail(),
                                        newOrganization.getId().toString());

                        Cookie accessTokenCookie = new Cookie("accessToken", accessToken);
                        accessTokenCookie.setHttpOnly(true);
                        accessTokenCookie.setMaxAge(60 * 15);
                        accessTokenCookie.setPath("/");
                        accessTokenCookie.setPath("/");

                        Cookie refreshTokenCookie = new Cookie("refreshToken", refreshToken);
                        refreshTokenCookie.setHttpOnly(true);
                        refreshTokenCookie.setMaxAge(60 * 60 * 24 * 10);
                        refreshTokenCookie.setPath("/");

                        response.addCookie(accessTokenCookie);
                        response.addCookie(refreshTokenCookie);

                }

                // Delete all sessions and invitations associated with the organization id
                sessionService.deleteByActiveOrganizationId(organizationId);
                invitationService.deleteByOrganization(organizationId);

                organizationService.deleteOrganization(userDetails.getUsername(), organizationId);

                return new ResponseEntity<>(new MessageResponse("Organization deleted successfully"), HttpStatus.OK);
        }

        @GetMapping("/invite")
        public ResponseEntity<List<InvitationDTO>> getAllInvitations(
                        @AuthenticationPrincipal MyUserDetails userDetails) throws JAuthifyException {
                return new ResponseEntity<>(invitationService.getAllInvitations(userDetails.getOrganizationId()),
                                HttpStatus.OK);
        }

        @PreAuthorize("hasAnyRole('Owner', 'Admin')")
        @PostMapping("/invite")
        public ResponseEntity<MessageResponse> inviteUser(@Valid @RequestBody InviteUserRequest request,
                        @AuthenticationPrincipal MyUserDetails userDetails) throws JAuthifyException {
                if (request.getRole().equals(MemberRole.Owner)) {
                        throw new JAuthifyException("Cannot set someone else as Owner",
                                        HttpStatus.FORBIDDEN);
                }

                User inviter = userService.findByEmail(userDetails.getUsername());

                Organization organization = organizationService.getById(userDetails.getOrganizationId());

                invitationService.createInvitation(organization, inviter,
                                request.getInviteeEmail(), request.getRole());

                return new ResponseEntity<>(new MessageResponse("Invitation email sent successfully"),
                                HttpStatus.CREATED);
        }

        @GetMapping("/invite/{inviteId}")
        public ResponseEntity<InvitationResponse> getInvitation(@NotNull @PathVariable String inviteId,
                        @AuthenticationPrincipal MyUserDetails userDetails) throws JAuthifyException {
                return new ResponseEntity<>(invitationService.getInvitation(inviteId, userDetails.getUsername()),
                                HttpStatus.OK);
        }

        @PostMapping("/invite/reject")
        public ResponseEntity<MessageResponse> acceptInvite(@Valid @RequestBody InvitationResponseRequest request,
                        @AuthenticationPrincipal MyUserDetails userDetails)
                        throws JAuthifyException {
                invitationService.rejectInvitation(userDetails.getUsername(),
                                request.getInviteId());

                return new ResponseEntity<>(new MessageResponse("Invitation rejected successfully"),
                                HttpStatus.OK);
        }

        @PostMapping("/invite/accept")
        public ResponseEntity<MessageResponse> rejectInvite(@Valid @RequestBody InvitationResponseRequest request,
                        @AuthenticationPrincipal MyUserDetails userDetails)
                        throws JAuthifyException {
                Invitation invitation = invitationService.acceptInvitation(userDetails.getUsername(),
                                request.getInviteId());

                User invitee = userService.findByEmail(userDetails.getUsername());

                memberService.createMember(invitee, invitation.getRole(), invitation.getOrganization());

                return new ResponseEntity<>(new MessageResponse("Invitation accepted successfully"),
                                HttpStatus.CREATED);
        }

        @PreAuthorize("hasAnyRole('Owner', 'Admin')")
        @DeleteMapping("/invite/{inviteId}")
        public ResponseEntity<MessageResponse> deleteInvite(@NotNull @PathVariable String inviteId,
                        @AuthenticationPrincipal MyUserDetails userDetails,
                        @RequestParam("email") String inviteeEmail) throws JAuthifyException {
                invitationService.deleteInvitation(inviteId, inviteeEmail,
                                userDetails.getOrganizationId());
                return new ResponseEntity<>(new MessageResponse("Invite removed successfully"), HttpStatus.OK);
        }

        @GetMapping("/{organizationId}/switch")
        public ResponseEntity<MessageResponse> switchActiveOrganization(@NotNull @PathVariable String organizationId,
                        @AuthenticationPrincipal MyUserDetails userDetails, HttpServletRequest request,
                        HttpServletResponse response)
                        throws JAuthifyException {
                Organization organization = organizationService.getById(organizationId);

                // Check that the organization belongs to the user
                memberService.getByEmailAndOrganizationId(userDetails.getUsername(), organization.getId().toString());

                String refreshToken = null;

                Cookie[] cookies = request.getCookies();

                if (cookies != null) {
                        for (Cookie cookie : cookies) {
                                if ("refreshToken".equals(cookie.getName())) {
                                        refreshToken = cookie.getValue();
                                }
                        }
                }

                if (refreshToken == null) {
                        throw new JAuthifyException("Unauthorized! Please login again", HttpStatus.UNAUTHORIZED);
                }

                TokenResponse tokenResponse = sessionService.updateSession(organizationId, refreshToken);

                Cookie accessTokenCookie = new Cookie("accessToken", tokenResponse.getAccessToken());
                accessTokenCookie.setHttpOnly(true);
                accessTokenCookie.setMaxAge(60 * 15);
                accessTokenCookie.setPath("/");

                Cookie refreshTokenCookie = new Cookie("refreshToken", tokenResponse.getRefreshToken());
                refreshTokenCookie.setHttpOnly(true);
                refreshTokenCookie.setMaxAge(60 * 60 * 24 * 10);
                refreshTokenCookie.setPath("/");

                response.addCookie(accessTokenCookie);
                response.addCookie(refreshTokenCookie);

                return new ResponseEntity<>(new MessageResponse("Organization changed successfully"), HttpStatus.OK);
        }

        @GetMapping("/role")
        public ResponseEntity<MemberRoleResponse> getMemberRole(@AuthenticationPrincipal MyUserDetails userDetails)
                        throws JAuthifyException {
                MemberRole role = memberService
                                .getByEmailAndOrganizationId(userDetails.getUsername(), userDetails.getOrganizationId())
                                .getRole();

                return new ResponseEntity<>(new MemberRoleResponse(role), HttpStatus.OK);
        }
}
