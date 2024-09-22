import { Navigate } from "react-router-dom";
import NotFoundError from "../error/404";
import Dashboard from "../pages/dashboard";


export const ValidAuthroutes = [
    { path: "/*", element: <Navigate to="/dashboard" replace={true} /> },
    { path: "/dashboard", element: <Dashboard/> },
    { path: "/", element: <NotFoundError /> },
];