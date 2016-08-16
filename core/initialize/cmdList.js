'use strict';
var _ = require('lodash');
var rek = require('rekuire');
var methods = rek('api');

var mongoose = require('mongoose');
var Command = mongoose.model('Command');
var method = function () {
  Command.find().exec().then(function (doc) {
    _.forEach(methods, function (item, key) {
      var description = _.map(item.defaults.description, function (value, childKey) {
        return {
          lang: childKey,
          description: value
        };
      });
      var aliases = _.map(item.defaults.aliases, function (value) {
        if (_.isObject(value)) {
          return {
            alias: value.alias,
            options: value.options
          };
        }
        return {
          alias: value
        };
      });
      aliases.push({
        alias: key
      });
      if (!_.find(doc, function(docItem) {
        return docItem.command === key;
      })) {
        Command.create({
          command: key,
          level: item.defaults.level || 0,
          aliases: aliases,
          description: description
        }, function (err) {
          if (err) console.log(err);
        });
      }
    });
  });
};


console.log('Creating aliases.json');

module.exports = method();
