module.exports = {
    // aliases for xbmc emitted events
  event: {
    // Xbmc event: [array of aliases]
    'Player.OnPlay': ['play'],
    'Player.OnPause': ['pause'],
    'Player.OnStop': ['stop'],
    'AudioLibrary.OnScanFinished': ['scan'],
    'System.OnQuit': ['quit', 'exit'],
    'System.OnSleep': ['sleep'],
    'System.OnWake': ['wake'],
    'Player.OnSeek': ['seek']
  },
  // aliases/shortcuts for xbmc API methods
  method: {
    // alias: Xbmc Method (if array => [method, params])
    left: 'Input.Left',
    right: 'Input.Left',
    up: 'Input.Left',
    down: 'Input.Left',
    select: 'Input.Select',
    info: 'Input.Info',
    home: 'Input.Home',
    action: 'Input.ExecuteAction',
    mute: ['Input.ExecuteAction', ['mute']],
    reloadkeymaps: ['Input.ExecuteAction', ['reloadkeymaps']],
    volumeup: ['Input.ExecuteAction', ['volumeup']],
    volup: ['Input.ExecuteAction', ['volumeup']],
    'vol+': ['Input.ExecuteAction', ['volumeup']],
    volumedown: ['Input.ExecuteAction', ['volumedown']],
    voldown: ['Input.ExecuteAction', ['volumedown']],
    'vol-': ['Input.ExecuteAction', ['volumedown']],
    play: ['Input.ExecuteAction', ['play']],
    playpause: ['Input.ExecuteAction', ['playpause']],
    stop: ['Input.ExecuteAction', ['stop']],
    pause: ['Input.ExecuteAction', ['pause']],
    fullscreen: ['Input.ExecuteAction', ['fullscreen']],
    visualisation: ['GUI.ActivateWindow', ['visualisation']],
    visualization: ['GUI.ActivateWindow', ['visualization']]
  }
};
