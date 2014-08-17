function WorldPage(XHR) {
  this.XHR = XHR;
  // key = world gives element = { time: Number, players: Object Array }
  // players key = name gives element = { level: Number, vocation: String }
  this.worlds_cache = {};
  this.cache_time = 60 * 1000; // 1 min
}

WorldPage.prototype.parse = function(data, callback) {
  var rows = $(data).find('.InnerTableContainer table tr.Even, .InnerTableContainer table tr.Odd');
  var res = {};
  rows.each(function() {
    var columns = $(this).find('td');
    var name_column = columns.eq(0);
    var level_column = columns.eq(1);
    var vocation_column = columns.eq(2);

    if (name_column.size() !== 1 || vocation_column.size() !== 1 || level_column.size() !== 1) {
      return callback('Fetch World failed to find columns' +
        ' Name ' + (name_column.size() !== 1) +
        ' Vocation ' + (vocation_column.size() !== 1) +
        ' Level ' + (level_column.size() !== 1), {});
    }

    var name = to_property_name(name_column.text().trim());
    var level = parseInt(level_column.text().trim(), 10);
    var vocation = vocation_column.text().trim();
    var player = {
      level: level,
      vocation: vocation
    };
    res[name] = player;
  });
  return callback(null, res);
};

/**
 * Make the actual HTTP request, for internal use only.
 */
WorldPage.prototype.fetch = function(world_name, callback) {
  var self = this;
  var xhr = new self.XHR();
  xhr.open('GET', 'http://www.tibia.com/community/?subtopic=worlds&world=' + world_name);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) { // DONE
      if (xhr.status === 200) {
        return callback(null, xhr.responseText);
      }
      return callback('Fetch World wrong status ' + xhr.status, null);
    }
  };
  xhr.send();
};

/**
 * Makes a query to update a world.
 *
 * @param world_name Name of the world.
 * @param callback Callback function(err) { ... }
 */
WorldPage.prototype.query = function(world_name, callback) {
  var self = this;
  world_name = (world_name + '').trim();
  if (world_name.length <= 0) {
    return callback('Bad world name ' + world_name, {});
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

    return self.fetch(world_name, function(err, data) {
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
