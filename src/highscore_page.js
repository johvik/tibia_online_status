function HighscorePage(utils) {
  'use strict';
  this.utils = utils;
  this.elements = {};
}

/**
 * Retrieves and stores information from the highscore.
 */
HighscorePage.prototype.parse = function(callback) {
  'use strict';
  var self = this;
  var highscores_div = document.getElementById('highscores');
  if (highscores_div === null) {
    return callback('Highscores div not found');
  }
  self.elements.highscores_div = highscores_div;

  var selects = highscores_div.getElementsByTagName('select');
  for (var i = 0, j = selects.length; i < j; i++) {
    var element = selects[i];
    var selectedOptions = element.selectedOptions;
    if (selectedOptions && selectedOptions.length == 1) {
      var value = selectedOptions[0].value.trim();
      if (element.name === 'world') {
        self.world = value;
      } else if (element.name === 'list') {
        self.list = value;
      }
    }
  }

  if (!self.world) {
    return callback('No world found');
  }
  if (!self.list) {
    return callback('No list found');
  }

  return callback(null);
};

/**
 * Mark all character links if they are online.
 */
HighscorePage.prototype.update = function(players) {
  'use strict';
  var self = this;
  var online = self.utils.markOnlineLinks(self.elements.highscores_div, players);
  // Set level if found
  if (self.list === 'experience') {
    for (var i = 0, j = online.length; i < j; i++) {
      if (online[i].link.parentElement && online[i].link.parentElement.parentElement) {
        var columns = online[i].link.parentElement.parentElement.getElementsByTagName('td');
        if (columns.length >= 4) {
          self.utils.parseAndSetLevel(columns[3], online[i].player.level);
        }
      }
    }
  }
};

/**
 * Returns an object to print.
 */
HighscorePage.prototype.toString = function() {
  'use strict';
  var self = this;
  return {
    list: self.list,
    world: self.world,
    elements: self.elements
  };
};

exports.HighscorePage = HighscorePage;
