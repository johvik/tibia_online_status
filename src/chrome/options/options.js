function save_options() {
  'use strict';
  var debugOutput = document.getElementById('debugOutput').checked;
  chrome.storage.sync.set({
    debugOutput: debugOutput
  });
}

function restore_options() {
  'use strict';
  chrome.storage.sync.get({
    debugOutput: false
  }, function(items) {
    document.getElementById('debugOutput').checked = items.debugOutput;
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('debugOutput').addEventListener('click', save_options);
