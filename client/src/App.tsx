import { Route, Routes } from "react-router-dom";

import HomePage from "./pages/landing/home-page";
import LoginPage from "./pages/auth/login-page";
import RegisterPage from "./pages/auth/register-page";
import LogoutPage from "./pages/auth/logout-page";
import DashboardPage from "./pages/dashboard/dashboard-page";
import ChangePasswordPage from "./pages/auth/change-password-page";
import VerifyOtpPage from "./pages/auth/verify-otp-page";
import ForgotPasswordPage from "./pages/auth/forgot-password-page";
import ResetPasswordPage from "./pages/auth/reset-password-page";
import VerifyEmailPage from "./pages/auth/verify-email-page";
import CreateOrganizationPage from "./pages/auth/create-organization-page";
import InvitationPage from "./pages/auth/invitation-page";

import GradientLayout from "./layout/gradient-layout";
import RootLayout from "./layout/root-layout";
import AuthLayout from "./layout/auth-layout";

const App = () => {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route element={<GradientLayout />}>
          <Route path="/" element={<HomePage />}></Route>

          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />}></Route>
            <Route path="/register" element={<RegisterPage />}></Route>
            <Route path="/logout" element={<LogoutPage />}></Route>
            <Route path="/verify-email" element={<VerifyEmailPage />}></Route>
            <Route
              path="/change-password"
              element={<ChangePasswordPage />}
            ></Route>
            <Route path="/verify-otp" element={<VerifyOtpPage />}></Route>
            <Route
              path="/forgot-password"
              element={<ForgotPasswordPage />}
            ></Route>
            <Route
              path="/reset-password"
              element={<ResetPasswordPage />}
            ></Route>
            <Route
              path="/create-organization"
              element={<CreateOrganizationPage />}
            ></Route>
            <Route
              path="/join/:invitationId"
              element={<InvitationPage />}
            ></Route>
          </Route>
        </Route>

        <Route>
          <Route path="/dashboard" element={<DashboardPage />}></Route>
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
