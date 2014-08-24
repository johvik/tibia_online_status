var utils = new Utils();
var characterPage = new CharacterPage(utils);

characterPage.parse(function(err) {
  if (err) {
    console.log(err);
  } else {
    chrome.runtime.sendMessage({
      query: 'world',
      world: characterPage.world
    }, function(res) {
      if (res.error) {
        console.log(res.error);
      } else {
        characterPage.update(res.players);
      }
    });
  }
});
