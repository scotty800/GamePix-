const axios = require('axios');

const getFreeGames = async (req, res) => {
  try {
    console.log('Appel à l\'API FreeToGame');
    const response = await axios.get('https://www.freetogame.com/api/games');

    const games = response.data;
    console.log('Réponse reçue de l\'API FreeToGame :', games.slice(0, 3)); // Affiche les 3 premiers jeux pour test

    if (!Array.isArray(games) || games.length === 0) {
      console.log('Aucun jeu gratuit trouvé.');
      return res.status(200).json([]); // Retourne un tableau vide si aucun jeu
    }

    // Tu peux filtrer ici si tu veux limiter le nombre de jeux ou reformater
    const formattedGames = games.map(game => ({
      id: game.id,
      title: game.title,
      thumbnail: game.thumbnail,
      short_description: game.short_description,
      genre: game.genre,
      platform: game.platform,
      publisher: game.publisher,
      game_url: game.game_url,
      release_date: game.release_date
    }));

    res.status(200).json(formattedGames);
  } catch (error) {
    console.error('Erreur lors de la récupération des jeux gratuits :', error.message);
    res.status(500).json({ error: 'Impossible de récupérer les jeux gratuits' });
  }
};

module.exports = { getFreeGames };
