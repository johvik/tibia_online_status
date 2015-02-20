var data = require("sdk/self").data;
var pageMod = require("sdk/page-mod");

var Utils = require('./utils').Utils;
var WorldPage = require('./world_page').WorldPage;

var XMLHttpRequest = require("sdk/net/xhr").XMLHttpRequest;
var worldPage = new WorldPage(new Utils(XMLHttpRequest));

function onPrefChange(prefName) {
  var name = 'extensions.jid1-fvCjY69UDEeqOg@jetpack.sdk.console.logLevel';
  if (require('sdk/simple-prefs').prefs.debugOutput) {
    require('sdk/preferences/service').set(name, 'debug');
  } else {
    require('sdk/preferences/service').reset(name);
  }
}

require('sdk/simple-prefs').on('', onPrefChange);

function onAttach(worker) {
  worker.port.once('query:world', function(world) {
    worldPage.query(world, function(err, res) {
      if (err) {
        return worker.port.emit('query:world', {
          error: err
        });
      }
      return worker.port.emit('query:world', {
        players: res
      });
    });
  });

  worker.port.on('query:options', function() {
    return worker.port.emit('query:options', require('sdk/simple-prefs').prefs);
  });
}

pageMod.PageMod({
  include: ["http://www.tibia.com/community/?subtopic=characters*", "https://secure.tibia.com/community/?subtopic=characters*"],
  contentScriptFile: [data.url("utils.js"), data.url("characters.js")],
  onAttach: onAttach
});

pageMod.PageMod({
  include: ["http://www.tibia.com/community/?subtopic=highscores*", "https://secure.tibia.com/community/?subtopic=highscores*"],
  contentScriptFile: [data.url("utils.js"), data.url("highscores.js")],
  onAttach: onAttach
});
