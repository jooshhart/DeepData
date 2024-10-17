import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element: Component }) => {
  const isAuthenticated = !!localStorage.getItem('authToken'); // Example token logic

  return isAuthenticated ? <Component /> : <Navigate to="/signin" />;
};

export default ProtectedRoute;
