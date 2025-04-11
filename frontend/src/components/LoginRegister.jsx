import { useState } from "react";
import axios from "axios";
import "../style/LoginRegister.css";

export default function LoginRegister() {
  const [isLogin, setIsLogin] = useState(true);
  const [registerData, setRegisterData] = useState({
    pseudo: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;
  console.log("🌍 API_URL:", API_URL); // Vérifie que l'URL est bien récupérée

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

    const endpoint = isLogin ? "/user/login" : "/user/register";

    try {
      const response = await axios.post(`${API_URL}${endpoint}`, registerData, {
        headers: { "Content-Type": "application/json" },
      });

      // Vérification côté front des données retournées par le backend
      if (response.data.user) {
        setMessage(isLogin ? "Connexion réussie !" : "Compte créé avec succès !");
        setError("");
      }
    } catch (error) {
      console.error("❌ Erreur lors de la requête :", error);

      setMessage("");

      // Gestion des erreurs spécifiques
      if (error.response?.data?.errors) {
        // Pour les erreurs d'inscription (signUp)
        if (!isLogin) {
          const errors = error.response.data.errors;
          setError(
            errors.pseudo || errors.email || errors.password || "Erreur d'inscription"
          );
        }
        // Pour les erreurs de connexion (signIn)
        else {
          const errors = error.response.data.errors;
          setError(
            errors.email || errors.password || "Erreur de connexion"
          );
        }
      } else {
        setError(error.response?.data?.message || "Une erreur est survenue.");
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

        {/* Affichage des messages */}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {message && <p style={{ color: "green" }}>{message}</p>}
      </form>
    </div>
  );
}
