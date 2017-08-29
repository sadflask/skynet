var mongoose = require('mongoose');
var reactionModel = require('./models/reaction');
var ConsoleLogger = require('../../util/consolelogger')

exports.setApp = function(app) {

	app.get('/api/reactions', function(req, res) {
		ConsoleLogger.logRequest(req);
		reactionModel.find(req.query).exec(function(err, reaction) {
			if (err) {
				ConsoleLogger.logError(err);
				res.send({ error: err });
			} else {
				res.send({ reaction: reaction });
			}
		});
	});

//Function to get by emoji
	app.get('/api/reactions/:emojiName', function(req, res) {
		ConsoleLogger.logRequest(req);
		reactionModel.find({emoji: req.params.emojiName}).exec(function(err, reaction) {
			if (err) {
				ConsoleLogger.logError(err);
				res.send({ error: err });
			} else {
				res.send({ reaction: reaction });
			}
		});
	});

	app.post('/api/reactions', function(req, res) {
		ConsoleLogger.logRequest(req);

		var reaction = new reactionModel();

		reaction.emoji = req.body.emoji;
		reaction.total = 0;
		reaction.thisWeek = 0;
		reaction.lastWeek = 0;

		reaction.save(function(err) {
			if (err) {
				ConsoleLogger.logError(err);
				res.send({ error: err });
			} else {
				reactionModel.findById(reaction._id).exec( function(err, resolvedReaction) {
					if (err) {
						ConsoleLogger.logError(err);
						res.send({ error: err });
					} else {
						res.send({ reaction: resolvedReaction });
					}
				});
			}
		});
	});

	app.put('/api/reactions/:emojiName', function(req, res) {
		ConsoleLogger.logRequest(req);

		reactionModel.find({emoji: req.params.emojiName}).exec( function(err, reaction) {
			if (err) {
				res.send(err);
			}
			reaction.emoji = req.body.emoji;
			reaction.total = req.body.total;
			reaction.thisWeek = req.body.thisWeek;
			reaction.lastWeek = req.body.lastWeek;

			reaction.save(function(err) {
				if (err) {
					ConsoleLogger.logError(err);
					res.send({ error: err });
				} else {
					reactionModel.find({emoji: req.params.emojiName}).exec( function(err, reaction) {
						res.send({ reaction: reaction });
					});
				}
			});
		});
	});

	app.delete('/api/reactions/:emojiName', function(req, res) {
		ConsoleLogger.logRequest(req);
		reactionModel.remove({emoji: req.params.emojiName}, function(err) {
			if (err) {
				ConsoleLogger.logError(err);
				res.send({ error: err });
			} else {
				res.send({});
			}
		});
	});

}
