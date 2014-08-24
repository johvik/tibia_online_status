function GuildPage(utils) {
  this.utils = utils;
  this.elements = {};
}

/**
 * Retrieves and stores information from the guild.
 */
GuildPage.prototype.parse = function(callback) {
  var self = this;
  var guilds_div = document.getElementById('guilds');
  if (guilds_div === null) {
    return callback('Guilds div not found');
  }
  self.elements.guilds_div = guilds_div;

  var world_match = guilds_div.innerHTML.match(/The guild was founded on (.*?) on /);
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
  var self = this;
  // TODO Move to utils
  var links = self.elements.guilds_div.getElementsByTagName('a');
  var link_exp = /http:\/\/www\.tibia\.com\/community\/\?subtopic=characters&name=.+/;
  for (var i = 0, j = links.length; i < j; i++) {
    if (link_exp.test(links[i].href)) {
      var name = self.utils.decode(links[i].innerHTML);
      var player = players[name];
      if (player) {
        links[i].classList.add('green');
      }
    }
  }
};

exports.GuildPage = GuildPage;
