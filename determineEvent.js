(function () {
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

  module.exports = function (obj, callback) {
    console.log(JSON.stringify(obj));
    var skipMethods = [
      //'Playlist.OnAdd'
    ];
    var happened = [];
    var type;
    var player;
    var method;
    var id;

    if (!obj) {
      return callback(happened);
    }

    if (obj.hasOwnProperty('method')) {
      method = obj.method;
    }

    if (hasProp(obj, ['params', 'data', 'item', 'type'])) {
      type = obj.params.data.item.type;
    }

    if (hasProp(obj, ['params', 'data', 'player', 'playerid'])) {
      player = obj.params.data.player.playerid;
    }

    if (method) {
      if (skipMethods.indexOf(method) !== -1) {
      return callback(happened);
      }

      happened.push({ method: method, data: obj});
      if (aliases.hasOwnProperty(method)) {
        for (var j = 0; j < aliases[method].length; j++) {
          happened.push({ method: aliases[method][j], data: obj });
        }
      }
    }

    if (method === 'GUI.OnScreensaverDeactivated') {
      happened.push({ method: 'screensaverOff', data: obj });
    }

    if (method === 'GUI.OnScreensaverActivated') {
      happened.push({ method: 'screensaverOn', data: obj });
    }

    if (type === 'picture' && method === 'Playlist.OnAdd') {
      happened.push({ method: 'playPicture', data: obj.params.data.item });
      happened.push({ method: 'play', data: obj.params.data.item }); // not really
    }

    if (type === 'movie' && obj.params.data.item.id && method === 'Player.OnPlay') {
      happened.push({ method: 'playMovie', data: obj.params.data.item });
    }

    if (type === 'movie' && obj.params.data.item.id && method === 'Player.OnPlay') {
      happened.push({ method: 'playMovie', data: obj.params.data.item });
    }

    if (type === 'movie' && obj.params.data.item.id && method === 'Player.OnPause') {
      happened.push({ method: 'pauseMovie', data: obj.params.data.item });
    }

    if (type === 'movie' && obj.params.data.item.id && method === 'Player.OnStop') {
      happened.push({ method: 'stopMovie', data: obj.params.data.item });
    }

    if (type === 'episode' && method === 'Player.OnPlay') {
      happened.push({ method: 'playEpisode', data: obj.params.data.item });
    }

    if (type === 'episode' && method === 'Player.OnPause') {
      happened.push({ method: 'pauseEpisode', data: obj.params.data.item });
    }

    if (type === 'episode' && method === 'Player.OnStop') {
      happened.push({ method: 'stopEpisode', data: obj.params.data.item });
    }

    if (type === 'channel' && method === 'Player.OnPlay') {
      happened.push({ method: 'playChannel', data: obj.params.data.item });
      if (obj.params.data.item.channeltype === 'tv') {
        happened.push({ method: 'playTv', data: obj.params.data.item });
      }
    }

    if (type === 'channel' && method === 'Player.OnPause') {
      happened.push({ method: 'pauseChannel', data: obj.params.data.item });
      if (obj.params.data.item.channeltype === 'tv') {
        happened.push({ method: 'pauseTv', data: obj.params.data.item });
      }
    }

    if (type === 'channel' && method === 'Player.OnStop') {
      happened.push({ method: 'stopChannel', data: obj.params.data.item });
      if (obj.params.data.item.channeltype === 'tv') {
        happened.push({ method: 'stopTv', data: obj.params.data.item });
      }
    }

    if ((type === 'movie' || type === 'episode') && player === 1 && method === 'Player.OnPlay') {
      happened.push({ method: 'playAirplay', data: obj.params.data.item });
      happened.push({ method: 'playAirplayVideo', data: obj.params.data.item });
    }

    if ((type === 'movie' || type === 'episode') && player === 1 && method === 'Player.OnPause') {
      happened.push({ method: 'pauseAirplay', data: obj.params.data.item });
      happened.push({ method: 'pauseAirplayVideo', data: obj.params.data.item });
    }

    if ((type === 'movie' || type === 'episode') && player === 1 && method === 'Player.OnStop') {
      happened.push({ method: 'stopAirplay', data: obj.params.data.item });
      happened.push({ method: 'stopAirplayVideo', data: obj.params.data.item });
    }

    if (player === 1 && method === 'Player.OnPlay' && (type === 'movie' || type === 'episode')) {
      happened.push({ method: 'playVideo', data: obj.params.data.item });
    }

    if (player === 1 && method === 'Player.OnPause' && (type === 'movie' || type === 'episode')) {
      happened.push({ method: 'pauseVideo', data: obj.params.data.item });
    }

    if (player === 1 && method === 'Player.OnStop' && (type === 'movie' || type === 'episode')) {
      happened.push({ method: 'stopVideo', data: obj.params.data.item });
    }

    if (((player === 0 || player === -1) || (player === 1 && type === 'song') || (player === 1 && type === 'unknown')) && method === 'Player.OnPlay') {
      happened.push({ method: 'playAudio', data: obj.params.data.item });
      happened.push({ method: 'playMusic', data: obj.params.data.item });
      if (type === 'song') {
        happened.push({ method: 'playSong', data: obj.params.data.item });
      }
      if (type === 'unknown') {
        happened.push({ method: 'playWebRadio', data: obj.params.data.item });
      }
      if (player === -1 || (player === 1 && type === 'song')) {
        happened.push({ method: 'playAirplay', data: obj.params.data.item });
        happened.push({ method: 'playAirplayAudio', data: obj.params.data.item });
      }
    }

    if (((player === 0 || player === -1) || (player === 1 && type === 'song') || (player === 1 && type === 'unknown')) && method === 'Player.OnPause') {
      happened.push({ method: 'pauseAudio', data: obj.params.data.item });
      happened.push({ method: 'pauseMusic', data: obj.params.data.item });
      if (type === 'song') {
        happened.push({ method: 'pauseSong', data: obj.params.data.item });
      }
      if (type === 'unknown') {
        happened.push({ method: 'pauseWebRadio', data: obj.params.data.item });
      }
      if (player === -1 || (player === 1 && type === 'song')) {
        happened.push({ method: 'pauseAirplay', data: obj.params.data.item });
        happened.push({ method: 'pauseAirplayAudio', data: obj.params.data.item });
      }
    }

    if (((player === 0 || player === -1) || (player === 1 && type === 'song') || (player === 1 && type === 'unknown')) && method === 'Player.OnStop') {
      happened.push({ method: 'stopAudio', data: obj.params.data.item });
      happened.push({ method: 'stopMusic', data: obj.params.data.item });
      if (type === 'song') {
        happened.push({ method: 'stopSong', data: obj.params.data.item });
      }
      if (type === 'unknown') {
        happened.push({ method: 'stopWebRadio', data: obj.params.data.item });
      }
      if (player === -1 || (player === 1 && type === 'song')) {
        happened.push({ method: 'stopAirplay', data: obj.params.data.item });
        happened.push({ method: 'stopAirplayAudio', data: obj.params.data.item });
      }
    }

    return callback(happened);

  };

}());