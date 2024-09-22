import { Navigate } from "react-router-dom";
import SignInForm from "../components/signinPage";
import RegistrationForm from "../components/registerationPage";
import ForgotPasswordPage from "../components/forgotPage";

export const InvalidAuthRoute = [
    { path: "/*", element: <Navigate to="/auth" replace={true} /> },
    { path: "/auth", element: <SignInForm /> },
    { path: "/register", element: <RegistrationForm /> },
    { path: "/forgot-password", element: <ForgotPasswordPage /> },
];
