if (typeof(window) !== 'undefined') {
  // We are in the browser!

  // Avoid undefined errors when exporting to nodejs
  var exports = {};
  // Hide logs
  console.log = function() {};
}

function Utils() {}

Utils.prototype.to_property_name = function(name) {
  // Hack to come around jQuerys 160 char...
  return name.replace(/\s/g, ' ');
};

/**
 * Replaces html codes in str.
 */
Utils.prototype.decode = function(str) {
  return str.replace(/&#160;/g, ' ');
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
