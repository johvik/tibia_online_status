function WorldPage(utils) {
  this.utils = utils;
  // key = world gives element = { time: Number, players: Object Array }
  // players key = name gives element = { level: Number, vocation: String }
  this.worlds_cache = {};
  this.cache_time = 60 * 1000; // 1 min
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

  var world = self.worlds_cache[world_name];
  var now = new Date().getTime();
  if (!world || (world.time + self.cache_time < now && world.running === false)) {
    // Attempt to avoid double requests
    if (!world) {
      self.worlds_cache[world_name] = {
        time: 0,
        players: {},
        running: true
      };
      world = self.worlds_cache[world_name];
    } else {
      world.running = true;
    }

    return self.utils.fetch('http://www.tibia.com/community/?subtopic=worlds&world=' + world_name, function(err, data) {
      world.running = false;
      if (err) {
        return callback(err, {});
      }
      return self.parse(data, function(err, res) {
        if (err) {
          return callback(err, {});
        }
        world.players = res;
        world.time = new Date().getTime();
        return callback(null, res);
      });
    });
  } else {
    // Up to date
    return callback(null, world.players);
  }
};

exports.WorldPage = WorldPage;
