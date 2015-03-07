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

  var match = highscores_div.innerHTML.match(/<h2>Ranking for (.*?) on (.*?)<\/h2>/);
  if (match === null) {
    return callback('No world found');
  }
  self.list = match[1].trim();
  self.world = match[2].trim();

  return callback(null);
};

/**
 * Mark all character links if they are online.
 */
HighscorePage.prototype.update = function(players) {
  var self = this;
  var online = self.utils.markOnlineLinks(self.elements.highscores_div, players);
  // Set level if found
  if (self.list === 'Experience') {
    for (var i = 0, j = online.length; i < j; i++) {
      if (online[i].link.parentElement && online[i].link.parentElement.parentElement) {
        var columns = online[i].link.parentElement.parentElement.getElementsByTagName('td');
        if (columns.length >= 4) {
          self.utils.parseAndSetLevel(columns[2], online[i].player.level);
        }
      }
    }
  }
};

/**
 * Returns an object to print.
 */
HighscorePage.prototype.toString = function() {
  var self = this;
  return {
    list: self.list,
    world: self.world,
    elements: self.elements
  };
};

exports.HighscorePage = HighscorePage;
