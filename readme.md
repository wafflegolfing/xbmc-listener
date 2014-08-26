# xbmc-listener.js

A simple node.js module to listen for Xbmc events and do stuff when they happen. The normal Xbmc API methods should also works.

_Known issues_
- In Xbmc 12.2 music notifications are being sent twice from Player.OnPlay, thus the callback function for the related events will execute twice.


## Usage

### Quick Example
```javascript
var Xbmc = require('./index.js');
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

xbmc.on('playAirplay', function (data) {
  console.log('playing airplay');
});

xbmc.on('Player.OnStop', function (data) {
  console.log('stopped');
});
```

## Methods

The regular Xbmc API methods as well as extra shortcut methods. The http protocol is used, not tcp, no need to connect() and end().

### method(method, [params], [callback])
Call one of Xbmc's API methods.

_Arguments_
* method - A string with the name of the Xbmc method or an alias/shortcut method in aliases.js.
* params - Optional params array or object for the method, some Xbmc methods require it.
* callback(error, result) - optional callback function.

_Example_
```javascript
xbmc.method('Player.GetProperties', { playerid: 1, properties: [ 'time' ]}, function (error, result) {
  if (error) {
    console.log(error);
  } else {
    console.log(result);
  }
});
```

### notify(message, [timeout], [callback])
Send a notification.

_Arguments_
* message - a string with the message
* timeout - optional timeout number in ms
* callback(error, result) - optional callback function

_Example_
```javascript
xbmc.notify('hello', 1500, function (error, result) {
  if (error) {
    console.log(error);
  } else {
    console.log(result);
  }
});
```


## Event types

### Events from standard Xbmc Notifications
The notifications provided by the Xbmc API should all work. The callback result
is the parsed JSON response from Xbmc.
```
'Application.OnVolumeChanged'
'AudioLibrary.OnCleanFinished'
'AudioLibrary.OnCleanStarted'
'AudioLibrary.OnRemove'
'AudioLibrary.OnScanFinished'
'AudioLibrary.OnScanStarted'
'AudioLibrary.OnUpdate'
'Input.OnInputFinished'
'Input.OnInputRequested'
'Player.OnPause'
'Player.OnPlay'
'Player.OnPropertyChanged'
'Player.OnSeek'
'Player.OnSpeedChanged'
'Player.OnStop'
'Playlist.OnAdd'
'Playlist.OnClear'
'Playlist.OnRemove'
'System.OnLowBattery'
'System.OnQuit'
'System.OnRestart'
'System.OnSleep'
'System.OnWake'
'VideoLibrary.OnCleanFinished'
'VideoLibrary.OnCleanStarted'
'VideoLibrary.OnRemove'
'VideoLibrary.OnScanFinished'
'VideoLibrary.OnScanStarted'
'VideoLibrary.OnUpdate'
```

### Special events
Some extra events has been added. This list might not be complete, please refer to the source code for all events available.

These special events are attempts to get more fine tuned notifications, they may not always be correct.

The callback result is a sub object from Xbmcs JSON response with details of the item.
```
'play', 'paus', 'stop', 'seek', 'scan', 'sleep', 'exit', 'quit', 'wake'
```
Just aliases for the standard events: play => Player.OnPlay et c.

```
'play*', 'pause*', 'stop*'
```
*= Video, Audio, Music, Movie, Episode, Song, Airplay, AirplayVideo, WebRadio, Channel, Tv
E.g., 'playEpisode' is the event when an episode starts playing.

## Shortcut methods

Please review aliases.js for a complete list of shortcut methods.

## Change log
