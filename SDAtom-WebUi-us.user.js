// ==UserScript==
// @name         SDAtom-WebUi-us
// @namespace    SDAtom-WebUi-us
// @version      0.7.8
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

            scriptPromptMatrixPutVar: {sel:"#component-92 input"},
            scriptPromptMatrixUseDiff: {sel:"#component-93 input"},

            scriptXYXtype:{sel:"#component-101 #x_type select"},
            scriptXYYtype:{sel:"#component-101 #y_type select"},
            scriptXYXVals:{sel:"#component-104 textarea"},
            scriptXYYVals:{sel:"#component-108 textarea"},
            scriptXYDrawLeg:{sel:"#component-110 input"},
            scriptXYIncludeSep:{sel:"#component-111 input"},
            scriptXYKeepMOne:{sel:"#component-112 input"},
        },
        i2i:{
            controls:{
                tabButton: {sel:"#component-718 > div.tabs > div button:nth-child(2)"},
                genrateButton: {sel:"#img2img_generate"},
                skipButton: {sel:"#img2img_skip"},
            },

            prompt: {sel:"#img2img_prompt textarea"},
            negPrompt: {sel:"#img2img_neg_prompt textarea"},

            resizeMode: {sel:"#resize_mode"},

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

            denoise: {sel:"#range_id_21",se2:"#component-230 input"},

            seed: {sel:"#component-235 input"},
            script: {sel:"#tab_img2img #script_list select"},

            scriptPromptMatrixPutVar: {sel:"#component-288 input"},
            scriptPromptMatrixUseDiff: {sel:"#component-290 input"},

            scriptXYXtype:{sel:"#component-304 #x_type select"},
            scriptXYYtype:{sel:"#component-304 #y_type select"},
            scriptXYXVals:{sel:"#component-307 textarea"},
            scriptXYYVals:{sel:"#component-311 textarea"},
            scriptXYDrawLeg:{sel:"#component-313 input"},
            scriptXYIncludeSep:{sel:"#component-314 input"},
            scriptXYKeepMOne:{sel:"#component-315 input"},

            scripti2iAltTestOverrideSampM:{sel:"#component-259 input"},
            scripti2iAltTestOverrideProm:{sel:"#component-260 input"},
            scripti2iAltTestOrigProm:{sel:"#component-261 textarea"},
            scripti2iAltTestOrigNProm:{sel:"#component-262 textarea"},
            scripti2iAltTestOverrideSampS:{sel:"#component-263 input"},
            scripti2iAltTestDecStep:{sel:"#component-264",sel2:"#range_id_25"},
            scripti2iAltTestOverrideDenoi:{sel:"#component-265 input"},
            scripti2iAltTestDecCFG:{sel:"#component-266",sel2:"#range_id_26"},
            scripti2iAltTestRand:{sel:"#component-267",sel2:"#range_id_27"},
            scripti2iAltTestSigma:{sel:"#component-268 input"},

            scriptLoopbackLoops:{sel:"#component-271 input",sel2:"#range_id_28"},
            scriptLoopbackDenoSCF:{sel:"#component-272 input",sel2:"#range_id_29"},

            scriptOutPMK2Pixels:{sel:"#component-276",sel2:"#range_id_30"},
            scriptOutPMK2MaskBlur:{sel:"#component-277",sel2:"#range_id_31"},
            scriptOutPMK2Left:{sel:"#component-278 label:nth-child(1) input"},
            scriptOutPMK2Right:{sel:"#component-278 label:nth-child(2) input"},
            scriptOutPMK2Up:{sel:"#component-278 label:nth-child(3) input"},
            scriptOutPMK2Down:{sel:"#component-278 label:nth-child(4) input"},
            scriptOutPMK2FallOff:{sel:"#component-279",sel2:"#range_id_32"},
            scriptOutPMK2Pixels:{sel:"#component-280",sel2:"#range_id_33"},

            scriptPoorManPixels:{sel:"#component-283 input",sel2:"#range_id_34"},
            scriptPoorManMaskBlur:{sel:"#component-284 input",sel2:"#range_id_35"},
            scriptPoorManMaskCont:{sel:"#component-285"},
            scriptPoorManLeft:{sel:"#component-286 label:nth-child(1) input"},
            scriptPoorManRight:{sel:"#component-286 label:nth-child(2) input"},
            scriptPoorManUp:{sel:"#component-286 label:nth-child(3) input"},
            scriptPoorManDown:{sel:"#component-286 label:nth-child(4) input"},

            scriptSDUpTile:{sel:"#component-300 input",sel2:"#range_id_36"},
            scriptSDUpScale:{sel:"#component-301 input",sel2:"#range_id_37"},
            scriptSDUpUpcaler:{sel:"#component-302"},
        },
        ui:{},
        savedSetting: JSON.parse(localStorage.awqSavedSetting || '{}'),
        currentQueue: JSON.parse(localStorage.awqCurrentQueue || '[]'),
        notificationSound: (localStorage.awqNotificationSound == 1 ? true : false),
        maxOutputLines: localStorage.awqMaxOutputLines || 500,
        autoscrollOutput: (localStorage.awqAutoscrollOutput == 0 ? false : true),
    };
    const c_emptyQueueString = 'Queue is empty';
    const c_processButtonText = 'Process queue';
    const c_innerUIWidth = 'calc(100vw - 20px)';
    const c_uiElemntHeight = '25px';
    const c_uiElemntHeightSmall = '18px';
    const c_audio_base64 = new Audio('data:audio/mpeg;base64,//PkZAAAAAGkAAAAAAAAA0gAAAAATEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//PkZAAAAAGkAAAAAAAAA0gAAAAATEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVR9DU02wxI2HBY0xzzTPHVjsaEggIYbBQymbZ5et+lSLLDAPL2LcegkDNlkiLYgIBgMoIRxodnFVNMu2pmYwSfDSC2CxTFDKowcoycCimGKGFhYRCx50EjDS05dCEXJaIRTRHMTQfkO/U/sjuSEa5wroVM0a2hmXr0oA7JasD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V///+YGDIYDB4HGBRAYjCABAQMAOrVXeNb/////QYBwSBIETHQhBgBRAMGgq1lV3jW13f//////ogl+UTWeJbqBIMiQBa6X2STL/Y1tdq75lrtXf///////44AURAYAVhE+lMmFrcRNYQqJhyhq4FhWjY1tdx/mWu475lrv//////////rTVMnql4XBZApWX+aWuRL1jSmZf5pbEEvXQWDS+Z+yzHfK2u1d8y12rtFKTRUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//PkZAAAAAGkAOAAAAAAA0gBwAAATEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV');
    const c_defaultOtputConsoleText = "Here you will see some information about what the script is doing";
    const c_defaultOtputConsoleTextHTML = `<span class="console-description" style="color:darkgray">${c_defaultOtputConsoleText}</span>`;

    // ----------------------------------------------------------------------------- Logging
    window.awqDebug = false;
    function awqLog(p_message) { if(window.awqDebug) console.log('AWQ:'+p_message); }
    function awqLogPublishMsg(p_message, p_error) {
        if(!conf.ui.outputConsole) return;
        if(conf.ui.outputConsole.innerHTML.match('console-description')) {
            conf.ui.outputConsole.innerHTML = `* Running SDAtom-WebUi-us version ${GM_info.script.version} using ${GM_info.scriptHandler} with browser ${window.navigator.userAgent}`;
        }
        let lines = conf.ui.outputConsole.querySelectorAll('div');
        let line = document.createElement('div');
        const timestamp = (new Date()).toLocaleTimeString([], {hour: '2-digit',minute: '2-digit',second: '2-digit', hour12: false});
        line.innerHTML = '<span style="' + (p_error ? 'color:red' : '') + '">' + timestamp + ': ' + p_message + '</span>';
        conf.ui.outputConsole.appendChild(line);

        if(lines.length >= conf.maxOutputLines) {
            lines[0].parentNode.removeChild(lines[0]);
        }
        if(conf.autoscrollOutput) conf.ui.outputConsole.scrollTo(0, conf.ui.outputConsole.scrollHeight);
        awqLog(p_message);
    }
    function awqLogPublishError(p_message, p_error) { awqLogPublishMsg(p_message, true) }
    console.log(`Running SDAtom-WebUi-us version ${GM_info.script.version} using ${GM_info.scriptHandler} with browser ${window.navigator.userAgent}`);
    // ----------------------------------------------------------------------------- Wait for content to load
    let waitForLoadInterval = setInterval(initAWQ, 500);
    function initAWQ() {
        conf.shadowDOM.root = document.querySelector(conf.shadowDOM.sel).shadowRoot;
        if(!conf.shadowDOM.root || !conf.shadowDOM.root.querySelector('#component-89 select')) return;
        clearInterval(waitForLoadInterval);
        awqLog('Content loaded');

        generateMainUI();

        conf.shadowDOM.root.querySelector('.min-h-screen').style.cssText = 'min-height:unset !important;';

        function mapElementsToConf(p_object, p_info) {
            for (let prop in p_object) {
                if(p_object[prop].sel) {
                    p_object[prop].el = conf.shadowDOM.root.querySelector(p_object[prop].sel);
                    if(!p_object[prop].el) awqLogPublishError(`Failed to find the ${p_info} ${prop}`);
                }
                if(p_object[prop].sel2) {
                    p_object[prop].el2 = conf.shadowDOM.root.querySelector(p_object[prop].sel2);
                    if(!p_object[prop].el2) awqLogPublishError(`Failed to find the secondary ${p_info} ${prop}`);
                }
            }
        }

        mapElementsToConf(conf.info, 'main object');
        mapElementsToConf(conf.t2i, 't2i object');
        mapElementsToConf(conf.t2i.controls, 't2i control');
        mapElementsToConf(conf.i2i, 'i2i object');
        mapElementsToConf(conf.i2i.controls, 't2i control');

        setInterval(updateStatus, 100);


    }

    function generateMainUI() {
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
        defaultQueueQuantity.onfocus = function() {this.select();};
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
        clearButton.onclick = function() {
            queueContainer.innerHTML = c_emptyQueueString;
            let oldQueueLength = conf.currentQueue.length;
            conf.currentQueue = [];
            updateQueueState();
            awqLogPublishMsg(`Queue has been cleared, ${oldQueueLength} items removed`);
        }
        container.appendChild(clearButton);

        let rememberQueueCheckboxLabel = document.createElement('label');
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

        let notificationSoundCheckboxLabel = document.createElement('label');
        notificationSoundCheckboxLabel.innerHTML = '🔉';
        notificationSoundCheckboxLabel.style.color = "white";
        notificationSoundCheckboxLabel.style.marginLeft = "10px";
        notificationSoundCheckboxLabel.title = "Play a poping sound when the queue is completed";
        container.appendChild(notificationSoundCheckboxLabel);
        let notificationSoundCheckbox = document.createElement('input');
        notificationSoundCheckbox.type = "checkbox";
        notificationSoundCheckbox.onclick = function() {localStorage.awqNotificationSound = this.checked ? 1 : 0; conf.notificationSound = this.checked};
        notificationSoundCheckbox.checked = conf.notificationSound;
        notificationSoundCheckbox.style.cursor = "pointer";
        notificationSoundCheckbox.title = "Play a poping sound when the queue is completed";
        container.appendChild(notificationSoundCheckbox);

        let importExportButton = document.createElement('button');
        importExportButton.innerHTML = "Import/export";
        importExportButton.style.marginLeft = "5px";
        importExportButton.style.height = c_uiElemntHeight;
        importExportButton.style.cursor = "pointer";
        importExportButton.title = "Import or export all the data for this script (to import add previoiusly exported data to the right, to export leave it empty). Importing data will reload the page!";
        importExportButton.onclick = exportImport;
        container.appendChild(importExportButton);
        let importExportData = document.createElement('input');
        importExportData.placeholder = 'Import/export data';
        importExportData.style.height = c_uiElemntHeightSmall;
        importExportData.style.width = '125px';
        importExportData.style.marginRight = '10px';
        importExportData.title = "Exported data will be show here, add data here to import it. Importing data will reload the page!";
        importExportData.onfocus = function() {this.select();};
        container.appendChild(importExportData);

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
        settingName.onfocus = function() {this.select();};
        container.appendChild(settingName);
        let saveSettingButton = document.createElement('button');
        saveSettingButton.innerHTML = "Save";
        saveSettingButton.style.height = c_uiElemntHeight;
        saveSettingButton.onclick = function() {saveSettings(); }
        saveSettingButton.style.cursor = "pointer";
        saveSettingButton.title = "Save currently selected settings so that you can load them again later";
        container.appendChild(saveSettingButton);



        let outputConsole = document.createElement('div');
        outputConsole.title = c_defaultOtputConsoleText;
        outputConsole.innerHTML = c_defaultOtputConsoleTextHTML;
        outputConsole.style.width = 'calc(100vw - 50px)';
        outputConsole.style.border = "1px solid black";
        outputConsole.style.color = "gray";
        outputConsole.style.padding = "2px";
        outputConsole.style.marginTop = "5px";
        outputConsole.style.marginBottom = "5px";
        outputConsole.style.marginLeft = "15px";
        outputConsole.style.marginRight = "15px";
        outputConsole.style.height = (16*10)+"px";
        outputConsole.style.overflow = "auto";
        outputConsole.style.backgroundColor = "white";
        outputConsole.style.boxShadow = 'inset 0px 1px 4px #666';
        container.appendChild(outputConsole);
        let maxOutputConsoleRows = document.createElement('input');
        maxOutputConsoleRows.value = conf.maxOutputLines;
        maxOutputConsoleRows.placeholder = 'Max rows';
        maxOutputConsoleRows.style.height = c_uiElemntHeightSmall;
        maxOutputConsoleRows.style.width = '50px';
        maxOutputConsoleRows.style.marginRight = '10px';
        maxOutputConsoleRows.style.marginLeft = '10px';
        maxOutputConsoleRows.type = 'number';
        maxOutputConsoleRows.title = "Max number of rows listed in console above";
        maxOutputConsoleRows.onfocus = function() {this.select();};
        maxOutputConsoleRows.onchange = function() {localStorage.awqMaxOutputLines = this.value; conf.maxOutputLines = this.value;};
        container.appendChild(maxOutputConsoleRows);
        let autoscrollOutputConsoleLabel = document.createElement('label');
        autoscrollOutputConsoleLabel.innerHTML = 'Autoscroll';
        autoscrollOutputConsoleLabel.style.color = "white";
        autoscrollOutputConsoleLabel.style.marginLeft = "10px";
        autoscrollOutputConsoleLabel.title = "Autoscroll console above";
        container.appendChild(autoscrollOutputConsoleLabel);
        let autoscrollOutputConsole = document.createElement('input');
        autoscrollOutputConsole.type = "checkbox";
        autoscrollOutputConsole.onclick = function() {localStorage.awqNotificationSound = localStorage.awqNotificationSound == 1 ? 0 : 1;};
        autoscrollOutputConsole.checked = (localStorage.awqNotificationSound == 1 ? true : false);
        autoscrollOutputConsole.style.cursor = "pointer";
        autoscrollOutputConsole.title = "Automatically scroll to the bottom of the console when a new message is added";
        autoscrollOutputConsole.onclick = function() {localStorage.awqAutoscrollOutput = this.checked ? 1 : 0; conf.autoscrollOutput = this.checked};
        autoscrollOutputConsole.checked = conf.autoscrollOutput;
        container.appendChild(autoscrollOutputConsole);
        let outputConsoleClearButton = document.createElement('button');
        outputConsoleClearButton.innerHTML = "Clear";
        outputConsoleClearButton.style.height = c_uiElemntHeight;
        outputConsoleClearButton.onclick = function() {conf.ui.outputConsole.innerHTML = c_defaultOtputConsoleTextHTML; }
        outputConsoleClearButton.style.cursor = "pointer";
        outputConsoleClearButton.style.marginLeft = "10px";
        outputConsoleClearButton.title = "Clear the console above";
        container.appendChild(outputConsoleClearButton);


        conf.ui.queueContainer = queueContainer;
        conf.ui.clearButton = clearButton;
        conf.ui.loadSettingButton = loadSettingButton;
        conf.ui.settingName = settingName;
        conf.ui.settingsStorage = settingsStorage;
        conf.ui.defaultQueueQuantity = defaultQueueQuantity;
        conf.ui.rememberQueue = rememberQueue;
        conf.ui.notificationSoundCheckbox = notificationSoundCheckbox;
        conf.ui.importExportData = importExportData;
        conf.ui.outputConsole = outputConsole;


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
        itemQuantity.onfocus = function() {this.select();};
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
            awqLogPublishMsg(`Removed queue item`);
        };
        let moveItemUp =document.createElement('button');
        moveItemUp.innerHTML = '⇧';
        moveItemUp.style.height = c_uiElemntHeight;
        moveItemUp.style.cursor = "pointer";
        moveItemUp.title = "Move this item up in the queue";
        moveItemUp.onclick = function() {
            let tar = this.parentNode;
            if(tar.previousSibling) {
                tar.parentNode.insertBefore(tar, tar.previousSibling);
                awqLogPublishMsg(`Rearranged queue`);
            }
            updateQueueState();
        };
        let moveItemDown =document.createElement('button');
        moveItemDown.innerHTML = '⇩';
        moveItemDown.style.height = c_uiElemntHeight;
        moveItemDown.style.cursor = "pointer";
        moveItemDown.title = "Move this item down in the queue";
        moveItemDown.onclick = function() {
            let tar = this.parentNode;
            if(tar.nextSibling) {
                tar.parentNode.insertBefore(tar.nextSibling, tar);
                awqLogPublishMsg(`Rearranged queue`);
            }
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
                awqLogPublishMsg(`Manually loaded queue item settings`);
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

        awqLogPublishMsg(`Added new ${itemType.value} queue item (${quantity}x)`);
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
            awqLogPublishMsg('Processing <b>started</b>');
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
            awqLogPublishMsg('Processing <b>ended</b>');
            conf.info.processing = false;
            conf.info.previousTaskStartTime = null;
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

        if(conf.info.previousTaskStartTime) {
            let timeSpent = Date.now() - conf.info.previousTaskStartTime;
            awqLogPublishMsg(`Completed work on queue item after ${Math.floor(timeSpent/1000/60)} minutes ${Math.round((timeSpent-Math.floor(timeSpent/60000)*60000)/1000)} seconds `);
        }

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
                    awqLogPublishMsg(`Started working on ${itemType} queue item ${i+1} (${itemQuantity.value} more to go) `);
                    conf.info.previousTaskStartTime = Date.now();
                });
                return;
            }
        }
        conf.info.previousTaskStartTime = null;
        awqLog('executeNewTask - No more tasks found');
        toggleProcessButton(false); // No more tasks to process
        if(localStorage.awqNotificationSound == 1) c_audio_base64.play();
    }

    function saveSettings() {
        if(conf.ui.settingName.value.length < 1) {alert('Missing name'); return;}
        if(conf.savedSetting.hasOwnProperty(conf.ui.settingName.value)) {alert('Duplicate name'); return;}

        let seettingSetName = conf.info.activeType + '-'+ conf.ui.settingName.value;
        conf.savedSetting[seettingSetName] = getValueJSON();

        localStorage.awqSavedSetting = JSON.stringify(conf.savedSetting);

        awqLogPublishMsg(`Saved new setting set ` + seettingSetName);
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
        let itemName = conf.ui.settingsStorage.options[conf.ui.settingsStorage.selectedIndex].text;
        let itemType = itemName.split('-')[0];
        switchTabAndWait(itemType, function() {
            loadJson(conf.ui.settingsStorage.value);
            awqLogPublishMsg(`Loaded settings set ` + itemName);
        });
    }

    function switchTabAndWait(p_type, p_callback) {
        if(p_type == conf.info.activeType) {
            p_callback();
        } else {
            let startingTab = conf.info.activeType;
            awqLog('switchTabAndWait current tab:' + conf.info.activeType);
            conf.shadowDOM.root.querySelector(conf[p_type].controls.tabButton.sel).click(); // Using .el doesn't work
            let waitForSwitchInterval = setInterval(function() {
                if(conf.info.activeType !== p_type) return;
                clearInterval(waitForSwitchInterval);
                awqLog('switchTabAndWait tab switched to ' + conf.info.activeType);
                awqLogPublishMsg(`Switched active tab from ${startingTab} to ${conf.info.activeType}`);
                p_callback();
            },100);
        }
    }

    function clearSetting() {
        let ss = conf.ui.settingsStorage;
        if(ss.value.length < 1) return;
        awqLogPublishMsg(`Removed setting ` + ss.options[ss.selectedIndex].innerHTML);
        delete conf.savedSetting[ss.options[ss.selectedIndex].innerHTML];
        ss.removeChild(ss.options[ss.selectedIndex]);

        localStorage.awqSavedSetting = JSON.stringify(conf.savedSetting);
        if(ss.value.length < 1) refreshSettings();

    }
    function exportImport() {
        let exportJSON = JSON.stringify({
            savedSetting: conf.savedSetting,
            currentQueue: conf.currentQueue,
            notificationSound: conf.notificationSound,
            maxOutputLines:conf.maxOutputLines,
            autoscrollOutput:conf.autoscrollOutput,
        });
        let importJSON = conf.ui.importExportData.value;

        if(importJSON.length < 1) {
            awqLogPublishMsg(`Exported script data`);
            conf.ui.importExportData.value = exportJSON;
            conf.ui.importExportData.focus();
            conf.ui.importExportData.select();
            return;
        }

        if(!isJsonString(importJSON)) {
            awqLogPublishMsg(`There is something wrong with the import data provided`);
            return;
        } else if(exportJSON == importJSON) {
            awqLogPublishMsg(`The input data is the same as the current script data`);
        } else {
            awqLog('Data has changed');
            let parsedImportJSON = JSON.parse(importJSON);
            conf.ui.notificationSoundCheckbox.checked = (parsedImportJSON.awqNotificationSound == 1 ? true : false);
            conf.savedSetting = parsedImportJSON.savedSetting;
            conf.currentQueue = parsedImportJSON.currentQueue;
            conf.notificationSound = parsedImportJSON.notificationSound;
            conf.maxOutputLines = parsedImportJSON.maxOutputLines;
            conf.autoscrollOutput = parsedImportJSON.autoscrollOutput;
            localStorage.awqNotificationSound = parsedImportJSON.awqNotificationSound;
            localStorage.awqSavedSetting = JSON.stringify(conf.savedSetting);
            localStorage.awqCurrentQueue = JSON.stringify(conf.currentQueue);
            localStorage.awqNotificationSound = conf.notificationSound ? 1 : 0;
            localStorage.awqMaxOutputLines = conf.maxOutputLines;
            localStorage.awqAutoscrollOutput = conf.autoscrollOutput ? 1 : 0;
            location.reload();
        }
    }
    function isJsonString(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    function getValueJSON(p_type) {
		let type = p_type || conf.info.activeType;
        awqLog('getValueJSON type=' + type);
        let valueJSON = {type:type};
        for (let prop in conf[type]) {
            if(prop !== 'controls') {
                try {
                    if(conf[type][prop].el.type == 'fieldset') { // Radio buttons
                        valueJSON[prop] = conf[type][prop].el.querySelector('input:checked').value;
                    } else if(conf[type][prop].el.type == 'checkbox') {
                        valueJSON[prop] = conf[type][prop].el.checked;
                    } else { // Inputs, Textarea
                        valueJSON[prop] = conf[type][prop].el.value;
                    }
                } catch(e) {
                    awqLogPublishError(`Failed to retrieve settings for ${type} item ${prop} with error ${e.message}: <pre style="margin: 0;">${e.stack}</pre>`);
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
            let triggerOnBaseElem = true;
            if(prop == 'type') continue;
            try {
                awqLog(prop + ' value='+conf[type][prop].el.value+ ' --->'+inputJSONObject[prop]);
                if(conf[type][prop].el.type == 'fieldset') {
                    triggerOnBaseElem = false; // No need to trigger this on base element
                    conf[type][prop].el.querySelector('[value="' + inputJSONObject[prop] + '"]').checked = true;
                    triggerChange(conf[type][prop].el.querySelector('[value="' + inputJSONObject[prop] + '"]'));
                } else if(conf[type][prop].el.type == 'select-one') { // Select
                    if(conf[type][prop].el.checked == inputJSONObject[prop]) triggerOnBaseElem = false; // Not needed
                    conf[type][prop].el.value = inputJSONObject[prop];
                } else if(conf[type][prop].el.type == 'checkbox') {
                    if(conf[type][prop].el.checked == inputJSONObject[prop]) triggerOnBaseElem = false; // Prevent checbox getting toggled
                    conf[type][prop].el.checked = inputJSONObject[prop];
                } else { // Input, Textarea
                    if(conf[type][prop].el.value == inputJSONObject[prop]) triggerOnBaseElem = false; // Fixes svelte error
                    conf[type][prop].el.value = inputJSONObject[prop];
                }
                if(conf[type][prop].el2) {
                    let triggerForSel2 = conf[type][prop].sel2.value != inputJSONObject[prop];
                    conf[type][prop].el2.value = inputJSONObject[prop];
                    if(triggerForSel2) triggerChange(conf[type][prop].el2);
                }
                if(triggerOnBaseElem) triggerChange(conf[type][prop].el);
            } catch(e) {
                awqLogPublishError(`Failed to load settings for ${type} item ${prop} with error ${e.message}: <pre style="margin: 0;">${e.stack}</pre>`);
            }
        }
    }


    function triggerChange(p_elem) {
        let evt = document.createEvent("HTMLEvents");
        evt.initEvent("change", false, true); // Needed for script to update subsection
        p_elem.dispatchEvent(evt);
        evt = document.createEvent("HTMLEvents");
        evt.initEvent("input", false, true); // Needded for webui to register changed settings
        p_elem.dispatchEvent(evt);
    }

})();