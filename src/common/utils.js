function Utils() {
  this.vocations = ['Druid', 'Elder Druid', 'Elite Knight', 'Knight', 'Master Sorcerer', 'None', 'Paladin', 'Royal Paladin', 'Sorcerer'];
  this.color = {
    green: '#00BF00'
  };
}

/**
 * Replaces html codes in str.
 */
Utils.prototype.decode = function(str) {
  return str.replace(/(&#160;|&nbsp;)/g, ' ');
};

/**
 * Check if str is a valid vocation.
 */
Utils.prototype.isVocation = function(str) {
  var self = this;
  for (var i = 0, j = self.vocations.length; i < j; i++) {
    if (str === self.vocations[i]) {
      return true;
    }
  }
  return false;
};

/**
 * Make a HTTP request and return the text if status is 200.
 */
Utils.prototype.fetch = function(url, callback) {
  if (typeof(url) !== 'string') {
    return callback('Url not a String ' + url, '');
  }
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === xhr.DONE) {
      if (xhr.status === 200) {
        return callback(null, xhr.responseText);
      }
      return callback('Fetch wrong return status ' + xhr.status, '');
    }
  };
  xhr.send();
};

/**
 * Find all links with online characters. Returns an array with { link, player } objects.
 */
Utils.prototype.findOnlineCharacters = function(root_element, players) {
  var links = root_element.getElementsByTagName('a');
  var link_exp = /https:\/\/secure\.tibia\.com\/community\/\?subtopic=characters&name=.+/;
  var online = [];
  for (var i = 0, j = links.length; i < j; i++) {
    if (link_exp.test(links[i].href)) {
      var name = links[i].textContent.replace(/\s/g, ' ');
      var player = players[name];
      if (player) {
        online.push({
          link: links[i],
          player: player
        });
      }
    }
  }
  return online;
};

/**
 * Mark characters links green if online. Returns the result from findOnlineCharacters.
 */
Utils.prototype.markOnlineLinks = function(root_element, players) {
  var self = this;
  var online = self.findOnlineCharacters(root_element, players);
  for (var i = 0, j = online.length; i < j; i++) {
    online[i].link.style.color = self.color.green;
  }
  return online;
};

/**
 * Parses and sets the level if element contains a number.
 */
Utils.prototype.parseAndSetLevel = function(element, new_level) {
  var self = this;
  var level_value = element.textContent.trim();
  var level = parseInt(level_value, 10);
  if (!isNaN(level)) {
    self.setLevel(element, level, new_level);
  }
};

/**
 * Update element with level and difference.
 */
Utils.prototype.setLevel = function(element, old_level, new_level) {
  var level_diff = new_level - old_level;
  if (level_diff < 0) {
    // Lost level
    element.textContent = new_level + ' (' + (level_diff) + ')';
  } else if (level_diff > 0) {
    // Gained level
    element.textContent = new_level + ' (+' + (level_diff) + ')';
  }
};

exports.Utils = Utils;
