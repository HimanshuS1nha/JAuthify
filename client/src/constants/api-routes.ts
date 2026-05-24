export const apiRoutes = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    me: "/auth/me",
    refreshAccessToken: "/auth/refresh",
    sessions: "/auth/session",
    logout: "/auth/logout",
    logoutAll: "/auth/logout-all",
    changePassword: "/auth/change-password",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
    verifyForgotPasswordAttempt: "/auth/forgot-password/verify",
    verifyEmail: "/auth/verify-email",
    resendOtp: "/auth/resend-otp",
  },
  organization: {
    members: "/organization/member",
    getInvitations: "/organization/invite",
    createInvitation: "/organization/invite",
    getActive: "/organization/active",
    getAll: "/organization",
    switch: (organizationId: string) =>
      `/organization/${organizationId}/switch`,
    createOrganization: "/organization",
    deleteOrganization: (organizationId: string) =>
      `/organization/${organizationId}`,
    getRole: "/organization/role",
    updateMemberRole: (memberId: string) => `/organization/member/${memberId}`,
    removeMember: (memberId: string) => `/organization/member/${memberId}`,
    deleteInvitation: (inviteId: string, email: string) =>
      `/organization/invite/${inviteId}?email=${email}`,
    acceptInvitation: `/organization/invite/accept`,
    rejectInvitation: `/organization/invite/reject`,
    getInvitation: (inviteId: string) => `/organization/invite/${inviteId}`,
  },
};
