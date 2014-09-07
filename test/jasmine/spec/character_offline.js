describe('Characters', function() {
  it('should be offline', function() {
    var rows = document.getElementsByTagName('tr');
    var name_row = null;
    for (var i = 0, j = rows.length; i < j; i++) {
      var columns = rows[i].getElementsByTagName('td');
      if (columns.length >= 2) {
        if (columns[0].innerHTML === 'Name:') {
          name_row = columns;
          break;
        }
      }
    }

    expect(name_row).not.toBe(null);
    expect(name_row[1].style.color).toBe('');
  });
});
