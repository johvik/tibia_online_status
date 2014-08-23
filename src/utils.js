if (typeof(window) !== 'undefined') {
  // We are in the browser!

  // Avoid undefined errors when exporting to nodejs
  var exports = {};
  // Hide logs?
  // console.log = function() {};
}

function Utils() {
  this.vocations = ['Druid', 'Elder Druid', 'Elite Knight', 'Knight', 'Master Sorcerer', 'None', 'Paladin', 'Royal Paladin', 'Sorcerer'];
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
    return callback('Url not a String ' + url, {});
  }
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === xhr.DONE) {
      if (xhr.status === 200) {
        return callback(null, xhr.responseText);
      }
      return callback('Fetch wrong return status ' + xhr.status, null);
    }
  };
  xhr.send();
};

exports.Utils = Utils;
