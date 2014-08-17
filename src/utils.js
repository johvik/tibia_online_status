console.log = function() {};

var exports = {}; // Define exports for the extension (to be able to export for tests)

function Utils() {}

Utils.prototype.to_property_name = function(name) {
  // Hack to come around jQuerys 160 char...
  return name.replace(/\s/g, ' ');
};
