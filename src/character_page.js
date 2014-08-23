function CharacterPage(utils) {
  this.utils = utils;
  this.must_be_online = false; // Will be set if online is displayed on the page
}

/**
 * Retrieves and stores information from the character information table.
 * @return False if something is missing.
 */
CharacterPage.prototype.parseCharacterInformation = function(callback) {
  var self = this;
  var characters = document.getElementById('characters');
  if (characters === null) {
    return callback('Characters div not found');
  }
  self.characters = characters;

  var character_information_rows = $('table:contains("Character Information") tr');

  var name_column = character_information_rows.filter(':contains("Name:")').find('td').eq(1);
  var vocation_column = character_information_rows.filter(':contains("Vocation:")').find('td').eq(1);
  var level_column = character_information_rows.filter(':contains("Level:")').find('td').eq(1);
  var world_column = character_information_rows.filter(':contains("World:")').find('td').eq(1);

  if (name_column.size() === 1) {
    self.name_column = name_column.get(0);
    self.name = name_column.text().trim();
  } else {
    return callback('Name not found');
  }

  if (vocation_column.size() === 1) {
    self.vocation_column = vocation_column.get(0);
    self.vocation = vocation_column.text().trim();
  } else {
    return callback('Vocation not found');
  }

  if (level_column.size() === 1) {
    self.level_column = level_column.get(0);
    self.level = parseInt(level_column.text().trim(), 10);
  } else {
    return callback('Level not found');
  }

  if (world_column.size() === 1) {
    self.world = world_column.text().trim();
  } else {
    return callback('World not found');
  }

  return callback(null);
};

/**
 * Checks if character is online by looking at characters (possible if not a hidden character)
 */
CharacterPage.prototype.parseCharacters = function() {
  var self = this;
  var safe_name = self.utils.to_property_name(self.name);
  var characters_rows = $('table:contains("Characters") tr').slice(2).has('nobr'); // Remove header

  characters_rows.each(function() {
    var tmp_name = self.utils.to_property_name(($(this).find('td').eq(0).text().split('.')[1] + '').trim());
    if (tmp_name === safe_name) {
      // Its our character!
      self.must_be_online = $(this).find('td').eq(2).text().trim() === 'online';
      return false;
    }
  });
};

/**
 * Updates the character information
 */
CharacterPage.prototype.updateCharacterInformation = function(players, callback) {
  var self = this;
  var safe_name = self.utils.to_property_name(self.name);
  var player = players[safe_name];
  if (player) {
    // Character is online
    self.name_column.innerHTML = '<span class="green">' + self.name + '</span>';

    // Set level
    var level_diff = player.level - self.level;
    if (level_diff < 0) {
      // Lost level
      self.level_column.innerHTML = player.level + ' (' + (level_diff) + ')';
    } else if (level_diff > 0) {
      // Gained level
      self.level_column.innerHTML = player.level + ' (+' + (level_diff) + ')';
    }

    // Set vocation
    self.vocation_column.innerHTML = player.vocation;
  } else if (self.must_be_online) {
    // Character is online but not in the list
    self.name_column.innerHTML = '<span class="orange">' + self.name + '</span>';
  }

  return callback(null);
};

/**
 * Mark all character links if they are online (includes married, deaths).
 */
CharacterPage.prototype.updateCharacterLinks = function(players) {
  var self = this;
  var links = self.characters.getElementsByTagName('a');
  var link_exp = /http:\/\/www\.tibia\.com\/community\/\?subtopic=characters&name=.+/;
  for (var i = 0, j = links.length; i < j; i++) {
    if (link_exp.test(links[i].href)) {
      var name = self.utils.decode(links[i].innerHTML);
      var player = players[name];
      if (player) {
        links[i].classList.add('green');
      }
    }
  }
};

exports.CharacterPage = CharacterPage;
