var testRunner = null;

function testDone(status) {
  'use strict';
  console.log('Test ' + status);
  if (testRunner) {
    chrome.tabs.remove(testRunner.tabId);
  }
  testRunner = null;
}

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  'use strict';
  if (changeInfo.status === 'complete' && testRunner && testRunner.waiting === true && testRunner.tabId === tabId) {
    testRunner.waiting = false;
    runNextAction('update');
  }
});

chrome.browserAction.onClicked.addListener(function() {
  'use strict';
  if (testRunner) {
    // Cancel old test
    testDone('canceled');
  }
  // Start a new test
  chrome.tabs.create({
    url: 'https://secure.tibia.com/community/?subtopic=highscores&world=Antica'
  }, function(tab) {
    testRunner = {
      tabId: tab.id,
      next: pickHighscoreCharacters,
      waiting: true,
      characters: []
    };
  });
});

function runNextAction(reason) {
  'use strict';
  setTimeout(function() {
    runNextActionNow();
  }, 500);
}

function runNextActionNow() {
  'use strict';
  // Check online/offline or use next
  if (testRunner.characters.length > 0) {
    var character = testRunner.characters[0];
    if (character.started === true) {
      if (character.online === true) {
        chrome.tabs.executeScript(testRunner.tabId, {
          file: 'spec/character_online.js'
        }, function() {
          chrome.tabs.sendMessage(testRunner.tabId, {
            type: 'execute'
          }, onExecuteCallback);
        });
      } else {
        chrome.tabs.executeScript(testRunner.tabId, {
          file: 'spec/character_offline.js'
        }, function() {
          chrome.tabs.sendMessage(testRunner.tabId, {
            type: 'execute'
          }, onExecuteCallback);
        });
      }
      testRunner.characters.shift();
    } else {
      character.started = true;
      testRunner.waiting = true;
      chrome.tabs.update(testRunner.tabId, {
        url: character.url
      });
    }
  } else if (testRunner.next) {
    testRunner.next = testRunner.next();
  } else {
    testDone('finished');
  }
}

function onExecuteCallback(response) {
  'use strict';
  if (response.success === true) {
    console.log(response.text);
  } else {
    console.error(response.text);
  }
  runNextActionNow('execute');
}

function onCharacterPickCallback(response) {
  'use strict';
  if (response.online) {
    testRunner.characters.push({
      url: response.online,
      online: true,
      started: false
    });
  } else {
    console.warn('No online character');
  }
  if (response.offline) {
    testRunner.characters.push({
      url: response.offline,
      online: false,
      started: false
    });
  } else {
    console.warn('No offline character');
  }
  runNextAction('callback');
}

function pickHighscoreCharacters() {
  'use strict';
  chrome.tabs.sendMessage(testRunner.tabId, {
    type: 'pickCharacters'
  }, onCharacterPickCallback);
  return null;
}
