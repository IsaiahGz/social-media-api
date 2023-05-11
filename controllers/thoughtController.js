const { Thought, User } = require('../models/index');

module.exports = {
	// Get all thoughts
	async getThoughts(req, res, next) {
		try {
			const thoughts = await Thought.find();
			res.json(thoughts);
		} catch (err) {
			res.status(500).json({ message: 'Error getting thoughts.' });
			next(err);
		}
	},
	// Get a single thought
	async getSingleThought(req, res, next) {
		try {
			const thought = await Thought.findOne({ _id: req.params.thoughtId });
			if (!thought) {
				res.status(404).json({ message: `No thought with the following id: ${req.params.thoughtId}.` });
				return;
			}

			// Send the thought that was found
			res.json(thought);
		} catch (err) {
			res.status(500).json({ message: 'Error getting thought.' });
			next(err);
		}
	},
	// Create a new thought
	async createThought(req, res, next) {
		try {
			// Search for user first
			const user = await User.findOne({ username: req.body.username });
			if (!user) {
				res.status(404).json({ message: `No user with the following username found: ${req.body.username}.` });
				return;
			}
			const thought = await Thought.create(req.body);
			// Add thought id to user thoughts
			user.thoughts.push(thought._id);
			await user.save();
			res.json(thought);
		} catch (err) {
			res.status(500).json({ message: 'Error creating thought.' });
			next(err);
		}
	},
	// Update a thought
	async updateThought(req, res, next) {
		try {
			const thought = await Thought.findOneAndUpdate({ _id: req.params.thoughtId }, { $set: req.body }, { runValidators: true, new: true });
			if (!thought) {
				res.status(404).json({ message: `No thought with the following id: ${req.params.thoughtId}.` });
				return;
			}

			// Found and updated thought. Send back thought with edits
			res.json(thought);
		} catch (err) {
			res.status(500).json({ message: 'Error updating thought.' });
			next(err);
		}
	},
	// Delete a thought
	async deleteThought(req, res, next) {
		try {
			const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });
			if (!thought) {
				res.status(404).json({ message: `No thought with the following id: ${req.params.thoughtId}.` });
				return;
			}
			res.json({ message: 'Thought deleted', thought });
		} catch (err) {
			res.status(500).json({ message: 'Error deleting thought.' });
			next(err);
		}
	},
	// Create a reaction
	async createReaction(req, res, next) {
		try {
			const thought = await Thought.findOne({ _id: req.params.thoughtId });
			if (!thought) {
				res.status(404).json({ message: `No thought with the following id: ${req.params.thoughtId}.` });
				return;
			}
			thought.reactions.push(req.body);
			await thought.save();
			res.json(thought);
		} catch (err) {
			res.status(500).json({ message: 'Error creating reaction.' });
			next(err);
		}
	},
	// Delete a reaction
	async deleteReaction(req, res, next) {
		try {
			const thought = await Thought.findOne({ _id: req.params.thoughtId });
			if (!thought) {
				res.status(404).json({ message: `No thought with the following id: ${req.params.thoughtId}.` });
				return;
			}
			// Filter out the reaction that matches the reactionId
			thought.reactions = thought.reactions.filter((reaction) => reaction.reactionId.toString() !== req.body.reactionId);
			await thought.save();
			res.json(thought);
		} catch (err) {
			res.status(500).json({ message: 'Error deleting reaction.' });
			next(err);
		}
	},
};
