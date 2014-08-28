'use strict';
var aliases = require('./aliases.js').event;

var hasProp = function (obj, arr) {
  var prop;
  if (arr.length === 0 || !obj) {
    return false;
  }
  prop = arr.shift();
  if (obj.hasOwnProperty(prop)) {
    if (arr.length === 0) {
      return true;
    }
    return hasProp(obj[prop], arr);
  }
  return false;
};

module.exports = function (obj, callback, debug) {
  var events = [];
  var type;
  var player;
  var event;
  var id;

  if (debug) console.log('determine event: ' + JSON.stringify(obj));

  if (!obj) {
    return callback(events);
  }

  if (obj.hasOwnProperty('method')) {
    event = obj.method;
  }

  if (hasProp(obj, ['params', 'data', 'item', 'type'])) {
    type = obj.params.data.item.type;
  }

  if (hasProp(obj, ['params', 'data', 'player', 'playerid'])) {
    player = obj.params.data.player.playerid;
  }

  if (event) {
    events.push({ event: event, data: obj});
    if (aliases.hasOwnProperty(event)) {
      for (var j = 0; j < aliases[event].length; j++) {
        events.push({ event: aliases[event][j], data: obj });
      }
    }
  }

  if (event === 'GUI.OnScreensaverDeactivated') {
    events.push({ event: 'screensaverOff', data: obj });
  }

  if (event === 'GUI.OnScreensaverActivated') {
    events.push({ event: 'screensaverOn', data: obj });
  }

  if (type === 'picture' && event === 'Playlist.OnAdd') {
    events.push({ event: 'playPicture', data: obj.params.data.item });
    events.push({ event: 'play', data: obj.params.data.item }); // not really
  }

  if (type === 'movie' && obj.params.data.item.id && event === 'Player.OnPlay') {
    events.push({ event: 'playMovie', data: obj.params.data.item });
  }

  if (type === 'movie' && obj.params.data.item.id && event === 'Player.OnPlay') {
    events.push({ event: 'playMovie', data: obj.params.data.item });
  }

  if (type === 'movie' && obj.params.data.item.id && event === 'Player.OnPause') {
    events.push({ event: 'pauseMovie', data: obj.params.data.item });
  }

  if (type === 'movie' && obj.params.data.item.id && event === 'Player.OnStop') {
    events.push({ event: 'stopMovie', data: obj.params.data.item });
  }

  if (type === 'episode' && event === 'Player.OnPlay') {
    events.push({ event: 'playEpisode', data: obj.params.data.item });
  }

  if (type === 'episode' && event === 'Player.OnPause') {
    events.push({ event: 'pauseEpisode', data: obj.params.data.item });
  }

  if (type === 'episode' && event === 'Player.OnStop') {
    events.push({ event: 'stopEpisode', data: obj.params.data.item });
  }

  if (type === 'channel' && event === 'Player.OnPlay') {
    events.push({ event: 'playChannel', data: obj.params.data.item });
    if (obj.params.data.item.channeltype === 'tv') {
      events.push({ event: 'playTv', data: obj.params.data.item });
    }
  }

  if (type === 'channel' && event === 'Player.OnPause') {
    events.push({ event: 'pauseChannel', data: obj.params.data.item });
    if (obj.params.data.item.channeltype === 'tv') {
      events.push({ event: 'pauseTv', data: obj.params.data.item });
    }
  }

  if (type === 'channel' && event === 'Player.OnStop') {
    events.push({ event: 'stopChannel', data: obj.params.data.item });
    if (obj.params.data.item.channeltype === 'tv') {
      events.push({ event: 'stopTv', data: obj.params.data.item });
    }
  }

  if (player === 1 && event === 'Player.OnPlay' && (type === 'movie' || type === 'episode')) {
    events.push({ event: 'playVideo', data: obj.params.data.item });
  }

  if (player === 1 && event === 'Player.OnPause' && (type === 'movie' || type === 'episode')) {
    events.push({ event: 'pauseVideo', data: obj.params.data.item });
  }

  if (player === 1 && event === 'Player.OnStop' && (type === 'movie' || type === 'episode')) {
    events.push({ event: 'stopVideo', data: obj.params.data.item });
  }

  if (((player === 0 || player === -1) || (player === 1 && type === 'song') || (player === 1 && type === 'unknown')) && event === 'Player.OnPlay') {
    events.push({ event: 'playAudio', data: obj.params.data.item });
    events.push({ event: 'playMusic', data: obj.params.data.item });
    if (type === 'song') {
      events.push({ event: 'playSong', data: obj.params.data.item });
    }
  }

  if (((player === 0 || player === -1) || (player === 1 && type === 'song') || (player === 1 && type === 'unknown')) && event === 'Player.OnPause') {
    events.push({ event: 'pauseAudio', data: obj.params.data.item });
    events.push({ event: 'pauseMusic', data: obj.params.data.item });
    if (type === 'song') {
      events.push({ event: 'pauseSong', data: obj.params.data.item });
    }
  }

  if (((player === 0 || player === -1) || (player === 1 && type === 'song') || (player === 1 && type === 'unknown')) && event === 'Player.OnStop') {
    events.push({ event: 'stopAudio', data: obj.params.data.item });
    events.push({ event: 'stopMusic', data: obj.params.data.item });
    if (type === 'song') {
      events.push({ event: 'stopSong', data: obj.params.data.item });
    }
  }

  return callback(events);

};
