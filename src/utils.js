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
 * Make a HTTP request and return the text if status is 200.
 */
Utils.prototype.fetch = function(url, callback) {
  var self = this;
  if (typeof(url) !== 'string') {
    return callback('Url not a String ' + url, {});
  }
  url = url.trim();
  if (url.length <= 0) {
    return callback('Empty url ' + url, {});
  }
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) { // DONE
      if (xhr.status === 200) {
        return callback(null, xhr.responseText);
      }
      return callback('Fetch wrong return status ' + xhr.status, null);
    }
  };
  xhr.send();
};

exports.Utils = Utils;
