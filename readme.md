# xbmc-listener

A node.js module to listen for Xbmc events (notifications) and do stuff when they happen. The normal Xbmc API methods should also work.

I wrote this so I could trigger home automation events based on what Xbmc is playing: turn on AVR to the Xbmc input when anything is playing, turn on TV to the Xbmc input when video is playing et c.

## Installation

```
npm install xbmc-listener
```

## Usage

### Quick Example
```javascript
var Xbmc = require('xbmc-listener');
var xbmc = new Xbmc({
  host: '192.168.0.123',
  username: 'xbmc',
  password: 'xbmc'
});

xbmc.connect();

xbmc.on('playMusic', function () {
  xbmc.method('visualisation', function () {
    xbmc.notify('switched to visualisation!', 3000, function () {
    });
  });
});
```


## Events

Using the tcp protocol. Must connect() before listening for events.

### connect()
Open connection to the Xbmc machine.

*No arguments*

### end()
Close connection to the Xbmc machine

*No arguments*

### Event listening
Start listening for a notification from the Xbmc machine. The xbmc listener inherits from the node.js EventEmitter. For the EventEmitter methods please read its documentation. For available events, scroll to the section "Event types" further down.

_Example_
```javascript
xbmc.connect();

xbmc.on('play', function (data) {
  console.log('playing');
});

xbmc.on('playEpisode', function (data) {
  console.log('playing episode');
});

xbmc.on('playMusic', function (data) {
  console.log('playing music');
});

xbmc.on('playVideo', function (data) {
  console.log('video is playing');
});

xbmc.on('Player.OnStop', function (data) {
  console.log('stopped');
});
```

## Methods

The regular Xbmc API methods as well as extra shortcut methods. The http protocol is used, not tcp, no need to connect() and end().

http://wiki.xbmc.org/index.php?title=JSON-RPC_API/v6#Methods

### method(method, [params], [callback])
Call one of Xbmc's API methods.

_Arguments_
* method - A string with the name of the Xbmc method or an alias/shortcut method in aliases.js.
* params - Optional params array or object for the method, some Xbmc methods require it.
* callback(error, result) - optional callback function.

_Example_
```javascript

// mute xbmc
xbmc.method('Input.ExecuteAction', ['mute'], function (error, result) {
  if (error) {
    return console.log(error);
  }
  console.log(result);
});

// mute using its shortcut
xbmc.method('mute', function (error, result) {
  if (error) {
    return console.log(error);
  }
  console.log(result);
});

```

### notify(opts, [timeout], [callback])
Send a notification to the Xbmc machine.

_Arguments_
* opts - a string with the message or object with options: { message, title, image, timeout }
* timeout - optional timeout number in ms
* callback(error, result) - optional callback function

_Example_
```javascript
xbmc.notify('Hello', 1500, function (error, result) {
  if (error) {
    return onsole.log(error);
  }
  console.log(result);
});
```


## Event types

### Events from standard Xbmc Notifications
The notifications provided by the Xbmc API should all work. The callback result
is the parsed JSON response from Xbmc.

http://wiki.xbmc.org/index.php?title=JSON-RPC_API/v6#Notifications_2

### Special events
Some extra events has been added. This list might not be complete, please refer to the source code for all events available.

These special events are attempts to get more fine tuned notifications, they may not always be correct, please submit any issues you might find.

The callback result is a sub object from Xbmcs JSON response with details of the item.
```
'play', 'pause', 'stop', 'seek', 'scan', 'sleep', 'exit', 'quit', 'wake'
```
Just aliases for the standard events: play => Player.OnPlay et c.

```
'play*', 'pause*', 'stop*'
```
*= Video, Audio, Music, Movie, Episode, Song, Channel, Tv
E.g., 'playEpisode' is the event when an episode starts playing.

## Shortcut methods

Please review aliases.js for a complete list of shortcut methods.

## Change log

###### 0.1.3

* small fixes

###### 0.1.1

* fix for some method aliases

###### 0.1.0

* npm release
