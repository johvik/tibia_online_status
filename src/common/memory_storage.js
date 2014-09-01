/**
 * Simple class that stores data in a variable.
 */
function MemoryStorage() {
  this.data = {};
}

MemoryStorage.prototype.get = function(key, callback) {
  return callback(this.data[key]);
};

MemoryStorage.prototype.set = function(key, value) {
  this.data[key] = value;
};

exports.MemoryStorage = MemoryStorage;
