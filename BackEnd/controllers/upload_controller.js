const UserModel = require('../models/user.model');
const fs = require('fs');
const path = require('path');
const { uploadErrors } = require('../utils/errors.utils');

module.exports.profilUpload = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Aucun fichier uploadé" });
        }

        // Vérification du type de fichier
        if (!req.file.mimetype.match(/^image\/(jpeg|png|jpg)$/)) {
            return res.status(400).json({ message: "Seuls les JPEG et PNG sont autorisés" });
        }

        // Vérification de la taille
        if (req.file.size > 2 * 1024 * 1024) { // 2MB max
            return res.status(400).json({ message: "La taille maximale est de 2MB" });
        }

        const userId = req.params.id;
        const fileName = `profile-${userId}-${Date.now()}${path.extname(req.file.originalname)}`;
        const uploadDir = path.join(__dirname, '../uploads/profiles');
        const uploadPath = path.join(uploadDir, fileName);

        // Créer le dossier s'il n'existe pas
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Sauvegarder le fichier
        await fs.promises.writeFile(uploadPath, req.file.buffer);

        // Mettre à jour l'utilisateur
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { picture: `/uploads/profiles/${fileName}` },
            { new: true }
        );

        if (!updatedUser) {
            // Supprimer le fichier uploadé si l'utilisateur n'existe pas
            await fs.promises.unlink(uploadPath);
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        return res.status(200).json({ 
            picture: `/uploads/profiles/${fileName}`,
            user: updatedUser
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erreur serveur" });
    }
};

module.exports.getProfilePicture = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await UserModel.findOne({ pseudo: username });

        if (!user || !user.picture) {
            return res.status(404).json({ message: "Photo de profil non trouvée" });
        }

        res.status(200).json({ imageUrl: `${process.env.BACKEND_URL}${user.picture}` });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};
