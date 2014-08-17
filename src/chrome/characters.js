var characterPage = new CharacterPage();

var characterOk = characterPage.parseCharacterInformation();
if (characterOk) {
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
} else {
  console.log('Failed to parse character');
}
