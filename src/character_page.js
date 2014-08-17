function CharacterPage(utils) {
  this.utils = utils;
  this.name_column = null;
  this.vocation_column = null;
  this.level_column = null;
  this.world_column = null;
  this.married_column = null;
  this.must_be_online = false; // Will be set if online is displayed on the page

  // These fields will be set if the columns are valid.
  this.name = null;
  this.vocation = null;
  this.level = null;
  this.world = null;
  this.married = null;
}

/**
 * Retrieves and stores information from the character information table.
 * @return False if something is missing.
 */
CharacterPage.prototype.parseCharacterInformation = function() {
  var self = this;
  var character_information_rows = $('table:contains("Character Information") tr');

  var name_column = character_information_rows.filter(':contains("Name:")').find('td').eq(1);
  var vocation_column = character_information_rows.filter(':contains("Vocation:")').find('td').eq(1);
  var level_column = character_information_rows.filter(':contains("Level:")').find('td').eq(1);
  var world_column = character_information_rows.filter(':contains("World:")').find('td').eq(1);
  var married_column = character_information_rows.filter(':contains("Married to:")').find('td').eq(1);

  if (name_column.size() === 1) {
    self.name_column = name_column;
    self.name = name_column.text().trim();
  } else {
    console.log('Name not found');
  }

  if (vocation_column.size() === 1) {
    self.vocation_column = vocation_column;
    self.vocation = vocation_column.text().trim();
  } else {
    console.log('Vocation not found');
  }

  if (level_column.size() === 1) {
    self.level_column = level_column;
    self.level = parseInt(level_column.text().trim(), 10);
  } else {
    console.log('Level not found');
  }

  if (world_column.size() === 1) {
    self.world_column = world_column;
    self.world = world_column.text().trim();
  } else {
    console.log('World not found');
  }

  if (married_column.size() === 1) {
    self.married_column = married_column;
    self.married = married_column.text().trim();
  } else {
    console.log('Married not found');
  }

  // Check required columns
  return self.name_column !== null && self.vocation_column !== null && self.level_column !== null && self.world_column !== null;
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
    self.name_column.html('<span class="green">' + self.name + '</span>');

    // Set level
    var level_diff = player.level - self.level;
    if (level_diff < 0) {
      // Lost level
      self.level_column.html(player.level + ' (' + (level_diff) + ')');
    } else if (level_diff > 0) {
      // Gained level
      self.level_column.html(player.level + ' (+' + (level_diff) + ')');
    }

    // Set vocation
    self.vocation_column.text(player.vocation);
  } else if (self.must_be_online) {
    // Character is online but not in the list
    self.name_column.html('<span class="orange">' + self.name + '</span>');
  }

  if (self.married_column) {
    var married_safe_name = self.utils.to_property_name(self.married);
    var married_player = players[married_safe_name];
    if (married_player) {
      // Married character is online
      self.married_column.find('a').addClass('green');
    }
  }
  return callback(null);
};

/**
 * Mark all killers if they are online
 */
CharacterPage.prototype.updateCharacterDeaths = function(players) {
  var character_deaths_rows = $('table:contains("Character Deaths") tr').slice(1);
  if (character_deaths_rows.size() > 0) {
    character_deaths_rows.each(function() {
      $(this).find('td a').each(function() {
        var tmp_name = self.utils.to_property_name($(this).text());
        var killer = players[tmp_name];
        if (killer) {
          // Killer character is online
          $(this).addClass('green');
        }
      });
    });
  }
};

exports.CharacterPage = CharacterPage;
