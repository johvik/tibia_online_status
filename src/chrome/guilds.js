var utils = new Utils();
var guildPage = new GuildPage(utils);

guildPage.parse(function(err) {
  if (err) {
    console.log(err);
  } else {
    chrome.runtime.sendMessage({
      query: 'world',
      world: guildPage.world
    }, function(res) {
      if (res.error) {
        console.log(res.error);
      } else {
        guildPage.update(res.players);
      }
    });
  }
});
