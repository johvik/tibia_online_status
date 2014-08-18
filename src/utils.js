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

exports.Utils = Utils;
