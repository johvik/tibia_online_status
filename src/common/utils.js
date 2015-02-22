function Utils(XHR) {
  this.vocations = ['Druid', 'Elder Druid', 'Elite Knight', 'Knight', 'Master Sorcerer', 'None', 'Paladin', 'Royal Paladin', 'Sorcerer'];
  this.XHR = XHR;
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
  var self = this;
  if (typeof(url) !== 'string') {
    return callback('Url not a String ' + url, '');
  }
  var xhr = new self.XHR();
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
 * Mark characters links green if online. Optional callback(link_element, player) for each online player.
 */
Utils.prototype.markOnlineLinks = function(root_element, players, callback) {
  var self = this;
  var links = root_element.getElementsByTagName('a');
  var link_exp = /https:\/\/secure\.tibia\.com\/community\/\?subtopic=characters&name=.+/;
  for (var i = 0, j = links.length; i < j; i++) {
    if (link_exp.test(links[i].href)) {
      var name = self.decode(links[i].innerHTML);
      var player = players[name];
      if (player) {
        if (callback) {
          callback(links[i], player);
        }
        links[i].style.color = self.color.green;
      }
    }
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
