import { Navigate } from "react-router-dom";
import Login from "../pages/Login";
import RegisterForm from "../pages/Register";
import ForgotPasswordForm from "../components/ForgotPassword";
import ForgotCustomerIdForm from "../components/ForgotCustomerID";
import AdminLoginPage from "../pages/AdminLogin";
import ResetPasswordForm from "../components/AddNewPassword";

export const InvalidLoginRoutes = [
    { path: "/*", element: <Navigate to="/auth/login" replace={true} /> },
    { path: "/auth/login", element: <Login /> },
    { path: "/forgot-password", element: <ForgotPasswordForm /> },
    { path: "/forgot-CustomerId", element: <ForgotCustomerIdForm /> },
    { path: "/auth/register", element: <RegisterForm /> },
    { path: "/admin/login", element: <AdminLoginPage /> },
    { path: "/reset-password", element: <ResetPasswordForm /> },
];
