const ytdl = require('ytdl-core');

const validateYouTubeUrl = async (url) => {
  try {
    if (!url) return false;
    
    // Validation basique avant d'appeler ytdl-core
    if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
      return false;
    }

    // Validation avec ytdl-core
    if (!ytdl.validateURL(url)) {
      return false;
    }

    // Vérification que la vidéo existe
    const info = await ytdl.getInfo(url).catch(() => null);
    return !!info;

  } catch (err) {
    console.error('Erreur de validation YouTube:', err);
    return false;
  }
};

const extractYouTubeId = (url) => {
  try {
    return ytdl.getVideoID(url);
  } catch (err) {
    console.error('Erreur d\'extraction YouTube ID:', err);
    return null;
  }
};

module.exports = {
  validateYouTubeUrl,
  extractYouTubeId
};