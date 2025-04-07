const UserModel = require('../models/user.model');
const fs = require('fs');
const { promisify } = require("util");
const pipeline = promisify(require('stream').pipeline);
const { uploadErrors } = require('../utils/errors.utils');
const path = require("path");

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

        if (req.file.size > 10000000) {
            throw new Error("File size exceeds the maximum allowed size of 10MB");
        }

        const fileName = req.body.name + ".jpg";
        const uploadPath = path.join(__dirname, "../uploads/profil");

        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        // ⚠️ utilise writeFile avec le buffer, pas pipeline
        await fs.promises.writeFile(
            path.join(uploadPath, fileName),
            req.file.buffer
        );

        return res.status(200).json({ message: "File uploaded successfully" });
    } catch (err) {
        console.error("Caught error:", err);
        return res.status(400).json({ err: err.message || "Unknown error occurred" });
    }
};