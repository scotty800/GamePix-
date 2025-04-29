const express = require('express');
const router = express.Router();
const freeGamesController = require('../controllers/freeGames_controller');

// Route pour récupérer les jeux gratuits
router.get('/free-games', freeGamesController.getFreeGames);

module.exports = router;
