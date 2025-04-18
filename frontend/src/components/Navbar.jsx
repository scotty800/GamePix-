import React from "react";
import "../style/Navbar.css";
import LogoGamepix from "../assets/images/LogoGamepix.png";
import { useAuth } from "../contexts/AuthContext";
import SearchBar from "./SearchBar";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../services/authService";

export default function Navbar() {
    console.log("✅ Navbar monté"); // Log pour vérifier si le composant est bien monté

    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // Vérification du user
    console.log("✅ [Navbar] user:", user);
    console.log("✅ [Navbar] user._id:", user?._id);

    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true });
    }

    return (
        <header className="header">
            {/* Logo - Remplacé par Link */}
            <Link to="/home" className="logo">
                <img src={LogoGamepix} alt="Logo" />
            </Link>

            <SearchBar placeholder="Entrer a name..." />

            {/* Navigation - Remplacé les <a> par <Link> */}
            <nav className="navbar">
                <Link to="/home" className="btn">Home</Link>
                <Link to="/about" className="btn">About</Link>

                {user ? (
                    <>
                        <Link to={`/profile/${user._id}`} className="btn">Profil</Link>
                        <div className="user-menu">
                            <button className="dropdown-btn">
                                {user?.pseudo?.[0]?.toUpperCase() || "?"}
                            </button>

                            <div className="dropdown-content">
                                <button onClick={handleLogout}>Déconnexion</button>
                            </div>
                        </div>
                    </>
                ) : (
                    <Link to="/login" className="btn">Login</Link>
                )}
            </nav>
        </header>
    );
}
