import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../API/api"
import { useAuth } from "../contexts/AuthContext";
import "../style/LoginRegister.css";
import { authService } from "../services/authService";

export default function LoginRegister() {
    const [isLogin, setIsLogin] = useState(true);
    const [registerData, setRegisterData] = useState({
        pseudo: "",
        email: "",
        password: "",
    });
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { login } = useAuth();

    // Utilisation de la méthode isAuthenticated du authService
    useEffect(() => {
        if (authService.isAuthenticated()) {
            navigate("/home")
        }
    }, [navigate])

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(`✏️ Input changed - ${name}:`, value);
        setRegisterData({ ...registerData, [name]: value });
    };

    const validateInput = () => {
        if (!registerData.email || !registerData.password) {
            setError("Veuillez remplir tous les champs.");
            return false;
        }
        if (!isLogin && !registerData.pseudo) {
            setError("Le pseudo est requis pour l'inscription.");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateInput()) return;

        try {
            let response;

            if (isLogin) {
                response = await loginUser(registerData);
                login(response.token, response.user); // ✅ ça suffit
                navigate("/home");
            } else {
                response = await registerUser(registerData);
            }

            setMessage(isLogin ? "Connexion réussie !" : "Compte créé avec succès !");
            setError("");

        } catch (error) {
            console.error("❌ Erreur lors de la requête :", error);
            setMessage("");

            if (error.errors) {
                const errorMessage = [
                    error.errors.pseudo,
                    error.errors.email,
                    error.errors.password
                ].filter(Boolean).join(". ");

                setError(errorMessage || "Erreur lors de l'opération");
            } else {
                setError(error.message || "Une erreur est survenue");
            }
        }
    };

    return (
        <div className="container">
            <form className="form" onSubmit={handleSubmit}>
                <h2 id="heading">{isLogin ? "Login" : "Register"}</h2>

                {!isLogin && (
                    <div className="field">
                        <input
                            className="input-field"
                            type="text"
                            name="pseudo"
                            placeholder="Pseudo"
                            value={registerData.pseudo}
                            onChange={handleChange}
                            required
                        />
                    </div>
                )}

                <div className="field">
                    <input
                        className="input-field"
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={registerData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="field">
                    <input
                        className="input-field"
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={registerData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="btn-container">
                    <button type="submit" className="button">
                        {isLogin ? "Login" : "Register"}
                    </button>
                    <button
                        type="button"
                        className="button"
                        onClick={() => setIsLogin(!isLogin)}
                    >
                        {isLogin ? "S'inscrire" : "Se connecter"}
                    </button>
                </div>

                {error && <p style={{ color: "red" }}>{error}</p>}
                {message && <p style={{ color: "green" }}>{message}</p>}
            </form>
        </div>
    );
}
