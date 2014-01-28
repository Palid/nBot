var _ = require('lodash'),
	irc = require('irc'),
	client = require('./config.js'),
	winston = require('winston');

var methods = {
    topic : function(channel, topic){
        client.say(channel + ' topic changed to ' + topic);
        return client.send("TOPIC", channel, topic);       
    },
	kick : function(arguments, commandGiver, channel){
        // Goddamn linter
        // It really is okay, dammit.
        if (_.isUndefined(arguments)) var arguments = "";

        var firstWhitespace = _.indexOf(arguments, ' '),
            body = arguments.substring(firstWhitespace+1),
            nick = arguments.substring(0, firstWhitespace);

        console.log(nick);

		if (nick === "chomis" || body === "chomis"){

			return client.send("KICK", channel, commandGiver, "Czemu chcesz wykopać chomika? ;_;");
		} else {
			return client.send("KICK", channel, nick, body);
		}
    },
    say : function(channel, arguments){
        return client.say(channel, arguments);
    },
    shout : function(channel, arguments){
        return client.say(channel, arguments.toUpperCase());
<<<<<<< HEAD
    },
    list : function(channel){
        for (property in methods){
            console.log(property);
        }
=======
>>>>>>> 657436d45afca0f0e7bfc53e87aba9d446e9a8d5
    }

    // TODO:
    // Create serious aliases system
    // because this thing is a BIG SHIT at the moment.
    // IT REALLY IS SHITTY.
    // REALLY.
    // TODO:
    // ban
    // google search
    // maths
    // maybe eval, but I'm not that crazy I think.
};

module.exports = methods;