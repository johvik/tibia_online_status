function HighscorePage(utils) {
  this.utils = utils;
  this.elements = {};
}

/**
 * Retrieves and stores information from the highscore.
 */
HighscorePage.prototype.parse = function(callback) {
  var self = this;
  var highscores_div = document.getElementById('highscores');
  if (highscores_div === null) {
    return callback('Highscores div not found');
  }
  self.elements.highscores_div = highscores_div;

  var world_match = highscores_div.innerHTML.match(/<h2>Ranking for .*? on (.*?)<\/h2>/);
  if (world_match === null) {
    return callback('No world found');
  }
  self.world = world_match[1].trim();

  return callback(null);
};

/**
 * Mark all character links if they are online.
 */
HighscorePage.prototype.update = function(players) {
  var self = this;
  self.utils.markOnlineLinks(self.elements.highscores_div, players);
};

exports.HighscorePage = HighscorePage;
