export const routes = {
  home: "/",
  auth: {
    login: (redirectTo?: string) =>
      redirectTo
        ? `/login?redirect_to=${encodeURIComponent(redirectTo)}`
        : "/login",
    register: "/register",
    logout: "/logout",
    changePassword: "/change-password",
    forgotPassword: "/forgot-password",
    resetPassword: "/reset-password",
    verifyOtp: (email: string) => `/verify-otp?email=${email}`,
    verifyEmail: (email: string) => `/verify-email?email=${email}`,
    createOrganization: "/create-organization",
  },
  dashboard: "/dashboard",
  joinOrganization: (invitationId: string) => `/join/${invitationId}`,
};
