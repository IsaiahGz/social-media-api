const { User } = require('../models/index');

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
			res.json({ message: 'User deleted' }, user);
		} catch (err) {
			res.status(500).send('Error deleting user.');
			next(err);
		}
	},
};
