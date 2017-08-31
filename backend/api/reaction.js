var mongoose = require('mongoose');
var reactionModel = require('./models/reaction');
var ConsoleLogger = require('../../util/consolelogger')

exports.setApp = function(app) {

	app.get('/api/reactions', function(req, res) {
		ConsoleLogger.logRequest(req);
		reactionModel.find({}, function(err, reactions) {
			if (err) {
				ConsoleLogger.logError(err);
				res.send({ error: err });
			} else {
				res.send({ reactions: reactions });
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

		reaction.save(function(err,reaction) {
			if (err) {
				ConsoleLogger.logError(err);
				res.send({ error: err });
			} else {
				res.send({ reaction: reaction });
			}
		});
	});

	app.put('/api/reactions/:emojiName', function(req, res) {
		ConsoleLogger.logRequest(req);

		reactionModel.findOne({emoji: req.params.emojiName}, function(err, reaction) {
			if (err) {
				res.send(err);
			}
			ConsoleLogger.logMessage("reaction: "+reaction);
			reaction.emoji = req.body.emoji;
			reaction.total = req.body.total;
			reaction.thisWeek = req.body.thisWeek;
			reaction.lastWeek = req.body.lastWeek;

			reaction.save(function(err) {
				if (err) {
					ConsoleLogger.logError(err);
					res.send({ error: err });
				} else {
					reactionModel.findById(reaction.id).exec( function(err, reaction) {
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

	app.delete('/api/reactions', function(req,res) {
		ConsoleLogger.logRequest(req);
		reactionModel.remove({},function(err) {
			if (err) {
				ConsoleLogger.logError(err);
				res.send({error: err });
			} else {
				res.send({});
			}
		});
	});

}
