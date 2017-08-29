var mongoose = require('mongoose');

var reactionSchema = new mongoose.Schema({
	emoji: String(),
	total: Number(),
	thisWeek: Number(),
	lastWeek: Number()
});

module.exports = mongoose.model('reaction', reactionSchema);
