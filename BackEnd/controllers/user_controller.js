const userModel = require("../models/user.model");
const UserModel = require("../models/user.model");
const ObjectID = require("mongoose").Types.ObjectId;

module.exports.getAllUsers = async (req, res) => {
    const users = await UserModel.find().select('-password')
    res.status(200).json(users);
};

module.exports.userInfo = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(404).send('ID unKnown : ' + req.params.id)
    try {
        const user = await UserModel.findById(req.params.id)
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.status(200).json(user)
    } catch (err) {
        console.log('ID unKnown :' + err);
        res.status(500).send('An error occurred');
    }
}

module.exports.userUpdate = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(404).send('ID unKnown :' + req.params.id);

    try {
        const updateUser = await UserModel.findByIdAndUpdate(
            { _id: req.params.id },
            {
                $set: {
                    bio: req.body.bio,
                    pseudo: req.body.pseudo
                }
            },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );
        if (!updateUser) {
            return res.status(404).send('User not found')
        }
        res.status(200).json(updateUser);
    } catch (err) {
        res.status(500).json({ message: err });
    }
}

module.exports.deleteUser = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(404).send('ID unKnown : ' + req.params.id);

    try {
        const userDelete = await userModel.findByIdAndDelete(req.params.id)
        if (!userDelete) {
            return res.status(404).send({ message: "User not found." });
        }
        res.status(200).json({ message: "Successfully deleted." });
    } catch (err) {
        res.status(500).json({ message: err })
    }
}

module.exports.follower = async (req, res) => {
    if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.params.id))
        return res.status(404).send('ID unKnown : ' + req.params.id);

    try {
        // add to the follower list 
        const followUser = await userModel.findByIdAndUpdate(
            req.params.id,
            {
                $addToSet: { following: req.body.idtoFollow }
            },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        )
        if (!followUser) {
            return res.status(404).send('User not found');
        }

        // add to the following list
        const followingUser = await userModel.findByIdAndUpdate(
            req.body.idtoFollow,
            {
                $addToSet: { followers: req.params.id }
            },
            { new: true, upsert: true, setDefaultsOnInsert: true },
        );
        if (!followingUser) {
            return res.status(404).send('User not found');
        }
        res.status(201).json(followUser);
    } catch (err) {
        res.status(500).json({ message: err });
    }
}

module.exports.unfollow = async (req, res) => {
    if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idTounFollow))
        return res.status(400).send('ID unKnown : ' + req.params.id);

    try {
        // add to the follower list 
        const followUser = await UserModel.findByIdAndUpdate(
            req.params.id,
            { $pull: { following: req.body.idTounFollow } },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );
        if (!followUser) {
            return res.status(404).send('User not found');
        }
        res.status(201).json(followUser);

        // add to following list
        const followingUser = await UserModel.findByIdAndUpdate(
            req.body.idTounFollow,
            { $pull: { followers: req.params.id } },
            { new: true, upsert: true, setDefaultsOnInsert: true },
        );
        if (!followingUser) {
            return res.status(404).send('User not add following');
        }

    } catch (err) {
        res.status(500).json({ message: err });
    }
}
