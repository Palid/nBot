'use strict';

function getMarkovChains(titles) {
  var terminals = {};
  var startwords = [];
  var wordstats = {};

  for (var i = 0; i < titles.length; i++) {
      var words = titles[i].split(' ');
      terminals[words[words.length - 1]] = true;
      startwords.push(words[0]);
      for (var j = 0; j < words.length - 1; j++) {
          if (wordstats.hasOwnProperty(words[j])) {
              wordstats[words[j]].push(words[j + 1]);
          } else {
              wordstats[words[j]] = [words[j + 1]];
          }
      }
  }

  var getWord = function (a) {
      var i = Math.floor(a.length * Math.random());
      return a[i];
  };

  return function makeTitle(min_length) {
      var word = getWord(startwords);
      var title = [word];
      while (wordstats.hasOwnProperty(word)) {
          var next_words = wordstats[word];
          word = getWord(next_words);
          title.push(word);
          if (title.length > min_length && terminals.hasOwnProperty(word)) break;
      }
      if (title.length < min_length) return makeTitle(min_length);
      return title.join(' ');
  };

};

module.exports = getMarkovChains;
