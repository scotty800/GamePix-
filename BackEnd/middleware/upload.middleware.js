const multer = require('multer');
const path = require('path');

const storage = multer.memoryStorage(); // Stockage en mémoire pour le traitement

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        cb(null, true);
    } else {
        cb(new Error('Type de fichier non supporté. Seuls les JPEG/PNG sont autorisés'), false);
    }
};

module.exports = multer({
    storage: storage,
    limits: {
        fileSize: 2 * 1024 * 1024 // Limite à 2MB
    },
    fileFilter: fileFilter
});