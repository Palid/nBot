"use strict";
var _ = require('lodash'),
	winston = require('winston'),
	irc = require('irc'),
	client = require('config/bot.js'),
	methods = require('./methods.js');

var aliases = {
	//ESPECIALLY FOR KENBO <3
	kkk : function(data, nick, channel){
		return methods.kick("kenbo", "kenbo", channel);
	},
	// kick
	kick : function(data, nick, channel){
	    return methods.kick(data, nick, channel);
	},
	sage : function(data, nick, channel){
	    return methods.kick(data, nick, channel);
	},
	kenbo : function(data, nick, channel){
	    return methods.kick(data, nick, channel);
	},
	wypierdalaj: function(data, nick, channel){
	    return methods.kick(data, nick, channel);
	},
	// topic
	topic : function(topic, from, channel){
		return methods.topic(channel, topic);
	},
	temat : function(topic, from, channel){
	    return methods.topic(channel, topic);
	},
	// say
	say : function(data, nick, channel){
		return methods.say(channel, data);
	},
	mow : function(data, nick, channel){
		return methods.say(channel, data);
	},
	// shout
	shout : function(data, nick, channel){
		return methods.shout(channel, data);
	},
	krzycz : function(data, nick, channel){
		return methods.shout(channel, data);
	},
	// Message
	msg : function(data, nick, channel){
		return methods.msg(channel, data);
	},
	to : function(data, nick, channel){
		return methods.msg(channel, data);
	},
	//google search
	google : function(data, nick, channel){
		return methods.google(channel, data);
	},
	g : function(data, nick, channel){
		return methods.google(channel, data);
	},
	// command list
	alias : function(data, nick, channel){
		return methods.list(channel, this);
	},
	list : function(data, nick, channel){
		return methods.list(channel, methods);
	},
	// Eval for maths
	eval : function(data, nick, channel){
		return methods.evaluate(channel, data);
	},
	maths : function(data, nick, channel){
		return methods.evaluate(channel, data);
	}
	// TODO: 
	// // Dice roll
	// dice: function(data, nick, channel){
	// 	return methods.dice(channel, data);
	// }
};

module.exports = aliases;