const { User, Thought } = require('../models');


const thoughtController = {
    //get all thoughts
    getAllThoughts(req, res) {
        Thought.find({})
            .populate({
                path: 'reactions'
            })
            .then(dbThoughtData => res.json(dbThoughtData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err)
            })
    },

    //create thought
    createThought({ body }, res) {
        Thought.create(body)
            .then((dbThoughtData) => {
                console.log(body.userId)
                console.log(dbThoughtData._id)
                return User.findOneAndUpdate(
                    { _id: body.userId },
                    { $push: { thoughts: dbThoughtData._id }},
                    { new: true}
                );
            })
            .then(dbUserData => {
                if(!dbUserData) {
                    res.status(404).json({ message: 'no user found with this id'});
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.json(err));
    },

    //get thought by id
    getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.id})
        .then(dbThoughtData => {
            if(!dbThoughtData) {
                res.status(404).json({ message: 'no thought with this id!'});
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.json(err));
    },

    //update thought by id 
    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.id }, body, { new: true })
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'No thought found with that id.' })
                    return;
                }
                res.json(dbThoughtData);
            })
            .catch(err => res.status(400).json(err));
    },

    //delete thought
    deleteThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.id })
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({ message: 'no thought found with this id!'})
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.status(400).json(err));
    },
    
    // create reaction
    createReaction({params, body}, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId},
            { $push: { reactions: body }},
            { new: true }
        )
        .then(dbThoughtData => {
            console.log(body)
            if(!dbThoughtData) {
                res.status(404).json({ message: 'no thought found with this id'});
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.json(err));
    },
      
    // delete reaction
    deleteReaction(req, res) {
        Thought.findOneAndUpdate(
          { _id: req.params.thoughtId },
        {$pull: { reactions: { _id: req.params.reactionId}}},
          { new: true }
        )
          .then(dbPizzaData => res.json(dbPizzaData))
          .catch(err => res.json(err));
      }
   }

module.exports = thoughtController;