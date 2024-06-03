import { Navigate } from "react-router-dom";
import Login from "../pages/Login";
import RegisterForm from "../pages/Register";

export const InvalidLoginRoutes = [
    { path: "/*", element: <Navigate to="/auth/login" replace={true} /> },
    { path: "/auth/login", element: <Login /> },
    { path: "/auth/register", element: <RegisterForm/> }
];