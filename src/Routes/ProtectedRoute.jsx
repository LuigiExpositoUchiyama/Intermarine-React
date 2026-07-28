import { Navigate } from 'react-router-dom';

import authService from '../Services/authService';

export default function ProtectedRoute({ children }) {
  if (!authService.isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
