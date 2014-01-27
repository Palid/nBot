var _ = require('lodash'),
	winston = require('winston'),
	irc = require('irc'),
	client = require('./config.js'),
	methods = require('./methods.js');

var aliases = {
	// kick
	kick : function(arguments, nick, channel){
	    return methods.kick(arguments, nick, channel);
	},
	sage : function(arguments, nick, channel){
	    return methods.kick(arguments, nick, channel);
	},
	kenbo : function(arguments, nick, channel){
	    return methods.kick(arguments, nick, channel);
	},
	wypierdalaj: function(arguments, nick, channel){
	    return methods.kick(arguments, nick, channel);
	},
	// topic
	topic : function(topic, from, channel){
		return methods.topic(channel, topic);
	},
	temat : function(topic, from, channel){
	    return methods.topic(channel, topic);
	},
	// say
	say : function(arguments, nick, channel){
		return methods.say(channel, arguments);
	},
	mow : function(arguments, nick, channel){
		return methods.say(channel, arguments);
	},
	// shout
	shout : function(arguments, nick, channel){
		return methods.shout(channel, arguments);
	},
	krzycz : function(arguments, nick, channel){
		return methods.shout(channel, arguments);
	},
	// command list
	list : function(arguments, nick, channel){
		return methods.list(channel);
	}
};

module.exports = aliases;