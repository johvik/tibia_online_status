/**
 * Simple class that stores data in a variable.
 */
function MemoryStorage() {
  this.data = {};
}

MemoryStorage.prototype.get = function(key) {
  return this.data[key];
};

MemoryStorage.prototype.set = function(key, value) {
  this.data[key] = value;
};

exports.MemoryStorage = MemoryStorage;
