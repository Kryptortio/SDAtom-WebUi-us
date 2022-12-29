# SDAtom-WebUi-us

This is a [user script](https://en.wikipedia.org/wiki/Userscript) that adds a processing queue to the web ui of [AUTOMATIC1111/stable-diffusion-webui](https://github.com/AUTOMATIC1111/stable-diffusion-webui). There is also an option to save one or more sets of settings for quickly loading them again later. 

![alt text](https://github.com/Kryptortio/SDAtom-WebUi-us/blob/main/screenshot.png?raw=true)

# Installation

To install the script I recommend installing an addon where you that let's you add user scripts 

* Tampermonkey [Chrome](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) [Firefox](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
* Greasemonkey [Firefox](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/)
* Violentmonkey [Chrome](https://chrome.google.com/webstore/detail/violentmonkey/jinjaccalgkegednnccohejagnlnfdag) [Firefox](https://addons.mozilla.org/en-US/firefox/addon/violentmonkey/)

After you have installed an extension simply [open the script](https://raw.githubusercontent.com/Kryptortio/SDAtom-WebUi-us/main/SDAtom-WebUi-us.user.js) and you will be asked if you want to install it.

The script assumes you are running the web interface on the url http://127.0.0.1:7860/ if you are using another url you can open the script yourself and just copy or modify the //match row to match the url you are using.

# Usage

* Change the prompt and other settings to your liking
* Click the add to queue button (top right corner), adjust how many times it should run (default is 1)
* Keep adding as many as you like
* Click process queue to start running through the queue. You can keep adding to while it's working but when each item finishes current settings will be replaced with the ones in the queued item.

The interface is added below the normal interface with one floating button in the top right. If you are confused about what any button or field is for hold the mouse over it for a description. Settings and the queue are saved in your browser if you clear browser data it will be removed. The queue can be edited directly while it's being processed (maybe just avoid changing it just as it's finishing an item).

# Limitations

* Only txt2img, img2img and extras are supported
* For img2img/extras loading a new image is not supported
* If the devs updates the interface loading settings will break (but should be easy to fix), currently works fine using main branch Dec 26, 2022 ([4af3ca5393151d61363c30eef4965e694eeac15e](https://github.com/AUTOMATIC1111/stable-diffusion-webui/commit/4af3ca5393151d61363c30eef4965e694eeac15e))
* Settings for "Prompts from file or textbox" is not supported