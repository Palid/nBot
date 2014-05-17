"use strict";
var path = require('path'),
    config = require('../../config/bot.js'),
    mongoose;


if (config.options.database.type === "tingodb") {
    var Engine = require('tingodb')(),
        db = new Engine.Db('../../database/', {}),
        tungus = require('tungus');
    mongoose = require('mongoose');
    mongoose.connect('tingodb://' + path.resolve(__dirname, '../database'));
} else if (config.options.database.type === "mongodb") {
    mongoose = require('mongoose');
    mongoose.connect(config.options.database.url);
} else {
    throw config.options.database.type + " database type is not supported.";
}


console.log('Running mongoose version %s', mongoose.version);

module.exports = mongoose;

// var user = new Schema({
//     nick: String,
//     preferences: {
//         language: {
//             type: String,
//             default: "en"
//         },
//     },
//     permissions: {
//         group: String,
//         level: Number,
//         api: {
//             command: String,
//             level: Number
//         }
//     },
//     aliases: [{
//         alias: String,
//         addedBy: {
//             type: String,
//             default: config.options.root
//         },
//         date: {
//             type: Date,
//             default: Date.now
//         }
//     }],
//     seen: [{
//         channel: String,
//         date: Date
//     }],
//     memo: [{
//         from: String,
//         message: String,
//         date: {
//             type: Date,
//             default: Date.now
//         }
//     }]
// });

// var User = mongoose.model('User', user);
// var palid = new User({
//     nick: 'palid',
//     aliases: [{
//         alias: 'phoelid'
//     }],
//     seen: [{
//         channel: '#nBot',
//         date: Date.now()
//     }],
//     memo: [{
//         from: 'palid',
//         message: 'testowanie'
//     }]
// });
// // palid.save(function (err, palid) {
// //     if (err) return console.log(err);
// //     console.log(palid);
// // });

// // User.find(function (err, users) {
// //     console.log(users);
// // });

// var link = new Schema({
//     channel: String,
//     count: Number,
//     lastPost: Date,
//     link: String,
//     firstPost: {
//         by: String,
//         date: {
//             type: Date,
//             default: Date.now
//         }
//     }
// });