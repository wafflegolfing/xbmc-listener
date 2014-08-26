//
(function () {
  'use strict';
  var aliases = require('./aliases.js').method;
  var determineEvent = require('./determineEvent.js');
  var EventEmitter = require('events').EventEmitter;
  var net = require('net');
  var request = require('request');
  var util = require("util");
  var Xbmc;

  module.exports = Xbmc = function (conf) {
    this.host = conf.host || 'localhost';
    this.httpPort = conf.httpPort || 8080;
    this.methodCallbacks = {};
    this.password = conf.password || 'xbmc';
    this.socket = new net.Socket();
    this.tcpPort = (conf.port || conf.tcpPort) || 9090;
    this.username = conf.username || 'xbmc';
    EventEmitter.call(this);
  };

  util.inherits(Xbmc, EventEmitter);

  Xbmc.prototype.connect = function () {
    var self = this;
    var stream = '';
    this.socket.setEncoding('utf8');
    this.socket.connect(this.tcpPort, this.host);
    this.socket.on('data', function (chunk) {
      var str = stream += chunk;
      var checkBrackets = ((str.match(/{/g)||[]).length === (str.match(/}/g)||[]).length);
      if (!checkBrackets || !str) return; // not a complete response or no response
      stream = '';
      try {
        str = JSON.parse('[' + str.replace(/}{/g, '},{').replace(/\r/g, ',') + ']'); // split possible multiple responses
      } catch (err) {
        console.log('json parse error: ' + err);
        return;
      }
      for (var i = 0; i < str.length; i++) {
        determineEvent(str[i], function (e) {
          for (var j = 0; j < e.length; j++) {
            self.emit(e[j].method, e[j].data);
          }
        });
      }
    });
    this.socket.on('error', function (error) {
      self.emit('error', error);
    });
  };

  Xbmc.prototype.end = function () {
    this.socket.end();
  };

  Xbmc.prototype.method = function (method, params, callback) {
    var obj = { method: method, params: {}, id: '1', jsonrpc: '2.0' };
    if (typeof params === 'function') {
      callback = params;
    } else if (params) {
      obj.params = params;
    }
    if (aliases.hasOwnProperty(method)) {
      if (Array.isArray(aliases[method])) {
        obj.method = aliases[method][0];
        obj.params = aliases[method][1];
      } else {
        obj.method = aliases[method];
      }
    }
    request({ url: 'http://' + this.username + ':' + this.password + '@' + this.host + ':' + this.httpPort + '/jsonrpc', method: 'POST', body: JSON.stringify(obj) }, function (error, result, body) {
      if (!callback) return;
      if (error) return callback(error);
      if (!body) return callback('no answer');
      body = JSON.parse(body);
      if (body.hasOwnProperty('error')) return callback(body.error);
      return callback(null, (body.result || body));
    });
  };

  Xbmc.prototype.notify = function (msg, timeout, callback) {
    if (typeof timeout === 'function') {
      callback = timeout;
      timeout = 5000;
    } else if (!timeout) {
      timeout = 5000;
    }
    this.method ('GUI.ShowNotification', {
      title: 'Home Automation',
      message: msg,
      displaytime: timeout,
    }, callback);
  };

  Xbmc.prototype.alarm = function (name, msg, timeout, callback) {
    if (typeof timeout === 'function') {
      callback = timeout;
      timeout = 5000;
    } else if (!timeout) {
      timeout = 5000;
    }
    this.method ('GUI.ShowNotification', {
      title: 'Home Automation',
      message: msg,
      displaytime: timeout,
    }, callback);
  };

}());
