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

## Prompt filter

Prompt filters can be used to process your prompts before they get added to the queue (textbox after the import/export text box). To add a filter you add a regular expression on the format `[{"desc":"description/name","pattern":"regex pattern","replace":"replacement string/regex","flags":"regex flags"}]` multiple regex can be added within the [] separated by commas. For experimenting with regex, this is a good site https://regex101.com/

Example pattern filters:
* `{"desc":"Remove multiple spaces","pattern":"\\s{2,}","replace":" ","flags":"g"}`
* `{"desc":"Always \", \" (space after , not before)","pattern":"\\s*,\\s*","replace":", ","flags":"g"}`
* `{"desc":"Add the prefix banana to all prompt","pattern":"^","replace":"banana, ","flags":"g"}`
* `{"desc":"Add the postfix banana to all prompt","pattern":"$","replace":", banana","flags":"g"}`

# Troubleshooting

Steps to try to fix issues

* Check that you are running the latest version of [the script](https://raw.githubusercontent.com/Kryptortio/SDAtom-WebUi-us/main/SDAtom-WebUi-us.user.js) and an updated version of [the web ui](https://github.com/AUTOMATIC1111/stable-diffusion-webui/).
	* To update the script [click here](https://raw.githubusercontent.com/Kryptortio/SDAtom-WebUi-us/main/SDAtom-WebUi-us.user.js).
	* To update AUTOMATIC1111 Stable Diffusion web UI you run the command `git pull origin master` in the same folder as webui.bat. Optionall you can note what version you have now first if you want the option to try going back later, to do that the command is `git rev-parse HEAD`
* Check the [Limitations section](https://github.com/Kryptortio/SDAtom-WebUi-us#limitations) to see if your version matches the commit listed there, so that you haven't updated to a new version that is not yet supported. Newer versions of AUTOMATIC1111 might work fine but sometimes they chane something that breaks the script.
	* If you want to try to go to a specific version of AUTOMATIC1111 you can use the command `git checkout ` followed by the id you want to use (e.g. the one listed under [limitations](https://github.com/Kryptortio/SDAtom-WebUi-us#limitations))

Steps to try to find the cause of issues

* Check the for errors in the output console (big white box at the bottom).
* Activate verbose at the bottom reload the page and try again, are you seeing any errors in the optput console now?
* Press F12 then go to the console tab and reload the page, do you see any errors in there?


# Limitations

* Only txt2img, img2img and extras are supported
* For img2img/extras loading a new image is not supported
* If the devs updates the interface loading settings will break (but should be easy to fix), currently works fine using main branch 2023-01-10T16:11:47Z ([50fb20cedc8dcbf64f86aed6d6e89595d655e638](https://github.com/AUTOMATIC1111/stable-diffusion-webui/commit/50fb20cedc8dcbf64f86aed6d6e89595d655e638))
* Settings for "Prompts from file or textbox" is not supported