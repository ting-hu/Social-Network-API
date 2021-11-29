const { User,Thought } = require('../models');

const userController = {
    //get all users
    getAllUsers(req, res) {
        User.find({})
            .populate({
                path: 'thoughts'
            })
            .populate({
                path: 'friends'
            })
            .then(dbUserData => res.json(dbUserData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            })
    },

    //get user by id
    getUserById({ params }, res) {
        User.findOne({ _id: params.id })
        .populate({
            path: 'thoughts'
        })
        .populate({
            path: 'friends'
        })
        .then(dbUserData => {
            if(!dbUserData) {
                res.status(404).json({ message: 'No user with this id!' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        })
    },

    //create user
    createUser({ body }, res) {
        User.create(body)
          .then(dbUserData => res.json(dbUserData))
          .catch(err => res.json(err));
      },

    //update User by Id
    updateUser({ params, body }, res) {
        User.findOneAndUpdate({ _id: params.id }, body, {new: true, runValidators: true})
        .then(dbUserData => {
            if(!dbUserData) {
                res.status(404).json({ message: 'no user found with this id!'})
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.status(404).json(err));
    },

    //delete user
    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.id }, {new: true})
        .then(deletedUser => {
            if(!deletedUser){
                return res.status(404).json({ message: 'no user with this id!'})
            }
            Thought.findAndDeleteMany({ userId: params.id})
        })
        .then(dbThoughtData => { 
            if(!dbThoughtData) {
                res.json({ message: "deleted user, but user has no associated thoughts to be deleted."})
                return;
            }
            res.json({message: 'Deleted User and associated thoughts!'});
        })
        .catch(err => res.status(400).json(err));
    },

    // add frind and update user by id
    addFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.id },
            {$push: { friends: params.friendId }},
            {new: true})
            .populate({
               path: 'friends',
               select: '-__v'
            })
            .select('-__v')
            .then(dbUserData => {
                if(!dbUserData) {
                    res.status(404).message({ message: 'no user found with this id!'});
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.status(400).json(err));
    },

    // delete friend by friend's id
    deleteFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.id },
            {$pull: { friends: params.friendId }}, {new: true} )
            .populate({
                path: 'friends'
            })
            .populate({
                path: 'thoughts'
            })
            .then(dbUserData => {
                if(!dbUserData) {
                    res.status(404).message({ message: 'no user found with this id!'});
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.status(400).json(err));
    }
}

module.exports = userController;