import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "../components/Layouts";
import Login from "../pages/Login";
import Home from "../pages/Home";
import UserProfile from "../pages/Profile";
import RequireAuth from "../components/RequireAuth"; // ✅ nouvel import

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Routes protégées avec Layout */}
        <Route element={<Layout />}>
          <Route
            path="/home"
            element={
              <RequireAuth>
                <Home />
              </RequireAuth>
            }
          />
          <Route
            path="/profile/:id"
            element={
              <RequireAuth>
                <UserProfile />
              </RequireAuth>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default AppRouter;

