/**
 * Converts rgb to hex.
 * For example: rgb(0, 255, 0) becomes #00FF00
 *
 * @return The upper case hex or null if not matching rgb format.
 */
exports.rgbToHex = function(rgb) {
  'use strict';
  var match = rgb.match(/rgb\((\d+), (\d+), (\d+)\)/);
  if (match) {
    var res = '';
    for (var i = 1; i <= 3; i++) {
      var tmp = parseInt(match[i], 10).toString(16);
      if (tmp.length === 1) {
        tmp = '0' + tmp;
      }
      res += tmp;
    }
    return '#' + res.toUpperCase();
  }
  return null;
};
