"use strict";
var _ = require('lodash'),
	irc = require('irc'),
    google = require('google'),
    cluster = require('cluster'),
	client = require('config/bot.js'),
	winston = require('winston');

cluster.setupMaster({
  exec : "eval.js",
  args : process.argv.slice(2),
  silent : false
});

//This will be fired when the forked process becomes online
cluster.on( "online", function(worker) {

    worker.on( "message", function(msg) {
        clearTimeout(timer); //The worker responded in under 5 seconds, clear the timeout
        worker.destroy(); //Don't leave him hanging 
        client.say(msg[0], msg[1]);

    });

    var timer = setTimeout( function() {
        worker.destroy(); //Give it 1 second to run, then abort it
        // client.say(channel, "Evaluation failed");
        console.log("Eval fail");
    }, 1000);

    // worker.send( arr ); //Send the code to run for the worker

});

var methods = {
    topic : function(channel, topic){
        client.say(channel + ' topic changed to ' + topic);
        return client.send("TOPIC", channel, topic);       
    },
	kick : function(data, commandGiver, channel){
        // Goddamn linter
        // It really is okay, dammit.
        if (_.isUndefined(data)) var data = "";

        var firstWhitespace = _.indexOf(data, ' '),
            body = data.substring(firstWhitespace+1),
            nick = data.substring(0, firstWhitespace);

        console.log(nick);

		if (nick === "chomis" || body === "chomis"){

			return client.send("KICK", channel, commandGiver, "Czemu chcesz wykopać chomika? ;_;");
		} else {
			return client.send("KICK", channel, nick, body);
		}
    },
    say : function(channel, data){
        return client.say(channel, data);
    },
    shout : function(channel, data){
        return client.say(channel, data.toUpperCase());
    },
    google : function(channel, data){
        google.resultsPerPage = 2;

        google(data, function(err, next, links){
          if (err) console.error(err);

            var nextCounter = 0,
                length = links.length,
                Arr = [];

          for (var i = 0; i < length; ++i) {
            var title =  links[i].title.substring(0, 125) + "...",
                link = links[i].link,
                description = links[i].description.substring(0, 250) + "...";

                if (_.isString(title)) client.say(channel, title);
                    // Arr.push(title); 
                if (_.isString(link)) client.say(channel, link);
                    // Arr.push(link);
                if (_.isString(description)) client.say(channel, description);
                    // Arr.push(description);
          }

          // if (nextCounter < 2) {
          //   nextCounter += 1;
          //   if (next) next();
          // }

        });
    },
    list : function(channel, object){
        for (property in object){
            client.say(channel, client.commandCharacter + property);
        }
    },
    evaluate : function(channel, evaluation){

        var arr = [],
            worker = cluster.fork();
        arr[0] = channel;
        arr[1] = evaluation;

        client.say(channel, "Trying to evaluate " + evaluation);

        worker.send(arr);
    },
    // TODO
    msg : function(channel, data){
        console.log("MSG START");

        console.log(data.substring(0, 1));

        if (data.substring(0, 1) !== '#'){

        var firstWhitespace = _.indexOf(data, ' '),
            body = data.substring(firstWhitespace+1),
            nick = data.substring(0, firstWhitespace);

        console.log(body);
        console.log(nick);

            return client.say(nick, body);
        }
        return client.say(channel, "Couldn't send text message.");
    },
    dice : function(channel, data){
        // TODO
        return client.say(channel, data);
    }

    // TODO:
    // Create serious aliases system
    // because this thing is a BIG SHIT at the moment.
    // IT REALLY IS SHITTY.
    // REALLY.
    // TODO:
    // ban
};

module.exports = methods;