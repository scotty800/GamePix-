const UserModel = require('../models/user.model');
const fs = require('fs');
const path = require('path');
const { uploadErrors } = require('../utils/errors.utils');

module.exports.profilUpload = async (req, res) => {
    try {
        if (!req.file) {
            throw new Error("No file uploaded");
        }

        if (
            req.file.mimetype !== "image/jpg" &&
            req.file.mimetype !== "image/png" &&
            req.file.mimetype !== "image/jpeg"
        ) {
            throw new Error("Invalid file type");
        }

        if (req.file.size > 500000) {
            throw new Error("File size exceeds the maximum allowed size of 10MB");
        }

        const fileName = req.body.name + ".jpg";
        const uploadPath = path.join(__dirname, "../uploads/profil");

        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        await fs.promises.writeFile(
            path.join(uploadPath, fileName),
            req.file.buffer
        );

        // ✅ Met à jour l'utilisateur après l'upload
        const userPicture = await UserModel.findByIdAndUpdate(
            req.params.userId,
            { $set: { picture: "./uploads/profil/" + fileName } },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        if (!userPicture) {
            return res.status(404).send("User not found");
        }

        return res.status(200).json({ message: "File uploaded and user updated", user: userPicture });

    } catch (err) {
        const errors = uploadErrors(err);
        return res.status(400).json({ errors });
    }
};
