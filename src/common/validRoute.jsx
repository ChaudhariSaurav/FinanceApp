import { Navigate } from "react-router-dom";
import Dashboard from "../pages/dashboard";
import Profile from "../pages/profile";

export const ValidAuthroutes = [
    { path: "/*", element: <Navigate to="/dashboard" replace={true} /> },
    { path: "/dashboard", element: <Dashboard /> },
    { path: "/profile", element: <Profile /> },
];
