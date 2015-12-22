'use strict';
var aliases = require('./aliases.js').method;
var determineEvent = require('./determineEvent.js');
var EventEmitter = require('events').EventEmitter;
var net = require('net');
var request = require('request');
var util = require('util');
var Xbmc;

module.exports = Xbmc = function (conf, debug) {
  if (!conf) {
    conf = {};
  }
  if (typeof conf === 'string') {
    conf = { host: conf };
  }
  this.host = conf.host || 'localhost';
  this.httpPort = conf.httpPort || 8080;
  this.methodCallbacks = {};
  this.password = conf.password || 'xbmc';
  this.tcpPort = (conf.port || conf.tcpPort) || 9090;
  this.username = conf.username || 'xbmc';
  this.debug = conf.debug || debug || false;
  this.pingInterval = conf.pingTimeout || 10000;
  this.timer = null;
  EventEmitter.call(this);
};

util.inherits(Xbmc, EventEmitter);

Xbmc.prototype.connect = function () {
  var self = this;
  var stream = '';
  if (this.debug) console.log('debugging xbmc listener');
  this.socket = net.createConnection(this.tcpPort, this.host);
  this.socket.setEncoding('utf8');
  this.socket.on('data', function (chunk) {
    var str = stream += chunk;
    var checkBrackets = ((str.match(/{/g)||[]).length === (str.match(/}/g)||[]).length);
    if (!checkBrackets || !str) return; // not a complete response or no response
    stream = '';
    try {
      str = JSON.parse('[' + str.replace(/}{/g, '},{').replace(/\r/g, ',') + ']'); // split possible multiple responses
    } catch (err) {
      if (self.debug) console.log('json parse error: ' + err);
      return;
    }
    for (var i = 0; i < str.length; i++) {
      if (self.debug) console.log('new events:');
      determineEvent(str[i], function (e) {
        for (var j = 0; j < e.length; j++) {
          self.emit(e[j].event, e[j].data);
          if (self.debug) console.log(e[j].event);
        }
        if (self.debug) console.log('');
      }, self.debug);
    }
  });
  this.socket.on('error', function (error) {
    self.emit('error', error);
  });

  // start ping
  this.ping();
};

Xbmc.prototype.end = function () {
  this.socket.end();
  clearTimeout(this.timer);
};

Xbmc.prototype.ping = function () {
  var ping = { jsonrpc: '2.0', method: 'JSONRPC.Ping' };

  this.socket.write(JSON.stringify(ping), function () {

  });
  this.timer = setTimeout(this.ping.bind(this), this.pingInterval);
}

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
  var n;
  if (typeof msg === 'string') {
    msg = {
      message: msg
    };
  }

  if (typeof timeout === 'function') {
    callback = timeout;
    timeout = false;
  }

  n = {
    message: msg.message,
    title: msg.title || 'Xbmc listener',
    image: msg.image || '',
    displaytime: (timeout || msg.timeout) || 5000
  };

  this.method ('GUI.ShowNotification', n, callback);
};

