// src/components/AuthGuard.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = Boolean(localStorage.getItem('UserData Storage')); 
  console.log({isAuthenticated})
  return isAuthenticated ? <>{children}</> : <Navigate to="/sign-in" replace />;
};

export default AuthGuard;
