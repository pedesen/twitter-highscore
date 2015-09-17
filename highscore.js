'use strict';

var Twit = require('twit'),
    sortBy = require('lodash/collection/sortBy'),
    forEach = require('lodash/collection/forEach'),
    _filter = require('lodash/collection/filter'),
    moment = require('moment');

var config = require('./config.json');

var twit = new Twit(config.twitter);

var latestTweet;

function filter(tweet) {
  var re = new RegExp(config.regex);
  var result = re.exec(tweet);
  return result ? { name: result[1], score: result[2] } : null;
}

function removeTable() {
  var table = document.getElementById('highscore');
  if (table) {
    document.getElementById('content').removeChild(table);
  }
}

function createTable(sortedData) {
  var table = document.createElement('TABLE');
  table.id = 'highscore';

  var highscoreData = _filter(sortedData, function(entry) {
    return entry.date > moment(config.from_date) && (entry.date < moment(config.to_date));
  });

  forEach(highscoreData.slice(0, config.num_top), function(entry) {
    var tr = document.createElement('TR');

    var td_score = document.createElement('TD');
    td_score.innerHTML = entry.score;
    td_score.className += 'score';
    tr.appendChild(td_score);

    var td_name = document.createElement('TD');
    td_name.innerHTML = entry.name;
    td_name.className += 'name';
    tr.appendChild(td_name);

    var td_date = document.createElement('TD');

    var d = entry.date.format('MMM Do hh:mm a');

    td_date.innerHTML = d;
    td_date.className += 'date';
    tr.appendChild(td_date);

    table.appendChild(tr);
  });

  document.getElementById('content').appendChild(table);

  var last_update = document.getElementById('last_update');
  last_update.innerHTML = 'last update: '+ moment().format('MMM Do hh:mm:ss a');
}

function updateDOM() {
  getHighscore(config.screen_name, function(err, data) {

    console.log(data.length + ' total tweets filtered');

    var sortedData = sortBy(data, function(element) {
      return -parseInt(element.score, 10);
    });

    removeTable();
    createTable(sortedData);

  });
}

function getHighscore(user, done) {

  var scores = [];
  var num_total_tweets = 0;

  search();

  function search(max_id) {
    var params = {
      screen_name: config.screen_name,
      count: 200,
    };

    if (config.since_id) {
      params.since_id = config.since_id;
    }

    if (max_id) {
      params.max_id = max_id;
    }

    twit.get('statuses/user_timeline', params, onTimeLine);

    function onTimeLine(err, data) {
      if(err) {
        return done(err);
      }

      if(scores.length) {
        data.shift();
      }

      for (var i =0; i < data.length; i++) {

        var score = filter(data[i].text);

        if (score) {
          score.date = moment(data[i].created_at, 'ddd MMM DD HH:mm:ss ZZ YYYY');
          scores.push(score);
        }

        num_total_tweets++;
      }
      console.log(num_total_tweets + ' tweets processed, '+ scores.length+ ' filtered');

      latestTweet = data[data.length-1];

      if (latestTweet) {
        return search(latestTweet.id);
      }

      return done(undefined, scores);
    }
  }
}

updateDOM();

setInterval(function() {
  updateDOM();
}, (config.refresh || 60) * 1000);
