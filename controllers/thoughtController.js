const { Thought, User } = require('../models/index');

module.exports = {
	// Get all thoughts
	async getThoughts(req, res, next) {
		try {
			const thoughts = await Thought.find();
			res.json(thoughts);
		} catch (err) {
			res.status(500).send('Error getting thoughts.');
			next(err);
		}
	},
	// Get a single thought
	async getSingleThought(req, res, next) {
		try {
			const thought = await Thought.findOne({ _id: req.params.thoughtId });
			if (!thought) {
				res.status(404).send(`No thought with the following id: ${req.params.thoughtId}.`);
				return;
			}

			// Send the thought that was found
			res.json(thought);
		} catch (err) {
			res.status(500).send('Error getting thought.');
			next(err);
		}
	},
	// Create a new thought
	async createThought(req, res, next) {
		try {
			// Search for user first
			const user = await User.findOne({ username: req.body.username });
			if (!user) {
				res.status(404).send(`No user with the following username found: ${req.body.username}.`);
				return;
			}
			const thought = await Thought.create(req.body);
			// Add thought id to user thoughts
			user.thoughts.push(thought._id);
			await user.save();
			res.json(thought);
		} catch (err) {
			res.status(500).send('Error creating thought.');
			next(err);
		}
	},
	// Update a thought
	async updateThought(req, res, next) {
		try {
			const thought = await Thought.findOneAndUpdate({ _id: req.params.thoughtId }, { $set: req.body }, { runValidators: true, new: true });
			if (!thought) {
				res.status(404).send(`No thought with the following id: ${req.params.thoughtId}.`);
				return;
			}

			// Found and updated thought. Send back thought with edits
			res.json(thought);
		} catch (err) {
			res.status(500).send('Error updating thought.');
			next(err);
		}
	},
	// Delete a thought
	async deleteThought(req, res, next) {
		try {
			const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });
			if (!thought) {
				res.status(404).send(`No thought with the following id: ${req.params.thoughtId}.`);
				return;
			}
			res.json({ message: 'Thought deleted' }, thought);
		} catch (err) {
			res.status(500).send('Error deleting thought.');
			next(err);
		}
	},
};
