var utils = new Utils();
var guildPage = new GuildPage(utils);

guildPage.parse(function(err) {
  if (err) {
    console.log('Tibia Online Status:', err);
  } else {
    chrome.runtime.sendMessage({
      query: 'world',
      world: guildPage.world
    }, function(res) {
      if (res.error) {
        console.log('Tibia Online Status:', res.error);
      } else {
        guildPage.update(res.players);
      }
    });
  }
});
