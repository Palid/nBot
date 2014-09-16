"use strict";

var util = require('util');
var fs = require('fs');
var path = require('path');

var _ = require('lodash');
var moment = require('moment');
var rek = require('rekuire');
var express = require('express');
var mongoose = require('mongoose');
var Drama = mongoose.model('Drama');

var bot = rek('/bot.js');

var app = express();

function loadFile(currentDir, targetDir, encoding) {
    if (!encoding) encoding = "utf-8";
    return fs.readFileSync(path.resolve(currentDir, targetDir), encoding);
}

// var tpl = loadFile(__dirname, './dramaTemplate.html');

app.get('/', function (req, res) {
    Drama.find({}, function (err, doc) {
        if (err) {
            console.log(err);
        } else {
            var tpl = loadFile(__dirname, './dramaTemplate.html');
            var list = _.map(doc, function (item, iterator) {
                if (!item.global) {
                    return util.format("[%s][%s]Added by : %s, on: %s. Drama: %s", iterator, item.channel, item.addedBy, item.addDate, item.dramaString);
                } else {
                    return util.format("[%s][%s]Added by : %s, on: %s. Drama: %s", iterator, "g", item.addedBy, item.addDate, item.dramaString);
                }
            });
            var templated = _.template(tpl, {
                doc: doc,
                moment: moment
            });
            res.send(templated);
        }
    });

});

app.listen(bot.getOption('webserver').port);
