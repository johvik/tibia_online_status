function CharacterPage(utils) {
  this.utils = utils;
  this.must_be_online = false; // Will be set if online is displayed on the page
  this.elements = {};
}

/**
 * Retrieves and stores information from the character.
 */
CharacterPage.prototype.parse = function(callback) {
  var self = this;
  var characters_div = document.getElementById('characters');
  if (characters_div === null) {
    return callback('Characters div not found');
  }
  self.elements.characters_div = characters_div;

  var character_tables = characters_div.getElementsByTagName('table');
  var parsed_character_information = false;
  var parsed_characters = false;

  for (var i = 0, j = character_tables.length; i < j; i++) {
    if (!parsed_character_information && /Character Information/.test(character_tables[i].innerHTML)) {
      if (!self.parseCharacterInformation(character_tables[i])) {
        return callback('Failed to parse character information. Name:' + self.name + ', Vocation:' + self.vocation + ', Level:' + self.level + ', World:' + self.world);
      }
      parsed_character_information = true;
    } else if (!parsed_characters && /Characters/.test(character_tables[i].innerHTML)) {
      self.parseCharacters(character_tables[i]);
      parsed_characters = true;
    }
  }

  if (!parsed_character_information) {
    return callback('No character information found');
  }
  return callback(null);
};

/**
 * Retrieves and stores information from the character information table.
 * Used internally by #parse.
 * @return False if something isn't found or is bad.
 */
CharacterPage.prototype.parseCharacterInformation = function(table) {
  var self = this;
  var rows = table.getElementsByTagName('tr');

  var name_found = false;
  var vocation_found = false;
  var level_found = false;
  var world_found = false;

  for (var i = 0, j = rows.length; i < j; i++) {
    var columns = rows[i].getElementsByTagName('td');

    if (columns.length >= 2) {
      var row_name = columns[0].innerHTML;
      var row_value = columns[1].textContent.trim();
      if (!name_found && row_name === 'Name:') {
        self.elements.name_column = columns[1];
        self.name = row_value;
        name_found = true;
      } else if (!vocation_found && row_name === 'Vocation:') {
        self.elements.vocation_column = columns[1];
        self.vocation = row_value;
        vocation_found = true;
      } else if (!level_found && row_name === 'Level:') {
        self.elements.level_column = columns[1];
        self.level = parseInt(row_value, 10);
        level_found = true;
      } else if (!world_found && row_name === 'World:') {
        self.world = row_value;
        world_found = true;
      }
    }
  }

  return !isNaN(self.level) && self.utils.isVocation(self.vocation) && name_found && vocation_found && level_found && world_found;
};

/**
 * Checks if character is online by looking at characters (possible if not a hidden character)
 * Used internally by #parse.
 */
CharacterPage.prototype.parseCharacters = function(table) {
  var self = this;
  var rows = table.getElementsByTagName('tr');

  for (var i = 0, j = rows.length; i < j; i++) {
    var columns = rows[i].getElementsByTagName('td');

    if (columns.length >= 4) {
      var row_value = columns[2].textContent.trim();
      if (row_value === 'online') {
        // Remove number
        var row_name = columns[0].textContent.split('.');
        if (row_name.length >= 2) {
          // Replace 160 char...
          var name = row_name[1].replace(/\s/g, ' ').trim();
          self.must_be_online = (name === self.name);
        }
        break; // Only one can be online
      }
    }
  }
};

/**
 * Wrapper to update information and links.
 */
CharacterPage.prototype.update = function(players) {
  var self = this;
  self.updateCharacterInformation(players);
  self.utils.markOnlineLinks(self.elements.characters_div, players);
};

/**
 * Updates the character information.
 * Used internally by #update.
 */
CharacterPage.prototype.updateCharacterInformation = function(players) {
  var self = this;
  var player = players[self.name];
  if (player) {
    // Character is online
    self.elements.name_column.style.color = self.utils.color.green;

    // Set level
    var level_diff = player.level - self.level;
    if (level_diff < 0) {
      // Lost level
      self.elements.level_column.textContent = player.level + ' (' + (level_diff) + ')';
    } else if (level_diff > 0) {
      // Gained level
      self.elements.level_column.textContent = player.level + ' (+' + (level_diff) + ')';
    }

    // Set vocation
    self.elements.vocation_column.textContent = player.vocation;
  } else if (self.must_be_online) {
    // Character is online but not in the list
    self.elements.name_column.style.color = self.utils.color.orange;
  }
};

exports.CharacterPage = CharacterPage;
