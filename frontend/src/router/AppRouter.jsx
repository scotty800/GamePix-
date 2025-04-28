import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "../components/Layouts";
import Login from "../pages/Login";
import Home from "../pages/Home";
import UserProfile from "../pages/Profile";
import About from "../pages/About"; // Nouvel import
import RequireAuth from "../components/RequireAuth";

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} /> {/* Nouvelle route publique */}

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