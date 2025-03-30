import React, { useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check authentication on route changes
    if (!token) {
      navigate("/login", { replace: true });
    }
  }, [token, navigate, location.pathname]);

  // Render the children only if authenticated
  return token ? children : null;
}

export default ProtectedRoute;