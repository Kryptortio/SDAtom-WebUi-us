// ==UserScript==
// @name         SDAtom-WebUi-us
// @namespace    SDAtom-WebUi-us
// @version      0.5.3
// @description  Queue for AUTOMATIC1111 WebUi and an option to saving settings
// @author       Kryptortio
// @homepage     https://github.com/Kryptortio/SDAtom-WebUi-us
// @match        http://127.0.0.1:7860/
// @updateURL    https://raw.githubusercontent.com/Kryptortio/SDAtom-WebUi-us/main/SDAtom-WebUi-us.user.js
// @downloadURL  https://raw.githubusercontent.com/Kryptortio/SDAtom-WebUi-us/main/SDAtom-WebUi-us.user.js
// @grant        none
// ==/UserScript==
(function() {
    'use strict';

    // ----------------------------------------------------------------------------- Config
    window.awqDebug = false;
    function awqLog(p_message) {if(window.awqDebug) console.log('AWQ:'+p_message);}
    awqLog('Start');
    let conf = {
        shadowDOM:{sel:"gradio-app"},
        info: {
            t2iContainer:{sel:"#tab_txt2img"},
            i2iContainer:{sel:"#tab_img2img"},
        },
        t2i: {
            controls:{
                tabButton: {sel:"#component-718 > div.tabs > div button:nth-child(1)"},
                genrateButton: {sel:"#txt2img_generate"},
                skipButton: {sel:"#txt2img_skip"},
            },

            prompt: {sel:"#txt2img_prompt textarea"},
            negPrompt: {sel:"#txt2img_neg_prompt textarea"},

            sample: {sel:"#range_id_0",sel2:"#component-45 input"},
            sampleMethod: {sel:"#txt2img_sampling"},

            width:  {sel:"#range_id_1",sel2:"#component-48 input"},
            height: {sel:"#range_id_2",sel2:"#component-49 input"},

            restoreFace: {sel:"#component-52 input"},
            tiling: {sel:"#component-53 input"},
            highresFix: {sel:"#component-54 input"},
            fpWidth: {sel:"#range_id_3",sel2:"#component-57 input"},
            fpHeight: {sel:"#range_id_4",sel2:"#component-58 input"},
            denoise: {sel:"#range_id_5",sel2:"#component-59 input"},

            extra: {sel:"#subseed_show_box input"},
            varSeed: {sel:"#component-79 input"},
            varStr: {sel:"#range_id_9",sel2:"#component-83 input"},
            varRSFWidth: {sel:"#range_id_10",sel2:"#component-86 input"},
            varRSFHeight: {sel:"#range_id_11",sel2:"#component-87 input"},

            batchCount: {sel:"#range_id_6",sel2:"#component-62 input"},
            batchSize: {sel:"#range_id_7",sel2:"#component-63 input"},

            cfg: {sel:"#range_id_8",se2:"#component-65 input"},

            seed: {sel:"#component-69 input"},
            script: {sel:"#component-89 select"},
        },
        i2i:{
            controls:{
                tabButton: {sel:"#component-718 > div.tabs > div button:nth-child(2)"},
                genrateButton: {sel:"#img2img_generate"},
                skipButton: {sel:"#img2img_skip"},
            },

            prompt: {sel:"#img2img_prompt textarea"},
            negPrompt: {sel:"#img2img_neg_prompt textarea"},

            sample: {sel:"#range_id_15",sel2:"#component-214 input"},
            sampleMethod: {sel:"#component-215"},

            width:  {sel:"#range_id_16",sel2:"#img2img_width input"},
            height: {sel:"#range_id_17",sel2:"#img2img_height input"},

            restoreFace: {sel:"#component-221 input"},
            tiling: {sel:"#component-222 input"},

            extra: {sel:"#subseed_show input"},
            varSeed: {sel:"#component-245 input"},
            varStr: {sel:"#range_id_22",sel2:"#component-249 input"},
            varRSFWidth: {sel:"#range_id_23",sel2:"#component-252 input"},
            varRSFHeight: {sel:"#range_id_24",sel2:"#component-253 input"},

            batchCount: {sel:"#range_id_18",sel2:"#component-225 input"},
            batchSize: {sel:"#range_id_19",sel2:"#component-226 input"},

            cfg: {sel:"#range_id_20",se2:"#component-228 input"},

            seed: {sel:"#component-235 input"},
            script: {sel:"#script_list select"},

        },
        ui:{},
        savedSetting: JSON.parse(localStorage.awqSavedSetting || '{}'),
        currentQueue: JSON.parse(localStorage.awqCurrentQueue || '[]'),
    };
    const c_emptyQueueString = 'Queue is empty';
    const c_processButtonText = 'Process queue';
    const c_innerUIWidth = 'calc(100vw - 20px)';
    const c_uiElemntHeight = '25px';
    const c_uiElemntHeightSmall = '18px';

    // ----------------------------------------------------------------------------- Wait for content to load
    let waitForLoadInterval = setInterval(initAWQ, 500);
    function initAWQ() {
        conf.shadowDOM.root = document.querySelector(conf.shadowDOM.sel).shadowRoot;
        if(!conf.shadowDOM.root || !conf.shadowDOM.root.querySelector('#component-89 select')) return;
        clearInterval(waitForLoadInterval);
        awqLog('Content loaded');

        conf.shadowDOM.root.querySelector('.min-h-screen').style.cssText = 'min-height:unset !important;';

        function mapElementsToConf(p_object) {
            for (let prop in p_object) {
                if(p_object[prop].sel) p_object[prop].el = conf.shadowDOM.root.querySelector(p_object[prop].sel);
                if(p_object[prop].sel2) p_object[prop].el2 = conf.shadowDOM.root.querySelector(p_object[prop].sel2);
            }
        }

        mapElementsToConf(conf.info);
        mapElementsToConf(conf.t2i);
        mapElementsToConf(conf.t2i.controls);
        mapElementsToConf(conf.i2i);
        mapElementsToConf(conf.i2i.controls);

        setInterval(updateStatus, 100);

        generateQueueUI();
    }

    function generateQueueUI() {
        let container = document.createElement('div');
        container.style.width = c_innerUIWidth;
        container.style.border = "1px solid white";
        container.style.position = "relative";
        document.body.appendChild(container);

        let addToQueueButton = document.createElement('button');
        addToQueueButton.innerHTML = 'Add to queue';
        addToQueueButton.style.height = c_uiElemntHeight;
        addToQueueButton.style.position = 'fixed';
        addToQueueButton.style.top = 0;
        addToQueueButton.style.right = 0;
        addToQueueButton.style.opacity = 0.2;
        addToQueueButton.onclick = appendQueueItem;
        addToQueueButton.style.cursor = "pointer";
        addToQueueButton.title = "Add an item to the queue according to current tab and settings";
        container.appendChild(addToQueueButton);

        let defaultQueueQuantity = document.createElement('input');
        defaultQueueQuantity.placeholder = 'Def #';
        defaultQueueQuantity.style.height = c_uiElemntHeightSmall;
        defaultQueueQuantity.style.width = '50px';
        defaultQueueQuantity.style.marginRight = '10px';
        defaultQueueQuantity.type = 'number';
        defaultQueueQuantity.title = "How many items of each will be added to the queue (default is 1)";
        container.appendChild(defaultQueueQuantity);

        let processButton = document.createElement('button');
        processButton.innerHTML = c_processButtonText;
        processButton.style.height = c_uiElemntHeight;
        processButton.style.cursor = "pointer";
        processButton.title = "Start processing the queue, click again to stop";
        processButton.onclick = function() {
            toggleProcessButton();
        }
        conf.ui.processButton = processButton;
        container.appendChild(processButton);

        let clearButton = document.createElement('button');
        clearButton.innerHTML = "Clear";
        clearButton.style.marginLeft = "5px";
        clearButton.style.height = c_uiElemntHeight;
        clearButton.style.cursor = "pointer";
        clearButton.title = "Empty the queue completely";
        clearButton.onclick = function() {queueContainer.innerHTML = c_emptyQueueString; conf.currentQueue = []; updateQueueState(); }
        container.appendChild(clearButton);

        let rememberQueueCheckboxLabel = document.createElement('lable');
        rememberQueueCheckboxLabel.innerHTML = 'Remember queue';
        rememberQueueCheckboxLabel.style.color = "white";
        rememberQueueCheckboxLabel.style.marginLeft = "10px";
        rememberQueueCheckboxLabel.title = "Remember the queue if the page is reloaded (will keep remembering until you remove this again or clear the queue)";
        container.appendChild(rememberQueueCheckboxLabel);
        let rememberQueue = document.createElement('input');
        rememberQueue.type = "checkbox";
        rememberQueue.onclick = updateQueueState;
        rememberQueue.checked = conf.currentQueue.length > 0 ? true : false;
        rememberQueue.style.cursor = "pointer";
        rememberQueue.title = "Remember the queue if the page is reloaded (will keep remembering until you remove this again or clear the queue)";
        container.appendChild(rememberQueue);


        let queueContainer = document.createElement('div');
        queueContainer.style.width = c_innerUIWidth;
        queueContainer.style.border = "1px solid white";
        queueContainer.style.color = "gray";
        queueContainer.style.marginBottom = "5px";
        queueContainer.innerHTML = c_emptyQueueString;
        container.appendChild(queueContainer);

        let clearSettingButton = document.createElement('button');
        clearSettingButton.innerHTML = "❌";
        clearSettingButton.style.height = c_uiElemntHeight;
        clearSettingButton.style.background = 'none';
        clearSettingButton.onclick = function() {clearSetting(); }
        clearSettingButton.style.cursor = "pointer";
        clearSettingButton.title = "Remove the currently selected setting";
        container.appendChild(clearSettingButton);
        let settingsStorage = document.createElement('select');
        settingsStorage.style.height = c_uiElemntHeight;
        settingsStorage.title = "List of stored settings (template of all settings)";
        container.appendChild(settingsStorage);
        let loadSettingButton = document.createElement('button');
        loadSettingButton.innerHTML = "Load";
        loadSettingButton.style.height = c_uiElemntHeight;
        loadSettingButton.onclick = function() {loadSetting(); }
        loadSettingButton.style.cursor = "pointer";
        loadSettingButton.title = "Load the currently selected setting (replacing current settings)";
        container.appendChild(loadSettingButton);
        let settingName =document.createElement('input');
        settingName.placeholder = "Setting name";
        settingName.style.height = c_uiElemntHeightSmall;
        settingName.title = "Name to use when saving a new setting (duplicates not allowed)";
        container.appendChild(settingName);
        let saveSettingButton = document.createElement('button');
        saveSettingButton.innerHTML = "Save";
        saveSettingButton.style.height = c_uiElemntHeight;
        saveSettingButton.onclick = function() {saveSettings(); }
        saveSettingButton.style.cursor = "pointer";
        saveSettingButton.title = "Save currently selected settings so that you can load them again later";
        container.appendChild(saveSettingButton);

        conf.ui.queueContainer = queueContainer;
        conf.ui.clearButton = clearButton;
        conf.ui.loadSettingButton = loadSettingButton;
        conf.ui.settingName = settingName;
        conf.ui.settingsStorage = settingsStorage;
        conf.ui.defaultQueueQuantity = defaultQueueQuantity;
        conf.ui.rememberQueue = rememberQueue;

        refreshSettings();

        if(conf.currentQueue.length > 0) {
            awqLog('Loaded saved queue:'+conf.currentQueue.length);
            for(let i = 0; i < conf.currentQueue.length; i++) {
                appendQueueItem(conf.currentQueue[i].quantity, conf.currentQueue[i].value, conf.currentQueue[i].type);
            }
            updateQueueState();
        }
    }

    function appendQueueItem(p_quantity, p_value, p_type) {
        awqLog('appendQueueItem '+(isNaN(p_quantity) ? 'current' : 'predef-'+p_quantity ));
        let quantity = isNaN(p_quantity) ? (conf.ui.defaultQueueQuantity.value > 0 ? conf.ui.defaultQueueQuantity.value : 1) : p_quantity;

        let queueItem = document.createElement('div');
        queueItem.style.width = c_innerUIWidth;
        let itemType =document.createElement('input');
        itemType.classList = 'AWQ-item-type';
        itemType.style.display = "50px";
        itemType.style.height = c_uiElemntHeightSmall;
        itemType.style.width = "20px";
        itemType.value = p_type || conf.info.activeType;
        itemType.title = "This is the type/tab for the queue item";
        let itemQuantity = document.createElement('input');
        itemQuantity.classList = 'AWQ-item-quantity';
        itemQuantity.value = quantity;
        itemQuantity.style.width = "50px";
        itemQuantity.type = 'number';
        itemQuantity.style.height = c_uiElemntHeightSmall;
        itemQuantity.onchange = updateQueueState;
        itemQuantity.title = "This is how many times this item should be executed";
        let itemJSON =document.createElement('input');
        itemJSON.classList = 'AWQ-item-JSON';
        itemJSON.value = p_value || getValueJSON(p_type);
        itemJSON.style.width = "calc(100vw - 245px)";
        itemJSON.style.height = "18px";
        itemJSON.onchange = updateQueueState;
        itemJSON.title = "This is a JSON string with all the settings to be used for this item. Can be changed while processing the queue but will fail if you enter invalid values.";
        let removeItem =document.createElement('button');
        removeItem.innerHTML = '❌';
        removeItem.style.height = c_uiElemntHeight;
        removeItem.style.background = 'none';
        removeItem.style.cursor = "pointer";
        removeItem.title = "Remove this item from the queue";
        removeItem.onclick = function() {
            this.parentNode.parentNode.removeChild(this.parentNode);
            updateQueueState();
        };
        let moveItemUp =document.createElement('button');
        moveItemUp.innerHTML = '⇧';
        moveItemUp.style.height = c_uiElemntHeight;
        moveItemUp.style.cursor = "pointer";
        moveItemUp.title = "Move this item up in the queue";
        moveItemUp.onclick = function() {
            let tar = this.parentNode;
            if(tar.previousSibling) tar.parentNode.insertBefore(tar, tar.previousSibling);
            updateQueueState();
        };
        let moveItemDown =document.createElement('button');
        moveItemDown.innerHTML = '⇩';
        moveItemDown.style.height = c_uiElemntHeight;
        moveItemDown.style.cursor = "pointer";
        moveItemDown.title = "Move this item down in the queue";
        moveItemDown.onclick = function() {
            let tar = this.parentNode;
            if(tar.nextSibling) tar.parentNode.insertBefore(tar.nextSibling, tar);
            updateQueueState();
        };
        let loadItem =document.createElement('button');
        loadItem.innerHTML = 'Load';
        loadItem.style.height = c_uiElemntHeight;
        loadItem.style.cursor = "pointer";
        loadItem.title = "Load the settings from this item";
        loadItem.onclick = function() {
            let itemRow = this.parentNode;
            switchTabAndWait(itemRow.querySelector('.AWQ-item-type').value, function() {
                loadJson(itemRow.querySelector('.AWQ-item-JSON').value);
            });
        };

        queueItem.appendChild(removeItem);
        queueItem.appendChild(moveItemUp);
        queueItem.appendChild(moveItemDown);
        queueItem.appendChild(itemType);
        queueItem.appendChild(itemQuantity);
        queueItem.appendChild(itemJSON);
        queueItem.appendChild(loadItem);
        if(conf.ui.queueContainer.innerHTML == c_emptyQueueString) conf.ui.queueContainer.innerHTML = "";
        conf.ui.queueContainer.appendChild(queueItem);

        // Wait with updating state while loading a predefined queue
        if(isNaN(p_quantity)) updateQueueState();
    }

    function toggleProcessButton(p_set_processing) {
        awqLog('toggleProcessButton input:' + p_set_processing);
        let pb = conf.ui.processButton;
        let undefinedInput = typeof p_set_processing == 'undefined';

        if(undefinedInput) {
            toggleProcessButton(!conf.info.processing);
        } else if (p_set_processing) {
            conf.info.processing = true;
            pb.style.background = 'green';
            pb.innerHTML = '⏸︎ ';
            let cogElem = document.createElement('div')
            cogElem.innerHTML = '⚙️';
            cogElem.style.display = 'inline-block';
            pb.appendChild(cogElem);

            cogElem.animate([{ transform: 'rotate(0)' },{transform: 'rotate(360deg)'}], {duration: 1000,iterations: Infinity});

            awqLog('Processing activated');
            executeNewTask();
        } else {
            conf.info.processing = false;
            pb.style.background = 'buttonface';
            pb.innerHTML = c_processButtonText;
        }
    }

    function updateQueueState() {
        let queueItems = conf.ui.queueContainer.getElementsByTagName('div');
        awqLog('updateQueueState old length:'+conf.currentQueue.length + ' new length:'+queueItems.length);

        let newArray = [];
        for(let i = 0; i < queueItems.length; i++) {
            let newRowObject = {};
            newRowObject.rowid = i;
            newRowObject.type = queueItems[i].querySelector('.AWQ-item-type').value;
            newRowObject.quantity = queueItems[i].querySelector('.AWQ-item-quantity').value;
            newRowObject.value = queueItems[i].querySelector('.AWQ-item-JSON').value;
            newArray.push(newRowObject);
        }
        conf.currentQueue = newArray;
        if(conf.ui.rememberQueue.checked) {
            awqLog('Saving current queue state:'+conf.currentQueue.length);
            localStorage.awqCurrentQueue = JSON.stringify(conf.currentQueue);
        } else {
            awqLog('Cleared current queue state');
            localStorage.removeItem("awqCurrentQueue");
        }
    }

    function updateStatus() {
        let previousType = conf.info.activeType;
        let previousWorking = conf.info.working;
        let workingOnI2I = conf.i2i.controls.skipButton.el.getAttribute('style') == 'display: block;';
        let workingOnT2I = conf.t2i.controls.skipButton.el.getAttribute('style') == 'display: block;';

		if(conf.info.i2iContainer.el.style.display !== 'none') {
			conf.info.activeType = 'i2i';
		} else if(conf.info.t2iContainer.el.style.display !== 'none') {
			conf.info.activeType = 't2i';
		} else {
			conf.info.activeType = 'other';
		}

        conf.info.working = workingOnI2I || workingOnT2I;

        let typeChanged = conf.info.activeType !== previousType ? true : false;
        let workingChanged = conf.info.working !== previousWorking ? true : false;

        if(typeChanged) awqLog('active type changed to:' + conf.info.activeType);
        if(workingChanged) awqLog('Work status changed to:' + conf.info.working);

        // Time to execute a new taks?
        if(workingChanged) executeNewTask();
    }
    function executeNewTask() {
        awqLog('executeNewTask working='+conf.info.working + ' processing=' + conf.info.processing);
        if(conf.info.working) return; // Already working on task
        if(!conf.info.processing) return; // Not proicessing queue

        let queueItems = conf.ui.queueContainer.getElementsByTagName('div');
        for(let i = 0; i < queueItems.length; i++) {
            let itemQuantity = queueItems[i].querySelector('.AWQ-item-quantity');
            let itemType = queueItems[i].querySelector('.AWQ-item-type').value;
            if(itemQuantity.value > 0) {
                awqLog('Found next work item with index ' + i + ', quantity ' + itemQuantity.value + ' and type ' + itemType);
                loadJson(queueItems[i].querySelector('.AWQ-item-JSON').value);
                switchTabAndWait(itemType, function() {
                    conf[conf.info.activeType].controls.genrateButton.el.click();
                    itemQuantity.value = itemQuantity.value - 1;
                    itemQuantity.onchange();
                });
                return;
            }
        }
        awqLog('executeNewTask - No more tasks found');
        toggleProcessButton(false); // No more tasks to process
    }

    function saveSettings() {
        if(conf.ui.settingName.value.length < 1) {alert('Missing name'); return;}
        if(conf.savedSetting.hasOwnProperty(conf.ui.settingName.value)) {alert('Duplicate name'); return;}
        conf.savedSetting[conf.info.activeType + '-'+ conf.ui.settingName.value] = getValueJSON();

        localStorage.awqSavedSetting = JSON.stringify(conf.savedSetting);

        refreshSettings();
    }
    function refreshSettings() {
        awqLog('refreshSettings saved settings:'+Object.keys(conf.savedSetting).length);
        conf.ui.settingName.value = "";
        conf.ui.settingsStorage.innerHTML = "";

        for (let prop in conf.savedSetting) {
            let newOption = document.createElement('option');
            newOption.innerHTML = prop;
            newOption.value = conf.savedSetting[prop]
            conf.ui.settingsStorage.appendChild(newOption);
        }
        if(Object.keys(conf.savedSetting).length < 1) {
            awqLog('addin blank');
            let blankOption = document.createElement('option');
            blankOption.innerHTML = "Stored settings";
            blankOption.value = "";
            conf.ui.settingsStorage.appendChild(blankOption);
        }
    }
    function loadSetting() {
        if(conf.ui.settingsStorage.value.length < 1) return;
        let itemType = conf.ui.settingsStorage.options[conf.ui.settingsStorage.selectedIndex].text.split('-')[0];
        switchTabAndWait(itemType, function() {
            loadJson(conf.ui.settingsStorage.value);
        });
    }

    function switchTabAndWait(p_type, p_callback) {
        if(p_type == conf.info.activeType) {
            p_callback();
        } else {
            awqLog('switchTabAndWait current tab:' + conf.info.activeType);
            conf.shadowDOM.root.querySelector(conf[p_type].controls.tabButton.sel).click(); // Using .el doesn't work
            let waitForSwitchInterval = setInterval(function() {
                if(conf.info.activeType !== p_type) return;
                clearInterval(waitForSwitchInterval);
                awqLog('switchTabAndWait tab switched to ' + conf.info.activeType);
                p_callback();
            },100);
        }
    }

    function clearSetting() {
        let ss = conf.ui.settingsStorage;
        if(ss.value.length < 1) return;
        delete conf.savedSetting[ss.options[ss.selectedIndex].innerHTML];
        ss.removeChild(ss.options[ss.selectedIndex]);

        localStorage.awqSavedSetting = JSON.stringify(conf.savedSetting);
        if(ss.value.length < 1) refreshSettings();
    }


    function getValueJSON(p_type) {
		let type = p_type || conf.info.activeType;
        awqLog('getValueJSON type=' + type);
        let valueJSON = {type:type};
        for (let prop in conf[type]) {
            if(prop !== 'controls') {
                if(prop == 'sampleMethod') {
                    valueJSON[prop] = conf[type][prop].el.querySelector('input:checked').value;
                } else if(conf[type][prop].el.type == 'checkbox') {
                    valueJSON[prop] = conf[type][prop].el.checked;
                } else  {
                    valueJSON[prop] = conf[type][prop].el.value;
                }
            }
        }
        return JSON.stringify(valueJSON);
    }
    function loadJson(p_json) {
        let inputJSONObject = JSON.parse(p_json);
		let type = inputJSONObject.type ? inputJSONObject.type : conf.info.activeType;
        awqLog('loadJson type=' + type);
        for (let prop in inputJSONObject) {
            if(prop == 'type') continue;
            awqLog('value='+conf[type][prop].el.value+ ' --->'+inputJSONObject[prop]);
            if(prop == 'sampleMethod') {
                conf[type][prop].el.querySelector('[value="' + inputJSONObject[prop] + '"]').checked = true;
            } else if(prop == 'script') {
                conf[type][prop].el.value = inputJSONObject[prop];
                // Trigger event to update subsections
                triggerChange(conf[type][prop].el);
            } else if(conf[type][prop].el.type == 'checkbox') {
                conf[type][prop].el.checked = inputJSONObject[prop];
                if(prop == 'extra') triggerChange(conf[type][prop].el);
            } else {
                conf[type][prop].el.value = inputJSONObject[prop];
            }
            if(conf[type][prop].el2) conf[type][prop].el2.value = inputJSONObject[prop];

        }
    }
    function triggerChange(p_elem) {
        let evt = document.createEvent("HTMLEvents");
        evt.initEvent("change", false, true);
        p_elem.dispatchEvent(evt);
    }
})();