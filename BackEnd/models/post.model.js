const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
    {
        posterId: {
            type: String,
            required: true
        },
        posterPseudo: {
            type: String,
            required: true
        },
        message: {
            type: String,
            trim: true,
            maxLength: 400
        },

        picture: {
            type: String,
        },
        video: {
            type: String,
        },
        likes: {
            type: [String],
            required: true,
        },

        comments: {
            type: [
                {
                    commenterId: String,
                    commenterPseudo: String,
                    text: String,
                    Timestamp: Number,
                }
            ],
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('post', postSchema);