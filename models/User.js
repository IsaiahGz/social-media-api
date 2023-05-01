const { Schema, model } = require('mongoose');

// Schema to create a user model
const userSchema = new Schema(
	{
		username: {
			type: String,
			unique: true,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			unique: true,
			required: true,
			match: [/.+@.+\..+/, 'Please enter a valid e-mail address'],
		},
		thoughts: {
			type: Schema.Types.ObjectId,
			ref: 'Thought',
		},
		friends: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
	},
	{
		toJSON: {
			virtuals: true,
		},
		id: false,
	}
);

// Add a virtual to get total count of friends
userSchema.virtual('friendCount').get(function () {
	return this.friends.length;
});

const User = model('user', userSchema);

module.exports = User;
