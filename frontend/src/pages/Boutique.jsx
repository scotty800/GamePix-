import React, { useEffect, useState } from 'react';
import { getFreeGames } from '../API/api';
import '../style/Boutique.css';

const Boutique = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        const data = await getFreeGames();
        
        const formattedGames = data.map(game => ({
          id: game.id,
          title: game.title,
          developer: game.publisher,
          genre: game.genre,
          platform: game.platform,
          link: game.game_url,
          description: game.short_description,
          thumbnail: game.thumbnail,
          releaseDate: game.release_date
        }));
        
        setGames(formattedGames);
      } catch (error) {
        console.error("Erreur:", error);
        setError("Impossible de charger les jeux");
      } finally {
        setLoading(false);
      }
    };
  
    fetchGames();
  }, []);

  if (loading) return (
    <div className="loading-screen">
      <div className="spinner"></div>
      <p>Chargement des jeux...</p>
    </div>
  );

  if (error) return (
    <div className="error-screen">
      <div className="error-icon">⚠️</div>
      <p>{error}</p>
      <button onClick={() => window.location.reload()} className="retry-button">
        Réessayer
      </button>
    </div>
  );

  return (
    <div className="boutique-container">
      <header className="boutique-header">
        <h1><span className="game-icon">🎮</span> Jeux Gratuits</h1>
        <p className="subtitle">Découvrez les meilleures offres du moment</p>
      </header>
      
      {games.length === 0 ? (
        <div className="empty-state">
          <p>Aucun jeu disponible actuellement</p>
        </div>
      ) : (
        <div className="games-grid">
          {games.map((game) => (
            <div key={game.id} className="game-card">
              <div className="card-image-container">
                <img 
                  src={game.thumbnail} 
                  alt={game.title} 
                  className="card-image"
                  onError={(e) => { 
                    e.target.src = 'https://via.placeholder.com/400x225/2d3748/ffffff?text=Image+Non+Disponible'; 
                  }}
                />
                <div className={`platform-badge ${game.platform.toLowerCase()}`}>
                  {game.platform === 'PC (Windows)' ? 'PC' : 'Web'}
                </div>
              </div>
              
              <div className="card-content">
                <div className="card-header">
                  <h3 className="card-title">{game.title}</h3>
                  <span className="card-genre">{game.genre}</span>
                </div>
                
                <p className="card-developer">{game.developer}</p>
                <p className="card-description">{game.description}</p>
                
                <div className="card-footer">
                  <a 
                    href={game.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="play-button"
                  >
                    <span className="button-icon">▶</span> Jouer Gratuitement
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Boutique;