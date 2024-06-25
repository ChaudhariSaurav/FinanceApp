import { Navigate } from "react-router-dom";
import Dashboard from "../pages/dashboard";

export const ValidAuthroutes = [
    { path: "/*", element: <Navigate to="/dashboard" replace={true} /> },
    { path: "/dashboard", element: <Dashboard /> },
];
