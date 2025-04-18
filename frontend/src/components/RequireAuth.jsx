import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function RequireAuth({ children }) {
    const { authenticated } = useAuth();
    const location = useLocation();

    if (!authenticated) {
        // Redirige vers /login et garde la location précédente
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
}
