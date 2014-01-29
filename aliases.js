var _ = require('lodash'),
	winston = require('winston'),
	irc = require('irc'),
	client = require('./config.js'),
	methods = require('./methods.js');

var aliases = {
	//ESPECIALLY FOR KENBO <3
	kkk : function(arguments, nick, channel){
		return methods.kick("kenbo", "kenbo", channel);
	},
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
	//google search
	google : function(arguments, nick, channel){
		return methods.google(channel, arguments);
	},
	g : function(arguments, nick, channel){
		return methods.google(channel, arguments);
	},
	// command list
	alias : function(arguments, nick, channel){
		return methods.list(channel, this);
	},
	list : function(arguments, nick, channel){
		return methods.list(channel, methods);
	}
	// TO FIX:
	// eval : function(arguments, nick, channel){
	// 	return methods.eval(channel, arguments);
	// }

	// TODO
	// msg : function(arguments, nick, channel){
	// 	return methods.msg(channel, nick, arguments);
	// },
};

module.exports = aliases;