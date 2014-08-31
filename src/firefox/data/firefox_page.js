// Avoid undefined errors when exporting as modules
var exports = {};
// Hide logs?
// console.log = function() {};

function TosPage(page) {
  page.parse(function(err) {
    if (err) {
      console.log('Tibia Online Status:', err);
    } else {
      self.port.once('query:world', function(res) {
        if (res.error) {
          console.log('Tibia Online Status:', res.error);
        } else {
          page.update(res.players);
        }
      });
      self.port.emit('query:world', page.world);
    }
  });
}
