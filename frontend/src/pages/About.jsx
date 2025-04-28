import React from 'react';
import { Link } from 'react-router-dom';
import '../style/About.css';

const About = () => {
  return (
    <div className="about-container">
      <header className="about-header">
        <h1>À propos de GamePix</h1>
        <p>Votre réseau social dédié à la passion des jeux vidéo</p>
      </header>

      <main className="about-content">
        <section className="about-section">
          <h2>🎮 Notre Mission</h2>
          <p>
            GamePix a été créé pour rassembler les gamers du monde entier. 
            Partagez vos exploits, découvrez de nouveaux jeux, connectez-vous avec 
            d'autres passionnés et restez à jour sur l'actualité gaming.
          </p>
        </section>

        <section className="about-section">
          <h2>🌟 Fonctionnalités</h2>
          <ul className="features-list">
            <li>📱 Profils personnalisables avec vos jeux favoris</li>
            <li>🎥 Partage de captures d'écran et vidéos de gameplay</li>
            <li>💬 Discussions et groupes thématiques</li>
            <li>🏆 Système de trophées et réalisations</li>
          </ul>
        </section>

        <section className="about-section">
          <h2>👨‍💻 L'Équipe</h2>
          <div className="team-grid">
            <div className="team-member">
              <div className="member-avatar">👾</div>
              <h3>Scotty NDANGA</h3>
              <p>Fondateur & Développeur</p>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2>📅 Notre Histoire</h2>
          <p>
            Lancé en 2023, GamePix est né de la passion commune de ses fondateurs 
            pour les jeux vidéo et les réseaux sociaux. Ce que nous avons commencé 
            comme un petit projet est rapidement devenu une communauté vibrante 
            de milliers de gamers à travers le monde.
          </p>
        </section>

        <div className="about-cta">
          <Link to="/" className="secondary-button">Retour à l'accueil</Link>
        </div>
      </main>

      <footer className="about-footer">
        <p>© 2023 GamePix - Tous droits réservés</p>
        <div className="footer-links">
          <Link to="/privacy">Confidentialité</Link>
          <Link to="/terms">Conditions d'utilisation</Link>
          <Link to="/contact">Contact</Link>
        </div>
      </footer>
    </div>
  );
};

export default About;