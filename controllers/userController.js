const { User, Thought } = require('../models/index');

module.exports = {
	// Get all users
	async getUsers(req, res, next) {
		try {
			const users = await User.find();
			res.json(users);
		} catch (err) {
			res.status(500).send('Error getting users.');
			next(err);
		}
	},
	// Get a single user
	async getSingleUser(req, res, next) {
		try {
			const user = await User.findOne({ _id: req.params.userId });
			if (!user) {
				res.status(404).send(`No user with the following id: ${req.params.userId}.`);
				return;
			}

			// Send the user that was found
			res.json(user);
		} catch (err) {
			res.status(500).send('Error getting user.');
			next(err);
		}
	},
	// Create a new user
	async createUser(req, res, next) {
		try {
			const user = await User.create(req.body);
			res.json(user);
		} catch (err) {
			res.status(500).send('Error creating user.');
			next(err);
		}
	},
	// Update a user
	async updateUser(req, res, next) {
		try {
			const user = await User.findOneAndUpdate({ _id: req.params.userId }, { $set: req.body }, { runValidators: true, new: true });
			if (!user) {
				res.status(404).send(`No user with the following id: ${req.params.userId}.`);
				return;
			}

			// Found and updated user. Send back user with edits
			res.json(user);
		} catch (err) {
			res.status(500).send('Error updating user.');
			next(err);
		}
	},
	// Delete a user
	async deleteUser(req, res, next) {
		try {
			const user = await User.findOneAndDelete({ _id: req.params.userId });
			if (!user) {
				res.status(404).send(`No user with the following id: ${req.params.userId}.`);
				return;
			}
			// Delete all thoughts associated with the user
			const thoughts = await Thought.deleteMany({ username: user.username });
			res.json({ message: 'User and thoughts deleted.' }, user, thoughts);
		} catch (err) {
			res.status(500).send('Error deleting user.');
			next(err);
		}
	},
	// Add a friend to a user's friend list
	async addFriend(req, res, next) {
		// /api/users/:userId/friends/:friendId
		try {
			// Make sure IDs dont match
			if (req.params.userId === req.params.friendId) {
				res.status(400).send(`Can't set friend as own user.`);
				return;
			}
			// Get user by userId
			const user = await User.findById(req.params.userId);
			if (!user) {
				res.status(404).send(`No user with the following id: ${req.params.userId}.`);
				return;
			}

			const friend = await User.findById(req.params.friendId);
			if (!friend) {
				res.status(404).send(`No user with the following id: ${req.params.friendId}.`);
				return;
			}

			// Add friendId to user's friend list
			user.friends.push(friend._id);
			await user.save();
			res.status(200).json(user);
		} catch (err) {
			res.status(500).send('Error adding friend.');
			next(err);
		}
	},
	// Remove a friend from a user's friend list
	async removeFriend(req, res, next) {
		// /api/users/:userId/friends/:friendId
		try {
			// Make sure IDs dont match
			if (req.params.userId === req.params.friendId) {
				res.status(400).send(`Can't set friend as own user.`);
				return;
			}
			// Get user by userId
			const user = await User.findById(req.params.userId);
			if (!user) {
				res.status(404).send(`No user with the following id: ${req.params.userId}.`);
				return;
			}

			// Remove friendId from user's friend list
			user.friends = user.friends.filter((id) => id !== req.params.friendId);
			await user.save();
			res.status(200).json(user);
		} catch (err) {
			res.status(500).send('Error adding friend.');
			next(err);
		}
	},
};
