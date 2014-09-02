var data = require("sdk/self").data;
var pageMod = require("sdk/page-mod");

var Utils = require('./utils').Utils;
var WorldPage = require('./world_page').WorldPage;

var XMLHttpRequest = require("sdk/net/xhr").XMLHttpRequest;
var worldPage = new WorldPage(new Utils(XMLHttpRequest));

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
}

pageMod.PageMod({
  include: "http://www.tibia.com/community/?subtopic=characters*",
  contentScriptFile: [data.url("firefox_page.js"), data.url("utils.js"), data.url("character_page.js"), data.url("characters.js")],
  onAttach: onAttach
});

pageMod.PageMod({
  include: "http://www.tibia.com/community/?subtopic=guilds*",
  contentScriptFile: [data.url("firefox_page.js"), data.url("utils.js"), data.url("guild_page.js"), data.url("guilds.js")],
  onAttach: onAttach
});

pageMod.PageMod({
  include: "http://www.tibia.com/community/?subtopic=highscores*",
  contentScriptFile: [data.url("firefox_page.js"), data.url("utils.js"), data.url("highscore_page.js"), data.url("highscores.js")],
  onAttach: onAttach
});
