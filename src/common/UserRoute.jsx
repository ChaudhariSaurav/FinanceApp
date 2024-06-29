// src/App.js
import { Routes, BrowserRouter, Route } from "react-router-dom";
import { ValidAuthroutes } from "./validRoute";
import { InvalidLoginRoutes } from "./invalidRoute";

function UserRoute() {
  const token = localStorage.getItem("token"); // Check for token in local storage

  return (
    <BrowserRouter>
      <Routes>
        {token ? (
          <>
            {ValidAuthroutes.map((route, index) => (
              <Route key={index} path={route.path} element={route.element} />
            ))}
          </>
        ) : (
          // If no token, render invalid login routes
          <>
            {InvalidLoginRoutes.map((route, index) => (
              <Route key={index} path={route.path} element={route.element} />
            ))}
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default UserRoute;