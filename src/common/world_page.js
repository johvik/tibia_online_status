/**
 * @param utils
 * @param storage Storage object must implement: get(key, callback(value)) and set(key, value).
 */
function WorldPage(utils, storage) {
  this.utils = utils;
  this.storage = storage;
  // key = world gives element = { time: Number, players: Object Array }
  // players key = name gives element = { level: Number, vocation: String }
  this.cache_time = 60 * 1000; // 1 min
  // Note: In case of event pages in chrome the cache time will be as low as 15 seconds if it becomes inactive.
}

/**
 * Parses the world page, for internal use only.
 */
WorldPage.prototype.parse = function(data, callback) {
  var self = this;
  if (typeof(data) !== 'string') {
    return callback('Data not a String ' + data, {});
  }
  var res = {};
  var row_exp = /href=\"http:\/\/www\.tibia\.com\/community\/\?subtopic=characters&name=.+?>(.+?)<\/a><\/td><td.*?>(\d+?)<\/td><td.*?>(.+?)<\/td>/g;
  var row;
  while ((row = row_exp.exec(data)) !== null) {
    var name = self.utils.decode(row[1]).trim();
    var level = parseInt(row[2], 10);
    var vocation = self.utils.decode(row[3]).trim();

    if (self.utils.isVocation(vocation) !== true) {
      return callback('Suspicious row match, name: ' + name + ' level: ' + level + ' vocation: ' + vocation + ' row: ' + row, {});
    }
    var player = {
      level: level,
      vocation: vocation
    };
    res[name] = player;
  }
  return callback(null, res);
};

/**
 * Makes a query to update a world.
 *
 * @param world_name Name of the world.
 * @param callback Callback function(err) { ... }
 */
WorldPage.prototype.query = function(world_name, callback) {
  var self = this;
  if (typeof(world_name) !== 'string') {
    return callback('World name not a String ' + world_name, {});
  }
  world_name = world_name.trim();
  if (world_name.length <= 0) {
    return callback('Empty world name ' + world_name, {});
  }

  self.storage.get(world_name, function(world) {
    var now = new Date().getTime();
    if (!world || (world.time + self.cache_time <= now)) {
      return self.utils.fetch('http://www.tibia.com/community/?subtopic=worlds&world=' + world_name, function(err, data) {
        if (err) {
          return callback(err, {});
        }
        return self.parse(data, function(err, res) {
          if (err) {
            return callback(err, {});
          }
          self.storage.set(world_name, {
            players: res,
            time: new Date().getTime()
          });
          return callback(null, res);
        });
      });
    } else {
      // Up to date
      return callback(null, world.players);
    }
  });
};

exports.WorldPage = WorldPage;
