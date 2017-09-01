exports.initEmojis = function(requester, guild) {
  //Get all emojis in list
  requester.getAll(function(err, res, body) {
      var reactions = JSON.parse(body).reactions;
      var emojis = [];
      reactions.forEach(function(reaction) {
        emojis.push(reaction.emoji);
      });
      //Get all emojis in guild
      guild.emojis.forEach(function(value, key) {
        if(emojis.indexOf(value.toString())===-1) {
          console.log(value+' is not in the db');
          requester.newEmoji(value.toString());
        }
      });
      //For each not in, do a newEmoji call.
  })

}
