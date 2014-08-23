var utils = new Utils();
var characterPage = new CharacterPage(utils);

characterPage.parseCharacterInformation(function(err) {
  if (err) {
    console.log(err);
  } else {
    characterPage.parseCharacters();

    chrome.runtime.sendMessage({
      query: 'world',
      world: characterPage.world
    }, function(res) {
      if (res.error) {
        console.log(res.error);
      } else {
        characterPage.updateCharacterInformation(res.players, function(err) {
          if (err) {
            console.log(err);
          } else {
            characterPage.updateCharacterDeaths(res.players);
          }
        });
      }
    });
  }
});
