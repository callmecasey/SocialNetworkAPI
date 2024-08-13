const Thought = require("../models/Thought");
const User = require("../models/User");
//write our functions for thoughts

//delete a reaction by unique id
module.exports = {
  //get all thoughts
  async getThoughts(req, res) {
    try {
      const thoughts = await Thought.find();
      res.json(thoughts);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  //get a single thought by unique id
  async getSingleThought(req, res) {
    try {
      const thought = await Thought.findOne({
        _id: req.params.thoughtId,
      }).select("-__v");

      if (!thought) {
        return res.status(404).json({ message: "No thought with that ID" });
      }
      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  //create a new thought
  async createThought(req, res) {
    try {
      const user = await User.findOne({ username: req.body.username });

      if (!user) {
        return res
          .status(404)
          .json({ message: "User not found, so message was NOT created" });
      }
      const dbThoughtData = await Thought.create(req.body);
      res.json(dbThoughtData);
      await User.findOneAndUpdate(
        { username: req.body.username },
        { $addToSet: { thoughts: dbThoughtData._id } },
        { new: true }
      );
    } catch (err) {
      res.status(500).json(err);
    }
  },
  //update a thought by unique id
  async updateThought(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, new: true }
      );
      if (!thought) {
        return res.status(404).json({ message: "No thought with that ID" });
      }
      res.json(thought);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  //delete a thought by unique id
  async deleteThought(req, res) {
    try {
      const thought = await Thought.findOneAndDelete({
        _id: req.params.thoughtId,
      });
      if (!thought) {
        return res.status(404).json({ message: "No thought with that ID" });
      }
      const user = await User.findOneAndUpdate(
        { username: thought.username },
        { $pull: { thoughts: thought._id } },
        { new: true }
      );
      if (!user) {
        return res.status(404).json({
          message: "Thought deleted, but no user  with that username",
        });
      }

      res.json({ message: "thought successfully deleted!" });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  //create a reaction and store in thoughts array
  async addReaction(req, res) {
    try {
      const user = await User.findOne({ username: req.body.username });
      if (!user) {
        return res
          .status(404)
          .json({ error: `User not found, therefore no reaction created` });
      }
      const thought = await Thought.findOne({ _id: req.params.thoughtId });
      if (!thought) {
        return res.status(404).json({ message: "No thought with that ID" });
      }
      const reaction = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { runValidators: true, new: true }
      );
      res.json(reaction);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  //delete a reaction by unique id
  async removeReaction(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        { runValidators: true, new: true }
      );
      if (!thought) {
        return res.status(404).json({ message: "No thought with that ID" });
      }
      res.status(200).json({message: `REACTION DELETED`, thought});
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  },
};
