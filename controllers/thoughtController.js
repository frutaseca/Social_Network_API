const { User, Thought} = require('../models');

const thoughtController = {
// will get all thoughts
    getThoughts(req, res) {
      Thought.find()
        .sort({ createdAt: -1 })
        .then((dbThoughtData) => {
          res.json(dbThoughtData);
        }).catch((err) => {
          console.log(err);
          res.status(500).json(err);
        });
    },
// will get one thought
    getOneThought(req, res) {
      Thought.findOne({ _id: req.params.thoughtId })
        .then((dbThoughtData) => {
          if (!dbThoughtData) {
            return res.status(404).json({ message: 'This id does not exist' });
          }
          res.json(dbThoughtData);
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json(err);
        });
    },
  // will create a new thought
    createThought(req, res) {
      Thought.create(req.body)
        .then((dbThoughtData) => {
          return User.findOneAndUpdate(
            { _id: req.body.userId },
            { $push: { thoughts: dbThoughtData._id } },
            { new: true }
          );
        }).then((dbUserData) => {
          if (!dbUserData) {
            return res.status(404).json({ message: 'A thought has been created but no user with this id' });
          }
          res.json({ message: 'Thought has been created' });
        }).catch((err) => {
          console.log(err);
          res.status(500).json(err);
        });
    },
  // will update a thought
    updateThought(req, res) {
      Thought.findOneAndUpdate({ _id: req.params.thoughtId }, { $set: req.body }, { runValidators: true, new: true })
        .then((dbThoughtData) => {
          if (!dbThoughtData) {
            return res.status(404).json({ message: 'This id does not exist' });
          }
          res.json(dbThoughtData);
        }).catch((err) => {
          console.log(err);
          res.status(500).json(err);
        });
    },
  // will delete a thought
    deleteThought(req, res) {
      Thought.findOneAndRemove({ _id: req.params.thoughtId })
        .then((dbThoughtData) => {
          if (!dbThoughtData) {
            return res.status(404).json({ message: 'This id does not exist' });
          }
          return User.findOneAndUpdate(
            { thoughts: req.params.thoughtId },
            { $pull: { thoughts: req.params.thoughtId } },
            { new: true }
          );
        }).then((dbUserData) => {
          if (!dbUserData) {
            return res.status(404).json({ message: 'A thought has been created but no user with this id' });
          }
          res.json({ message: 'Thought has been deleted' });
        }).catch((err) => {
          console.log(err);
          res.status(500).json(err);
        });
    },
  // will add reaction to thought
    addReaction(req, res) {
      Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { runValidators: true, new: true }
      ).then((dbThoughtData) => {
          if (!dbThoughtData) {
            return res.status(404).json({ message: 'A user with this id does not exist.' });
          }
          res.json(dbThoughtData);
        }).catch((err) => {
          console.log(err);
          res.status(500).json(err);
        });
    },
// will remove thought
    removeReaction(req, res) {
      Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        { runValidators: true, new: true }
      ).then((dbThoughtData) => {
          if (!dbThoughtData) {
            return res.status(404).json({ message: 'This id does not exist' });
          }
          res.json(dbThoughtData);
        }).catch((err) => {
          console.log(err);
          res.status(500).json(err);
        });
    },
};

module.exports = thoughtController;