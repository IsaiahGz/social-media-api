const { Schema, Types } = require('mongoose');
const dayjs = require('dayjs');

// Schema to create a reaction
const reactionSchema = new Schema({
	reactionId: {
		type: Schema.Types.ObjectId,
		default: () => new Types.ObjectId(),
	},
	reactionBody: {
		type: String,
		required: true,
		maxlength: 280,
	},
	username: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
		get: (createdAtDate) => dayjs(createdAtDate).format('MMM D, YYYY hh:mm a'),
	},
});

module.exports = reactionSchema;
