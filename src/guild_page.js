function GuildPage(utils) {
  'use strict';
  this.utils = utils;
  this.elements = {};
}

/**
 * Retrieves and stores information from the guild.
 */
GuildPage.prototype.parse = function(callback) {
  'use strict';
  var self = this;
  var guilds_div = document.getElementById('guilds');
  if (guilds_div === null) {
    return callback('Guilds div not found');
  }
  self.elements.guilds_div = guilds_div;

  var world_match = guilds_div.textContent.match(/The guild was founded on (.*?) on /);
  if (world_match === null) {
    return callback('No world found');
  }
  self.world = world_match[1].trim();

  return callback(null);
};

/**
 * Mark all character links if they are online.
 */
GuildPage.prototype.update = function(players) {
  'use strict';
  var self = this;
  var online = self.utils.findOnlineCharacters(self.elements.guilds_div, players);
  // Set level if status says online
  for (var i = 0, j = online.length; i < j; i++) {
    if (online[i].link.parentElement && online[i].link.parentElement.parentElement) {
      var columns = online[i].link.parentElement.parentElement.getElementsByTagName('td');
      if (columns.length >= 6) {
        var status_value = columns[5].textContent.trim();
        if (status_value === 'online') {
          self.utils.parseAndSetLevel(columns[3], online[i].player.level);
        }
      }
    }
  }
};

/**
 * Returns an object to print.
 */
GuildPage.prototype.toString = function() {
  'use strict';
  var self = this;
  return {
    world: self.world,
    elements: self.elements
  };
};

exports.GuildPage = GuildPage;
