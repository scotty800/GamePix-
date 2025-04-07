const postModel = require('../models/post.model');
const PostModel = require('../models/post.model');
const userModel = require('../models/user.model');
const UserModel = require('../models/user.model');
const ObjectID = require("mongoose").Types.ObjectId;

module.exports.createPost = async (req, res) => {
    const Post = PostModel({
        posterId: req.body.posterId,
        message: req.body.message,
        video: req.body.video,
        Likers: [],
        comments: [],
    });

    try {
        const newPost = await Post.save();
        res.status(201).json(newPost);
    } catch (err) {
        res.status(400).send(err);
    }
};

module.exports.readPost = async (req, res) => {
    try {
        const read = await PostModel.find();
        res.status(200).json(read).sort({ createdAt: -1 });
    } catch (err) {
        console.log("Error to get data: " + err);
    }
}

module.exports.updatePost = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unKnown' + req.params.id);

    try {
        const postUpdate = await postModel.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    message: req.body.message
                }

            },
            { new: true },
        )
        res.status(200).json(postUpdate);
    } catch (err) {
        console.log("Update error: " + err);
    }
}

module.exports.deletePost = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unKnown' + req.params.id);

    try {
        const postDelete = await postModel.findByIdAndDelete(req.params.id)
        if (!postDelete)
            res.status(400).send({ message: "post not found. " });
        res.status(200).json({ message: "Successfully deleted. " });
    } catch (err) {
        console.log("Delete error : " + err);
    }
}

module.exports.likePost = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unKnown' + req.params.id);

    try {
        const postLike = await postModel.findByIdAndUpdate(
            req.params.id,
            {
                $addToSet: { likes: req.body.id }
            },
            { new: true },
        );
        if (!postLike) {
            return res.status(404).send('Post not found');
        }

        const userLiker = await userModel.findByIdAndUpdate(
            req.body.id,
            {
                $addToSet: { likes: req.params.id }
            },
            { new: true },
        );
        if (!userLiker) {
            return res.status(404).send('User not found');
        }
        res.status(200).json({ postLike, userLiker });
    } catch (err) {
        return res.status(400).send(err);
    }
}

module.exports.unlikePost = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unKnown' + req.params.id);

    try {
        const postLike = await postModel.findByIdAndUpdate(
            req.params.id,
            {
                $pull: { likes: req.body.id }
            },
            { new: true },
        );
        if (!postLike) {
            return res.status(404).send('Post not found');
        }

        const userLiker = await userModel.findByIdAndUpdate(
            req.body.id,
            {
                $pull: { likes: req.params.id }
            },
            { new: true },
        );
        if (!userLiker) {
            return res.status(404).send('User not found');
        }
        res.status(200).json({ postLike, userLiker });
    } catch (err) {
        return res.status(400).send(err);
    }
}

module.exports.commentPost = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unKnown' + req.params.id);
    try {
        postComment = await postModel.findByIdAndUpdate(
            req.params.id,
            {
                $push: {
                    comments: {
                        commenterId: req.body.commenterId,
                        commenterPseudo: req.body.commenterPseudo,
                        text: req.body.text,
                        Timestamp: new Date().getTime()
                    },
                },
            },
            { new: true },
        )
        if (!postComment) {
            res.status(404).send('Post not found');
        }
        res.status(200).json({ postComment });
    } catch (err) {
        return res.status(400).send(err);
    }
}

module.exports.editCommentPost = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unKnown' + req.params.id);

    try {
        commentEdit = await postModel.findById(
            req.params.id
        );

        if (!commentEdit) {
            return res.status(404).send('Post not found');
        }

        const theComment = commentEdit.comments.find((comment) =>
            comment._id.equals(req.body.commentid)
        );
        if (!theComment) {
            return res.status(404).send('Comment not found');
        }
        theComment.text = req.body.text;

        await commentEdit.save();

        res.status(200).json(commentEdit);

    } catch (err) {
        return res.status(400).send(err);
    }
}

module.exports.deleteCommentPost = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unKnown' + req.params.id);

    try {
        commentDelete = await postModel.findByIdAndUpdate(
            req.params.id,
            {
                $pull: {
                    comments: {
                        _id: req.body.commentid,
                    },
                },
            },
            { new: true },
        );
        if (!commentDelete) {
            res.status(404).send('Post not found');
        }
        res.status(200).json({ commentDelete });
    } catch (err) {
        return res.status(400).send(err);
    }
}

