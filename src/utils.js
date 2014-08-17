console.log = function() {};

function to_property_name(name) {
  // Hack to come around jQuerys 160 char...
  return name.replace(/\s/g, ' ');
}

var exports = {}; // Define exports for the extension (to be able to export for tests)
