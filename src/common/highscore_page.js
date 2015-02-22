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
  self.utils.markOnlineLinks(self.elements.highscores_div, players, function(link_element, player) {
    // Set level if found
    if (self.list === 'Experience') {
      if (link_element.parentElement && link_element.parentElement.parentElement) {
        var columns = link_element.parentElement.parentElement.getElementsByTagName('td');
        if (columns.length >= 4) {
          var row_value = columns[2].textContent.trim();
          var level = parseInt(row_value, 10);
          if (!isNaN(level)) {
            self.utils.setLevel(columns[2], level, player.level);
          }
        }
      }
    }
  });
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
