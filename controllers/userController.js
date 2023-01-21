const { User, Thought } = require('../models');

const userController = {
// will get all users
  getUsers(req, res) {
    User.find()
      .select('-__v')
      .then((dbUserData) => {
        res.json(dbUserData);
      }).catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
// will get one user
  getOneUser(req, res) {
    User.findOne({ _id: req.params.userId })
      .select('-__v')
      .populate('friends')
      .populate('thoughts')
      .then((dbUserData) => {
        if (!dbUserData) {
          return res.status(404).json({ message: 'This user does not exist.' });
        }
        res.json(dbUserData);
      }).catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
// will create new user
  createUser(req, res) {
    User.create(req.body)
      .then((dbUserData) => {
        res.json(dbUserData);
      }).catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
// will update exisiting user
  updateUser(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      {
        $set: req.body,
      },
      {
        runValidators: true,
        new: true,
      }
    ).then((dbUserData) => {
        if (!dbUserData) {
          return res.status(404).json({ message: 'This user does not exist.' });
        }
        res.json(dbUserData);
      }).catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
// will delete existing user
   deleteUser(req, res) {
    User.findOneAndDelete({ _id: req.params.userId })
      .then((dbUserData) => {
        if (!dbUserData) {
          return res.status(404).json({ message: 'This user does not exist.' });
        }
        return Thought.deleteMany({ _id: { $in: dbUserData.thoughts } });
      }).then(() => {
        res.json({ message: 'This user and thoughts have been deleted.' });
      }).catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
// will add friend to user
  addFriend(req, res) {
    User.findOneAndUpdate({ _id: req.params.userId }, { $addToSet: { friends: req.params.friendId } }, { new: true })
      .then((dbUserData) => {
        if (!dbUserData) {
          return res.status(404).json({ message: 'This user does not exist.' });
        }
        res.json(dbUserData);
      }).catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
// will remove friend from user
  removeFriend(req, res) {
    User.findOneAndUpdate({ _id: req.params.userId }, { $pull: { friends: req.params.friendId } }, { new: true })
      .then((dbUserData) => {
        if (!dbUserData) {
          return res.status(404).json({ message: 'This user does not exist.' });
        }
        res.json(dbUserData);
      }).catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
};

module.exports = userController;