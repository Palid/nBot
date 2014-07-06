"use strict";
var _ = require('lodash');
var rek = require('rekuire');
var bot = rek('/bot.js');
var events = bot.events;

var eightBallDictionary = {
    en: [
        "It is certain",
        "It is decidedly so",
        "Without a doubt",
        "It is certain",
        "It is decidedly so",
        "Without a doubt",
        "Yes definitely",
        "You may rely on it",
        "As I see it, yes",
        "Most likely",
        "Outlook good",
        "Yes",
        "Signs point to yes",
        "Reply hazy try again",
        "Ask again later",
        "Better not tell you now",
        "Cannot predict now",
        "Concentrate and ask again",
        "Don't count on it",
        "My reply is no",
        "My sources say no",
        "Outlook not so good",
        "Very doubtful "
    ],
    pl: [
        "Kategoryczne tak!",
        "Według mnie wygląda to dobrze ",
        "Prawdopodobnie ",
        "Zrób to!",
        "Absolutnie nie!",
        "Chyba żartujesz",
        "Oczywiście!",
        "Nie licz na to",
        "Za wczesnie by prorokować",
        "Możesz na to liczyć",
        "Mam wątpliwości",
        "Musisz na to zaczekać",
        "Tak!",
        "Nie teraz",
        "Na to wygląda",
        "Tak - ale we właściwym czasie",
        "Zapomnij o tym",
        "Kto wie",
        "Jest szansa",
        "Według mnie, nie",
    ]
};

var method = function eightBall(options) {
    var len = options.message.trim().length;
    if (len > 0) {
        var messageLang = options.message.split(' ')[0].toLowerCase();
        var lang = _.has(eightBallDictionary, messageLang) ? messageLang : bot.getOption('defaultLang');
        console.log(messageLang);
        console.log(_.has(eightBallDictionary, messageLang));
        events.emit("apiSay", options.to, eightBallDictionary[lang][_.random(0, eightBallDictionary.length)]);
    } else {
        events.emit("apiSay", options.to, "I need a thing to predict future on.");
    }

};

//
var defaults = {
    description: {
        pl: ",8ball [wiadomość] - Bot przewiduje przyszłość dla [wiadomości]",
        en: ",8ball [message] - Bot predicts future for [message]"
    },
    aliases: [],
    level: 0
};


module.exports = {
    method: method,
    defaults: defaults
};