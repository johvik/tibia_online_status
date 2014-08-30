var utils = new Utils();
var highscorePage = new HighscorePage(utils);

highscorePage.parse(function(err) {
  if (err) {
    console.log('Tibia Online Status:', err);
  } else {
    chrome.runtime.sendMessage({
      query: 'world',
      world: highscorePage.world
    }, function(res) {
      if (res.error) {
        console.log('Tibia Online Status:', res.error);
      } else {
        highscorePage.update(res.players);
      }
    });
  }
});
