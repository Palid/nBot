var _ = require('lodash'),
	irc = require('irc'),
    google = require('google'),
    cluster = require('cluster'),
	client = require('./config.js'),
	winston = require('winston');

var commandCharacter = ',';

cluster.setupMaster({
  exec : "eval.js",
  args : process.argv.slice(2),
  silent : false
});

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
    },
    google : function(channel, arguments){
        google.resultsPerPage = 2;

        google(arguments, function(err, next, links){
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
            client.say(channel, commandCharacter + property);
        }
    },
    eval : function(channel, evaluation){

        var arr = [];
        arr[0] = channel;
        arr[1] = evaluation;

        client.say(channel, "Trying to evaluate " + evaluation);

        //This will be fired when the forked process becomes online
        cluster.on( "online", function(worker) {

            worker.on( "message", function(msg) {
                clearTimeout(timer); //The worker responded in under 5 seconds, clear the timeout
                worker.destroy(); //Don't leave him hanging 

            });
            var timer = setTimeout( function() {
                worker.destroy(); //Give it 1 second to run, then abort it
                client.say(channel, "Evaluation failed");
            }, 5000);

            worker.send( arr ); //Send the code to run for the worker

            process.on('uncaughtException', function (err) {
              process.send( "finished" ); //Send the finished message to the parent process
            });

        });
        cluster.fork();

        
    }
    // TODO
    // msg : function(nick, arguments){
    //     if (nick.substring(_.indexOf(nick), '#') !== -1){
    //         return client.say()
    //     }
    //     return client.say(nick, arguments);
    // },

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