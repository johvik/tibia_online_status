Tibia Online Status
===================
[![Build Status](https://travis-ci.org/johvik/tibia_online_status.svg)](https://travis-ci.org/johvik/tibia_online_status)
[![Dependency Status](https://gemnasium.com/johvik/tibia_online_status.svg)](https://gemnasium.com/johvik/tibia_online_status)
[![Coverage Status](https://img.shields.io/coveralls/johvik/tibia_online_status.svg)](https://coveralls.io/r/johvik/tibia_online_status)

This extension includes information from the "Players Online" into the characters and highscores page.
With Tibia Online Status you won't have to look at the "Players Online" page to see if your friend has leveled up or if your enemies are online!

## Features
* Characters page is extended with players online status, level change and vocation change.
* Highscores page is extended with players online status and level change.

_Note that the information provided is only as accurate as the information on the "Players Online" page. For example if a player recently logged in it might not be displayed as online just yet._

## Download
* [Google Chrome](https://chrome.google.com/webstore/detail/tibia-online-status/mlpikpafkalaelbchmohpffpbkpoiaaf)
* [Mozilla Firefox](https://addons.mozilla.org/en-US/firefox/addon/tibia-online-status/)

## Contribute
To build run `npm install` followed by `grunt`.
The chrome extension will be packed in `dest/chrome.zip`.
For the firefox addon run `grunt shell:xpi` and look inside `dest/firefox`.

To execute end-to-end tests for chrome load the extension from `test/jasmin/` (requires that the main extension is loaded first). Then click on the jasmine icon in the browser to start the test.

## License
[MIT License](https://github.com/johvik/tibia_online_status/blob/master/LICENSE)
