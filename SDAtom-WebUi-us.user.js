// ==UserScript==
// @name         SDAtom-WebUi-us
// @namespace    SDAtom-WebUi-us
// @version      1.0.5
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
        commonData: {
            t2iContainer:{sel:"#tab_txt2img"},
            i2iContainer:{sel:"#tab_img2img"},
            extContainer:{sel:"#tab_extras"},
            sdModelCheckpointContainer:{sel:"#setting_sd_model_checkpoint"},
            sdModelCheckpoint:{sel:"#setting_sd_model_checkpoint select"},
            versionContainer:{sel:"#footer .versions"},

            working:false,
            processing:false,
            waiting:false,
        },
        t2i: {
            controls:{
                tabButton: {sel:"#tabs > div:nth-child(1) > button:nth-child(1)"},
                genrateButton: {sel:"#txt2img_generate"},
                skipButton: {sel:"#txt2img_skip"},
            },

            prompt: {sel:"#txt2img_prompt textarea"},
            negPrompt: {sel:"#txt2img_neg_prompt textarea"},

            sample: {sel:"#txt2img_steps [id^=range_id]",sel2:"#txt2img_steps input"},
            sampleMethod: {sel:"#txt2img_sampling select"},

            width:  {sel:"#txt2img_width [id^=range_id]",sel2:"#txt2img_width input"},
            height: {sel:"#txt2img_height [id^=range_id]",sel2:"#txt2img_height input"},

            restoreFace: {sel:"#txt2img_restore_faces input"},
            tiling: {sel:"#txt2img_tiling input"},

            highresFix: {sel:"#txt2img_enable_hr input"},
            hrFixUpscaler: {sel:"#txt2img_hr_upscaler select"},
            hrFixSteps: {sel:"#txt2img_hires_steps [id^=range_id]",sel2:"#txt2img_hires_steps input"},
            hrFixdenoise: {sel:"#txt2img_denoising_strength [id^=range_id]",sel2:"#txt2img_denoising_strength input"},
            hrFixUpscaleBy: {sel:"#txt2img_hr_scale [id^=range_id]",sel2:"#txt2img_hr_scale input"},
            hrFixWidth: {sel:"#txt2img_hr_resize_x [id^=range_id]",sel2:"#txt2img_hr_resize_x input"},
            hrFixHeight: {sel:"#txt2img_hr_resize_y [id^=range_id]",sel2:"#txt2img_hr_resize_y input"},

            batchCount: {sel:"#txt2img_batch_count [id^=range_id]",sel2:"#txt2img_batch_count input"},
            batchSize: {sel:"#txt2img_batch_size [id^=range_id]",sel2:"#txt2img_batch_size input"},

            cfg: {sel:"#txt2img_cfg_scale [id^=range_id]",se2:"#txt2img_cfg_scale input"},

            seed: {sel:"#txt2img_seed input"},

            extra: {sel:"#txt2img_subseed_show input"},
            varSeed: {sel:"#txt2img_subseed input"},
            varStr: {sel:"#txt2img_subseed_strength [id^=range_id]",sel2:"#txt2img_subseed_strength input"},
            varRSFWidth: {sel:"#txt2img_seed_resize_from_w [id^=range_id]",sel2:"#txt2img_seed_resize_from_w input"},
            varRSFHeight: {sel:"#txt2img_seed_resize_from_h [id^=range_id]",sel2:"#txt2img_seed_resize_from_h input"},

            script: {sel:"#txt2img_script_container select"},

            scriptPromptMatrixPutVar: {sel:"#script_txt2txt_prompt_matrix_put_at_start input"},
            scriptPromptMatrixUseDiff: {sel:"#script_txt2txt_prompt_matrix_different_seeds input"},

            scriptXYZXtype:{sel:"#script_txt2txt_xyz_plot_x_type select"},
            scriptXYZXVals:{sel:"#script_txt2txt_xyz_plot_x_values textarea"},
            scriptXYZYtype:{sel:"#script_txt2txt_xyz_plot_y_type select"},
            scriptXYZYVals:{sel:"#script_txt2txt_xyz_plot_y_values textarea"},
            scriptXYZZtype:{sel:"#script_txt2txt_xyz_plot_z_type select"},
            scriptXYZZVals:{sel:"#script_txt2txt_xyz_plot_z_values textarea"},
            scriptXYZDrawLeg:{sel:"#script_txt2txt_xyz_plot_draw_legend input"},
            scriptXYZIncludeSubImg:{sel:"#script_txt2txt_xyz_plot_include_lone_images input"},
            scriptXYZIncludeSubGrid:{sel:"#script_txt2txt_xyz_plot_include_sub_grids input"},
            scriptXYZKeepMOne:{sel:"#script_txt2txt_xyz_plot_no_fixed_seeds input"},
            scriptXYZGridMargin: {sel:"#script_txt2txt_xyz_plot_margin_size [id^=range_id]",sel2:"#script_txt2txt_xyz_plot_margin_size input"},
        },
        i2i:{
            controls:{
                tabButton: {sel:"#tabs > div:nth-child(1) > button:nth-child(2)"},
                genrateButton: {sel:"#img2img_generate"},
                skipButton: {sel:"#img2img_skip"},
                i2iMode:[
                    {name:"i2i", buttonSel:"#mode_img2img button:nth-child(1)", containerSel:"#img2img_img2img_tab"},
                    {name:"sketch", buttonSel:"#mode_img2img button:nth-child(2)", containerSel:"#img2img_img2img_sketch_tab"},
                    {name:"inpaint", buttonSel:"#mode_img2img button:nth-child(3)", containerSel:"#img2img_inpaint_tab"},
                    {name:"inpaintSketch", buttonSel:"#mode_img2img button:nth-child(4)", containerSel:"#img2img_inpaint_sketch_tab"},
                    {name:"inpaintUpload", buttonSel:"#mode_img2img button:nth-child(5)", containerSel:"#img2img_inpaint_upload_tab"},
                    {name:"batch", buttonSel:"#mode_img2img button:nth-child(6)", containerSel:"#img2img_batch_tab"},
                ],
            },

            prompt: {sel:"#img2img_prompt textarea"},
            negPrompt: {sel:"#img2img_neg_prompt textarea"},

            resizeMode: {sel:"#resize_mode"},

            inpaintBlur: {sel:"#img2img_mask_blur [id^=range_id]",sel2:"#img2img_mask_blur"},
            inpaintMaskMode: {sel:"#img2img_mask_mode"},
            inpaintMaskContent: {sel:"#img2img_inpainting_fill"},
            inpaintArea: {sel:"#img2img_inpaint_full_res"},
            inpaintPadding: {sel:"#img2img_inpaint_full_res_padding [id^=range_id]",sel2:"#img2img_inpaint_full_res_padding"},


            i2iBatchInputDir: {sel:"#img2img_batch_input_dir textarea"},
            i2iBatchOutputDir: {sel:"#img2img_batch_output_dir textarea"},

            sample: {sel:"#img2img_steps [id^=range_id]",sel2:"#img2img_steps input"},
            sampleMethod: {sel:"#img2img_sampling select"},

            width:  {sel:"#img2img_width [id^=range_id]",sel2:"#img2img_width input"},
            height: {sel:"#img2img_height [id^=range_id]",sel2:"#img2img_height input"},

            restoreFace: {sel:"#img2img_restore_faces input"},
            tiling: {sel:"#img2img_tiling input"},

            batchCount: {sel:"#img2img_batch_count [id^=range_id]",sel2:"#img2img_batch_count input"},
            batchSize: {sel:"#img2img_batch_size [id^=range_id]",sel2:"#img2img_batch_size input"},

            cfg: {sel:"#img2img_cfg_scale [id^=range_id]",se2:"#img2img_cfg_scale input"},

            denoise: {sel:"#img2img_denoising_strength [id^=range_id]",se2:"#img2img_denoising_strength input"},

            seed: {sel:"#img2img_seed input"},

            extra: {sel:"#txt2img_subseed_show input"},
            varSeed: {sel:"#img2img_subseed input"},
            varStr: {sel:"#img2img_subseed_strength input",sel2:"#img2img_subseed_strength [id^=range_id]"},
            varRSFWidth: {sel:"#img2img_seed_resize_from_w input",sel2:"#img2img_seed_resize_from_w [id^=range_id]"},
            varRSFHeight: {sel:"#img2img_seed_resize_from_h input",sel2:"#img2img_seed_resize_from_h [id^=range_id]"},

            script: {sel:"#tab_img2img #script_list select"},

            scriptPromptMatrixPutVar: {sel:"#script_img2img_prompt_matrix_put_at_start input"},
            scriptPromptMatrixUseDiff: {sel:"#script_img2img_prompt_matrix_different_seeds input"},

            scriptXYZXtype:{sel:"#script_img2img_xyz_plot_x_type select"},
            scriptXYZXVals:{sel:"#script_img2img_xyz_plot_x_values textarea"},
            scriptXYZYtype:{sel:"#script_img2img_xyz_plot_y_type select"},
            scriptXYZYVals:{sel:"#script_img2img_xyz_plot_y_values textarea"},
            scriptXYZZtype:{sel:"#script_img2img_xyz_plot_z_type select"},
            scriptXYZZVals:{sel:"#script_img2img_xyz_plot_z_values textarea"},
            scriptXYZDrawLeg:{sel:"#script_img2img_xyz_plot_draw_legend input"},
            scriptXYZIncludeSubImg:{sel:"#script_img2img_xyz_plot_include_lone_images input"},
            scriptXYZIncludeSubGrid:{sel:"#script_img2img_xyz_plot_include_sub_grids input"},
            scriptXYZKeepMOne:{sel:"#script_img2img_xyz_plot_no_fixed_seeds input"},
            scriptXYZGridMargin: {sel:"#script_img2img_xyz_plot_margin_size [id^=range_id]",sel2:"#script_img2img_xyz_plot_margin_size input"},

            scripti2iAltTestOverrideSampM:{sel:"#script_img2img_alternative_test_override_sampler input"},
            scripti2iAltTestOverrideProm:{sel:"#script_img2img_alternative_test_override_prompt input"},
            scripti2iAltTestOrigProm:{sel:"#script_img2img_alternative_test_original_prompt textarea"},
            scripti2iAltTestOrigNProm:{sel:"#script_img2img_alternative_test_original_negative_prompt textarea"},
            scripti2iAltTestOverrideSampS:{sel:"#script_img2img_alternative_test_override_steps input"},
            scripti2iAltTestDecStep:{sel:"#script_img2img_alternative_test_st input",sel2:"#script_img2img_alternative_test_st [id^=range_id]"},
            scripti2iAltTestOverrideDenoi:{sel:"#script_img2img_alternative_test_override_strength input"},
            scripti2iAltTestDecCFG:{sel:"#script_img2img_alternative_test_cfg input",sel2:"#script_img2img_alternative_test_cfg [id^=range_id]"},
            scripti2iAltTestRand:{sel:"#script_img2img_alternative_test_randomness input",sel2:"#script_img2img_alternative_test_randomness [id^=range_id]"},
            scripti2iAltTestSigma:{sel:"#script_img2img_alternative_test_sigma_adjustment input"},

            scriptLoopbackLoops:{sel:"#script_loopback_loops input",sel2:"#script_loopback_loops [id^=range_id]"},
            scriptLoopbackDenoSCF:{sel:"#script_loopback_denoising_strength_change_factor input",sel2:"#script_loopback_denoising_strength_change_factor [id^=range_id]"},

            scriptOutPMK2Pixels:{sel:"#script_outpainting_mk2_pixels input",sel2:"#script_outpainting_mk2_pixels [id^=range_id]"},
            scriptOutPMK2MaskBlur:{sel:"#script_outpainting_mk2_mask_blur input",sel2:"#script_outpainting_mk2_mask_blur [id^=range_id]"},
            scriptOutPMK2Left:{sel:"#script_outpainting_mk2_direction label:nth-child(1) input"},
            scriptOutPMK2Right:{sel:"#script_outpainting_mk2_direction label:nth-child(2) input"},
            scriptOutPMK2Up:{sel:"#script_outpainting_mk2_direction label:nth-child(3) input"},
            scriptOutPMK2Down:{sel:"#script_outpainting_mk2_direction label:nth-child(4) input"},
            scriptOutPMK2FallOff:{sel:"#script_outpainting_mk2_noise_q input",sel2:"#script_outpainting_mk2_noise_q [id^=range_id]"},
            scriptOutPMK2ColorVar:{sel:"#script_outpainting_mk2_color_variation input",sel2:"#script_outpainting_mk2_color_variation [id^=range_id]"},

            scriptPoorManPixels:{sel:"#script_poor_mans_outpainting_pixels input",sel2:"#script_poor_mans_outpainting_pixels [id^=range_id]"},
            scriptPoorManMaskBlur:{sel:"#script_poor_mans_outpainting_mask_blur input",sel2:"#script_poor_mans_outpainting_mask_blur [id^=range_id]"},
            scriptPoorManMaskCont:{sel:"#script_poor_mans_outpainting_inpainting_fill"},
            scriptPoorManLeft:{sel:"#script_poor_mans_outpainting_direction label:nth-child(1) input"},
            scriptPoorManRight:{sel:"#script_poor_mans_outpainting_direction label:nth-child(2) input"},
            scriptPoorManUp:{sel:"#script_poor_mans_outpainting_direction label:nth-child(3) input"},
            scriptPoorManDown:{sel:"#script_poor_mans_outpainting_direction label:nth-child(4) input"},

            scriptSDUpTile:{sel:"#script_sd_upscale_overlap input",sel2:"#script_sd_upscale_overlap [id^=range_id]"},
            scriptSDUpScale:{sel:"#script_sd_upscale_scale_factor input",sel2:"#script_sd_upscale_scale_factor [id^=range_id]"},
            scriptSDUpUpcaler:{sel:"#script_sd_upscale_upscaler_index"},

        },
        ext:{
            controls:{
                tabButton: {sel:"#tabs > div:nth-child(1) > button:nth-child(3)"},
                genrateButton: {sel:"#extras_generate"},
                loadingElement:{sel:"#html_info_x_extras .wrap"},
                extrasResizeMode:[
                    {name:"scaleBy",buttonSel:"#extras_resize_mode button:nth-child(1)",containerSel:"#extras_scale_by_tab"},
                    {name:"scaleTo",buttonSel:"#extras_resize_mode button:nth-child(2)",containerSel:"#extras_scale_to_tab"},
                ],
                extrasMode:[
                    {name:"singleImg",buttonSel:"#mode_extras button:nth-child(1)",containerSel:"#extras_single_tab"},
                    {name:"batchProcess",buttonSel:"#mode_extras button:nth-child(2)",containerSel:"#extras_batch_process_tab"},
                    {name:"batchDir",buttonSel:"#mode_extras button:nth-child(3)",containerSel:"#extras_batch_directory_tab"},
                ],
            },


            scaleByResize:{sel:"#extras_upscaling_resize input",sel2:"#extras_upscaling_resize [id^=range_id]"},

            scaleToWidth:{sel:"#extras_upscaling_resize_w input"},
            scaleToHeight:{sel:"#extras_upscaling_resize_h input"},
            scaleToCropToFit:{sel:"#extras_upscaling_crop input"},

            batchDirInput:{sel:"#extras_batch_input_dir textarea"},
            batchDirOutput:{sel:"#extras_batch_output_dir textarea"},
            batchDirShowImg:{sel:"#extras_show_extras_results input"},

            upscaler1:{sel:"#extras_upscaler_1 select"},
            upscaler2:{sel:"#extras_upscaler_2 select"},
            upscale2Vis:{sel:"#extras_upscaler_2_visibility input",sel2:"#extras_upscaler_2_visibility [id^=range_id]"},
            GFPGANVis:{sel:"#extras_gfpgan_visibility input",sel2:"#extras_gfpgan_visibility [id^=range_id]"},
            CodeFormVis:{sel:"#extras_codeformer_visibility input",sel2:"#extras_codeformer_visibility [id^=range_id]"},
            CodeFormWeight:{sel:"#extras_codeformer_weight input",sel2:"#extras_codeformer_weight [id^=range_id]"},
 

        },
        ui:{},
        savedSetting: JSON.parse(localStorage.awqSavedSetting || '{}'),
        currentQueue: JSON.parse(localStorage.awqCurrentQueue || '[]'),
        notificationSound: (localStorage.awqNotificationSound == 1 ? true : false),
        maxOutputLines: localStorage.awqMaxOutputLines || 500,
        autoscrollOutput: (localStorage.awqAutoscrollOutput == 0 ? false : true),
        verboseLog: (localStorage.awqVerboseLog == 1 ? true : false),
        promptFilter: JSON.parse(localStorage.awqPromptFilter || '[]'),
        extensionScript: localStorage.awqExtensionScript || '',
    };
    const c_emptyQueueString = 'Queue is empty';
    const c_addToQueueButtonText = 'Add to queue';
    const c_processButtonText = 'Process queue';
    const c_defaultTextStoredSettings = "Stored settings";
    const c_innerUIWidth = 'calc(100vw - 20px)';
    const c_uiElemntHeight = '25px';
    const c_uiElemntHeightSmall = '18px';
    const c_audio_base64 = new Audio('data:audio/mpeg;base64,//PkZAAAAAGkAAAAAAAAA0gAAAAATEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//PkZAAAAAGkAAAAAAAAA0gAAAAATEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVR9DU02wxI2HBY0xzzTPHVjsaEggIYbBQymbZ5et+lSLLDAPL2LcegkDNlkiLYgIBgMoIRxodnFVNMu2pmYwSfDSC2CxTFDKowcoycCimGKGFhYRCx50EjDS05dCEXJaIRTRHMTQfkO/U/sjuSEa5wroVM0a2hmXr0oA7JasD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V///+YGDIYDB4HGBRAYjCABAQMAOrVXeNb/////QYBwSBIETHQhBgBRAMGgq1lV3jW13f//////ogl+UTWeJbqBIMiQBa6X2STL/Y1tdq75lrtXf///////44AURAYAVhE+lMmFrcRNYQqJhyhq4FhWjY1tdx/mWu475lrv//////////rTVMnql4XBZApWX+aWuRL1jSmZf5pbEEvXQWDS+Z+yzHfK2u1d8y12rtFKTRUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//PkZAAAAAGkAOAAAAAAA0gBwAAATEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV');
    const c_defaultOtputConsoleText = "Here you will see some information about what the script is doing";
    const c_defaultOtputConsoleTextHTML = `<span class="console-description" style="color:darkgray">${c_defaultOtputConsoleText}</span>`;
    const c_extraResizeModeScaleByType = 1;
    const c_extraResizeModeScaleToType = 2;
    const c_wait_tick_duration = 200;

    // ----------------------------------------------------------------------------- Logging
    const c_scriptVersion = typeof GM_info == 'undefined' ? new Date().toUTCString() : GM_info.script.version;
    const c_scriptHandeler = typeof GM_info == 'undefined' ? '(not a user script)' : GM_info.scriptHandler;

    console.log(`Running SDAtom-WebUi-us version ${c_scriptVersion} using ${c_scriptHandeler} with browser ${window.navigator.userAgent}`);
    function awqLog(p_message) {
        if(conf.verboseLog) {
            awqLogPublishMsg(p_message, 'lightgray');
        }
    }
    function awqLogPublishMsg(p_message, p_color) {
        if(!conf.ui.outputConsole) return;
        if(conf.ui.outputConsole.innerHTML.match('console-description')) {
            let ASDWUIVerText = '<span style="font-size: 0.9em;">' + conf.commonData.versionContainer.el.textContent + '</span>';
            conf.ui.outputConsole.innerHTML = `* Running SDAtom-WebUi-us version ${c_scriptVersion} using ${c_scriptHandeler} with browser ${window.navigator.userAgent} stable-diffusion-webui version ${ASDWUIVerText}`;
        }
        let lines = conf.ui.outputConsole.querySelectorAll('div');
        let line = document.createElement('div');
        const timestamp = (new Date()).toLocaleTimeString([], {hour: '2-digit',minute: '2-digit',second: '2-digit', hour12: false});
        line.innerHTML = '<span style="' + (p_color ? 'color:'+p_color : '') + '">' + timestamp + ': ' + p_message + '</span>';
        conf.ui.outputConsole.appendChild(line);

        if(lines.length >= conf.maxOutputLines) {
            lines[0].parentNode.removeChild(lines[0]);
        }
        if(conf.autoscrollOutput) conf.ui.outputConsole.scrollTo(0, conf.ui.outputConsole.scrollHeight);
    }
    function awqLogPublishError(p_message) { awqLogPublishMsg(p_message, 'red') }
    window.addEventListener("error", (event) => {
        if(conf.verboseLog) {
            awqLogPublishMsg(
                `Javascript error (can be caused by something other than this script): ${event.message} source:${event.filename} line:${event.lineno} col:${event.colno} Error:${event.error ? JSON.stringify(event.error) : '' }`,
                'darkorange'
            );
        }
    },true);
    window.addEventListener("unhandledrejection", (event) => {
        if(conf.verboseLog) {
            awqLogPublishMsg(
                `Javascript promise error (can be caused by something other than this script): ${event.reason}`,
                'darkorange'
            );
        }
    },true);
    let oldWarn = window.console.warn,oldInfo = window.console.info,oldLog = window.console.log,oldError = window.console.error;
    window.console.warn = function(p_msg) {
        if(conf.verboseLog) awqLogPublishMsg('log (warn) message (can be caused by something other than this script):' + p_msg +`<br>Call stack:<pre>${getCallStack()}</pre>`, 'lightgray'); oldWarn(p_msg);
    }
    window.console.info = function(p_msg) {
        if(conf.verboseLog) awqLogPublishMsg('log (info) message (can be caused by something other than this script):' + p_msg +`<br>Call stack:<pre>${getCallStack()}</pre>`, 'lightgray'); oldInfo(p_msg);
    }
    window.console.log = function(p_msg) {
        if(conf.verboseLog) awqLogPublishMsg('log (log) message (can be caused by something other than this script):' + p_msg +`<br>Call stack:<pre>${getCallStack()}</pre>`, 'lightgray'); oldLog(p_msg);
    }
    // ----------------------------------------------------------------------------- Wait for content to load
    let waitForLoadInterval = setInterval(initAWQ, c_wait_tick_duration);
    function initAWQ() {
        conf.shadowDOM.root = document.querySelector(conf.shadowDOM.sel).shadowRoot;
        if(!conf.shadowDOM.root || !conf.shadowDOM.root.querySelector('#txt2img_prompt')) return;
        clearInterval(waitForLoadInterval);
        awqLog('initAWQ: Content loaded');

        conf.commonData.versionContainer.el = conf.shadowDOM.root.querySelector('#footer .versions');

        generateMainUI();

        try { eval(conf.extensionScript);} catch(e) { awqLogPublishMsg(`Failed to load extension script, error: <pre>${e.message} l:${e.lineNumber} c:${e.columnNumber}\n${e.stack}</pre>`,'darkorange')}

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

        mapElementsToConf(conf.commonData, 'main object');
        mapElementsToConf(conf.t2i, 't2i object');
        mapElementsToConf(conf.t2i.controls, 't2i control');
        mapElementsToConf(conf.i2i, 'i2i object');
        mapElementsToConf(conf.i2i.controls, 'i2i control');
        mapElementsToConf(conf.ext, 'ext object');
        mapElementsToConf(conf.ext.controls, 'ext control');

        setInterval(updateStatus, c_wait_tick_duration);


    }

    function generateMainUI() {
        let container = document.createElement('div');
        container.style.width = c_innerUIWidth;
        container.style.border = "1px solid white";
        container.style.position = "relative";
        document.body.appendChild(container);



        let addToQueueButton = document.createElement('button');
        addToQueueButton.innerHTML = c_addToQueueButtonText;
        addToQueueButton.style.height = c_uiElemntHeight;
        addToQueueButton.style.color = 'black';
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
        defaultQueueQuantity.type = 'number';
        defaultQueueQuantity.title = "How many items of each will be added to the queue (default is 1)";
        defaultQueueQuantity.onfocus = function() {this.select();};
        container.appendChild(defaultQueueQuantity);
        let assignDefaultToAll = document.createElement('button');
        assignDefaultToAll.innerHTML = '?????';
        assignDefaultToAll.style.cursor = "pointer";
        assignDefaultToAll.title = "Assign the default value to all queue items";
        assignDefaultToAll.style.height = c_uiElemntHeight;
        assignDefaultToAll.style.marginRight = '10px';
        assignDefaultToAll.onclick = function() {
            if(conf.ui.defaultQueueQuantity.value >= 0) {
                document.querySelectorAll('.AWQ-item-quantity').forEach((inp) => {inp.value = conf.ui.defaultQueueQuantity.value});
                updateQueueState();
            }
        };
        container.appendChild(assignDefaultToAll);

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
            if(!confirm('Are you sure you want to remove everything in your queue?')) return;
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
        notificationSoundCheckboxLabel.innerHTML = '????';
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

        let promptFilter = document.createElement('input');
        promptFilter.title = `Filters that are used to modify prompt when adding to queue. Example format [{"desc":"Remove multi space","pattern":"\\s{2,}", "replace":" ", "flags":"g"}] desc is optional and will only be shown in output console`;
        promptFilter.placeholder = "Prompt filter (JSON array)";
        promptFilter.value = JSON.stringify(conf.promptFilter);
        promptFilter.onchange = function() {
            if(isJsonString(promptFilter.value) ) {
                awqLog('promptFilter saved');
                localStorage.awqPromptFilter = JSON.stringify(JSON.parse(promptFilter.value));
                conf.promptFilter = JSON.parse(promptFilter.value);
            } else {
                awqLog('promptFilter is invalid:<pre>' + promptFilter.value+ '</pre>');
            }
        }
        container.appendChild(promptFilter);
        let promptFilterNegLabel = document.createElement('label');
        promptFilterNegLabel.innerHTML = 'Neg prompt';
        promptFilterNegLabel.style.color = "white";
        promptFilterNegLabel.style.marginLeft = "10px";
        promptFilterNegLabel.titpromptFilterNegLabelle = "Also filter negative prompt";
        container.appendChild(promptFilterNegLabel);
        let promptFilterNeg = document.createElement('input');
        promptFilterNeg.type = "checkbox";
        promptFilterNeg.checked = true;
        promptFilterNeg.style.cursor = "pointer";
        promptFilterNeg.title = "Also filter negative prompt";
        container.appendChild(promptFilterNeg);


        let queueContainer = document.createElement('div');
        queueContainer.style.width = c_innerUIWidth;
        queueContainer.style.border = "1px solid white";
        queueContainer.style.color = "gray";
        queueContainer.style.marginBottom = "5px";
        queueContainer.innerHTML = c_emptyQueueString;
        container.appendChild(queueContainer);



        let clearSettingButton = document.createElement('button');
        clearSettingButton.innerHTML = "???";
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
        let editSettingButton = document.createElement('button');
        editSettingButton.innerHTML = "??????";
        editSettingButton.style.height = c_uiElemntHeight;
        editSettingButton.onclick = function() {editSetting(); }
        editSettingButton.style.cursor = "pointer";
        editSettingButton.title = "Edit the currently selected setting (a property can be removed to not change it when loading)";
        container.appendChild(editSettingButton);
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
        let verboseOutputConsoleLabel = document.createElement('label');
        verboseOutputConsoleLabel.innerHTML = 'Verbose';
        verboseOutputConsoleLabel.style.color = "white";
        verboseOutputConsoleLabel.style.marginLeft = "10px";
        verboseOutputConsoleLabel.title = "Log as much as possible (for troubleshooting)";
        container.appendChild(verboseOutputConsoleLabel);
        let verboseOutputConsole = document.createElement('input');
        verboseOutputConsole.type = "checkbox";
        verboseOutputConsole.onclick = function() {localStorage.awqVerboseLog = localStorage.awqVerboseLog == 1 ? 0 : 1;};
        verboseOutputConsole.checked = (localStorage.awqVerboseLog == 1 ? true : false);
        verboseOutputConsole.style.cursor = "pointer";
        verboseOutputConsole.title = "Log as much as possible (for troubleshooting)";
        verboseOutputConsole.onclick = function() {localStorage.awqVerboseLog = this.checked ? 1 : 0; conf.verboseLog = this.checked};
        verboseOutputConsole.checked = conf.verboseLog;
        container.appendChild(verboseOutputConsole);

        let extensionScript = document.createElement('textarea');
        extensionScript.style.height = c_uiElemntHeightSmall;
        extensionScript.style.padding = '1px';
        extensionScript.style.border = '1px';
        extensionScript.style.margin = '0';
        extensionScript.placeholder = "Script extensions";
        extensionScript.title = "Put scripts here to be executed after the main ui has been created";
        extensionScript.value = conf.extensionScript;
        extensionScript.onchange = function() {
                    localStorage.awqExtensionScript = extensionScript.value;
        }
        container.appendChild(extensionScript);

        conf.ui.addToQueueButton = addToQueueButton;
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
        conf.ui.promptFilter = promptFilter;
        conf.ui.promptFilterNeg = promptFilterNeg;
        conf.ui.promptFilterNeg = promptFilterNeg;



        refreshSettings();

        if(conf.currentQueue.length > 0) {
            awqLog('Loaded saved queue:'+conf.currentQueue.length);
            for(let i = 0; i < conf.currentQueue.length; i++) {
                appendQueueItem(conf.currentQueue[i].quantity, conf.currentQueue[i].value, conf.currentQueue[i].type);
            }
            updateQueueState();
        }
        awqLog('generateMainUI: Completed');
    }

    function appendQueueItem(p_quantity, p_value, p_type) {
        awqLog('appendQueueItem: quantity:' + p_quantity + ' type:' + p_type);
        let quantity = isNaN(p_quantity) ? (conf.ui.defaultQueueQuantity.value > 0 ? conf.ui.defaultQueueQuantity.value : 1) : p_quantity;

        let queueItem = document.createElement('div');
        queueItem.style.width = c_innerUIWidth;
        let itemType =document.createElement('input');
        itemType.classList = 'AWQ-item-type';
        itemType.style.display = "50px";
        itemType.style.height = c_uiElemntHeightSmall;
        itemType.style.width = "20px";
        itemType.value = p_type || conf.commonData.activeType;
        itemType.title = "This is the type/tab for the queue item";
        itemType.disabled = true;
        let itemQuantity = document.createElement('input');
        function updateItemQuantityBG() {
            if(itemQuantity.value.length == 0) { itemQuantity.style.backgroundColor = 'red'; }
            else if(itemQuantity.value < 1) { itemQuantity.style.backgroundColor = '#c2ffc2'; }
            else if(itemQuantity.value > 0) { itemQuantity.style.backgroundColor = 'white'; }
        }
        itemQuantity.classList = 'AWQ-item-quantity';
        itemQuantity.value = quantity;
        itemQuantity.style.width = "50px";
        itemQuantity.type = 'number';
        itemQuantity.style.height = c_uiElemntHeightSmall;
        itemQuantity.onchange = function() {
            updateItemQuantityBG();
            updateQueueState();
        };
        updateItemQuantityBG();
        itemQuantity.onfocus = function() {this.select();};
        itemQuantity.title = "This is how many times this item should be executed";
        let itemJSON =document.createElement('input');
        itemJSON.classList = 'AWQ-item-JSON';
        itemJSON.value = p_value || getValueJSON(p_type);
        itemJSON.style.width = "calc(100vw - 275px)";
        itemJSON.style.height = "18px";
        itemJSON.onchange = function() {
            updateQueueState;
            // Update itemType if needed
            let newType = itemJSON.value.match(/"type":"([^"]+)"/);
            newType = newType ? newType[1] : null;
            if(newType != itemType.value) itemType.value = newType;
        }
        itemJSON.title = "This is a JSON string with all the settings to be used for this item. Can be changed while processing the queue but will fail if you enter invalid values.";
        let removeItem =document.createElement('button');
        removeItem.innerHTML = '???';
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
        moveItemUp.innerHTML = '???';
        moveItemUp.style.height = c_uiElemntHeight;
        moveItemUp.style.cursor = "pointer";
        moveItemUp.title = "Move this item up in the queue";
        moveItemUp.onclick = function() {
            let tar = this.parentNode;
            if(tar.previousSibling) {
                tar.parentNode.insertBefore(tar, tar.previousSibling);
                awqLogPublishMsg(`Rearranged queue`);
                updateQueueState();
            }
            
        };
        let moveItemDown =document.createElement('button');
        moveItemDown.innerHTML = '???';
        moveItemDown.style.height = c_uiElemntHeight;
        moveItemDown.style.cursor = "pointer";
        moveItemDown.title = "Move this item down in the queue";
        moveItemDown.onclick = function() {
            let tar = this.parentNode;
            if(tar.nextSibling) {
                tar.parentNode.insertBefore(tar.nextSibling, tar);
                awqLogPublishMsg(`Rearranged queue`);
                updateQueueState();
            }
        };
        let moveItemBottom =document.createElement('button');
        moveItemBottom.innerHTML = '???';
        moveItemBottom.style.height = c_uiElemntHeight;
        moveItemBottom.style.cursor = "pointer";
        moveItemBottom.title = "Move this item to the bottom of the queue";
        moveItemBottom.onclick = function() {
            let tar = this.parentNode;
            if(tar.parentNode.lastChild !== tar) {
                tar.parentNode.appendChild(tar);
                updateQueueState();
            }
        };
        let moveItemTop =document.createElement('button');
        moveItemTop.innerHTML = '???';
        moveItemTop.style.height = c_uiElemntHeight;
        moveItemTop.style.cursor = "pointer";
        moveItemTop.title = "Move this item to the top of the queue";
        moveItemTop.onclick = function() {
            let tar = this.parentNode;
            let parentFirstChild = tar.parentNode.firstChild;
            if(parentFirstChild && parentFirstChild !== tar) {
                tar.parentNode.insertBefore(tar, parentFirstChild);
                awqLogPublishMsg(`Rearranged queue`);
                updateQueueState();
            }
        };
        let loadItem =document.createElement('button');
        loadItem.innerHTML = 'Load';
        loadItem.style.height = c_uiElemntHeight;
        loadItem.style.cursor = "pointer";
        loadItem.title = "Load the settings from this item";
        loadItem.onclick = async function() {
            let itemRow = this.parentNode;
            await loadJson(itemRow.querySelector('.AWQ-item-JSON').value);
        };

        queueItem.appendChild(removeItem);
        queueItem.appendChild(moveItemUp);
        queueItem.appendChild(moveItemDown);
        queueItem.appendChild(moveItemBottom);
        queueItem.appendChild(moveItemTop);
        queueItem.appendChild(loadItem);
        queueItem.appendChild(itemType);
        queueItem.appendChild(itemQuantity);
        queueItem.appendChild(itemJSON);

        if(conf.ui.queueContainer.innerHTML == c_emptyQueueString) conf.ui.queueContainer.innerHTML = "";
        conf.ui.queueContainer.appendChild(queueItem);

        awqLogPublishMsg(`Added new ${itemType.value} queue item (${quantity}x)`);
        // Wait with updating state while loading a predefined queue
        if(isNaN(p_quantity)) updateQueueState();
    }

    function toggleProcessButton(p_set_processing) {
        awqLog('toggleProcessButton:' + p_set_processing);
        let pb = conf.ui.processButton;
        let undefinedInput = typeof p_set_processing == 'undefined';

        if(undefinedInput) {
            toggleProcessButton(!conf.commonData.processing);
        } else if (p_set_processing) {
            awqLogPublishMsg('Processing <b>started</b>');
            conf.commonData.processing = true;
            pb.style.background = 'green';
            pb.innerHTML = '?????? ';
            let cogElem = document.createElement('div')
            cogElem.innerHTML = '??????';
            cogElem.style.display = 'inline-block';
            pb.appendChild(cogElem);

            //cogElem.animate([{ transform: 'rotate(0)' },{transform: 'rotate(360deg)'}], {duration: 1000,iterations: Infinity});

            executeAllNewTasks();
        } else {
            awqLogPublishMsg('Processing <b>ended</b>');
            conf.commonData.processing = false;
            conf.commonData.previousTaskStartTime = null;
            pb.style.background = 'buttonface';
            pb.innerHTML = c_processButtonText;
        }
    }

    function updateQueueState() {
        let queueItems = conf.ui.queueContainer.getElementsByTagName('div');
        awqLog('updateQueueState: old length:'+conf.currentQueue.length + ' new length:'+queueItems.length);

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
            awqLog('updateQueueState: Saving current queue state '+conf.currentQueue.length);
            localStorage.awqCurrentQueue = JSON.stringify(conf.currentQueue);
        } else {
            awqLog('updateQueueState: Cleared current queue state');
            localStorage.removeItem("awqCurrentQueue");
        }
    }

    let stuckProcessingCounter = 0;
    function updateStatus() {
        let previousType = conf.commonData.activeType;
        let previousWorking = conf.commonData.working;

        let workingOnI2I = conf.i2i.controls.skipButton.el.getAttribute('style') == 'display: block;';
        let workingOnT2I = conf.t2i.controls.skipButton.el.getAttribute('style') == 'display: block;';
        let workingOnExt = conf.ext.controls.loadingElement.el.querySelectorAll('.z-20').length > 0;

        // Reset addToQueueButton
        conf.ui.addToQueueButton.disabled = false;
        conf.ui.addToQueueButton.innerHTML = c_addToQueueButtonText;
        conf.ui.addToQueueButton.style.cursor = 'pointer';

		if(conf.commonData.i2iContainer.el.style.display !== 'none') {
			conf.commonData.activeType = 'i2i';
		} else if(conf.commonData.t2iContainer.el.style.display !== 'none') {
			conf.commonData.activeType = 't2i';
		} else if(conf.commonData.extContainer.el.style.display !== 'none') {
			conf.commonData.activeType = 'ext';
		} else {
			conf.commonData.activeType = 'other';

            // Disable addToQueueButton
            conf.ui.addToQueueButton.disabled = true;
            conf.ui.addToQueueButton.innerHTML = 'Tab not supported';
            conf.ui.addToQueueButton.style.cursor = 'not-allowed';
		}

        let typeChanged = conf.commonData.activeType !== previousType ? true : false;
        let workingChanged = conf.commonData.working !== previousWorking ? true : false;

        if(typeChanged) awqLog('updateStatus: active type changed to:' + conf.commonData.activeType);
        if(workingChanged) awqLog('updateStatus: Work status changed to:' + conf.commonData.working);

        // If no work is being done for a while disable queue
        stuckProcessingCounter = !conf.commonData.waiting && !workingChanged && !conf.commonData.working && conf.commonData.processing ? stuckProcessingCounter + 1 : 0;
        if(stuckProcessingCounter > 30) {
            awqLog('updateStatus: stuck in processing queue status? Disabling queue processing');
            toggleProcessButton(false);
            stuckProcessingCounter = 0;
            playWorkCompleteSound();
        }
    }
    async function executeNewTask() {
        awqLog('executeNewTask: working='+conf.commonData.working + ' processing=' + conf.commonData.processing);
        if(conf.commonData.working) return; // Already working on task
        if(!conf.commonData.processing) return; // Not proicessing queue

        if(conf.commonData.previousTaskStartTime) {
            let timeSpent = Date.now() - conf.commonData.previousTaskStartTime;
            awqLogPublishMsg(`Completed work on queue item after ${Math.floor(timeSpent/1000/60)} minutes ${Math.round((timeSpent-Math.floor(timeSpent/60000)*60000)/1000)} seconds `);
        }

        let queueItems = conf.ui.queueContainer.getElementsByTagName('div');
        for(let i = 0; i < queueItems.length; i++) {
            let itemQuantity = queueItems[i].querySelector('.AWQ-item-quantity');
            let itemType = queueItems[i].querySelector('.AWQ-item-type').value;
            if(itemQuantity.value > 0) {
                awqLog('executeNewTask: found next work item with index ' + i + ', quantity ' + itemQuantity.value + ' and type ' + itemType);
                await loadJson(queueItems[i].querySelector('.AWQ-item-JSON').value);
                await clickStartButton(itemType);
                conf.commonData.working = true;
                itemQuantity.value = itemQuantity.value - 1;
                itemQuantity.onchange();
                awqLogPublishMsg(`Started working on ${itemType} queue item ${i+1} (${itemQuantity.value} more to go) `);
                conf.commonData.previousTaskStartTime = Date.now();
                await waitForTaskToComplete(itemType);
                return;
            }
        }
        conf.commonData.previousTaskStartTime = null;
        awqLog('executeNewTask: No more tasks found');
        toggleProcessButton(false); // No more tasks to process
        playWorkCompleteSound();
    }

    async function executeAllNewTasks() {
        while(conf.commonData.processing) {
            await executeNewTask();
        }
    }

    function playWorkCompleteSound() { if(localStorage.awqNotificationSound == 1) c_audio_base64.play();}

    function editSetting() {

        let settingStorage = conf.ui.settingsStorage;
        let settingIndex = settingStorage.selectedIndex;
        let settingOption = settingStorage.options[settingIndex];
        let settingKey = settingOption.innerHTML;
        if(settingKey == c_defaultTextStoredSettings) return;
        awqLog('editSettings: index'+settingIndex);

        let editContainer = document.createElement('div');
        editContainer.style.cssText = 'position: fixed;bottom: 0;left: 0;width: 100vw;height: 100vh;background:black;z-index: 9999;';
        let txtInput = document.createElement('input');
        txtInput.style.cssText = 'width: 100vw;height: 10vh;';
        txtInput.title = "Name of the settins set (do not remove the prefix)";
        editContainer.appendChild(txtInput);
        let txtArea = document.createElement('textarea');
        txtArea.style.cssText = 'width: 100vw;height: 80vh;';
        txtArea.title = 'The set of settings i JSON format (Edit the value inside the "" but leave structure intact, an entire propertey: "id":"value" can also be removed if you do not want this setting set to make any changes to that setting)';
        editContainer.appendChild(txtArea);
        let editButton = document.createElement('button');
        editButton.style.cssText = 'width: 50vw;height: 10vh;';
        editButton.innerHTML = 'OK';
        editButton.title = "Save changes";
        editContainer.appendChild(editButton);
        let resetButton = document.createElement('button');
        resetButton.style.cssText = 'width: 50vw;height: 10vh;';
        resetButton.innerHTML = 'Reset';
        resetButton.title = "Revert changes";
        resetButton.onclick = function() {
            txtArea.value = conf.ui.settingsStorage.options[settingIndex].value;
            txtInput.value = conf.ui.settingsStorage.options[settingIndex].text;
        }
        editContainer.appendChild(resetButton);

        resetButton.onclick();

        document.body.style.overflow = 'hidden';
        document.body.appendChild(editContainer);

        editButton.onclick = function() {
            // Validate
            if(txtInput.value.length < 1) {
                alert('Name is missing');
                return;
            }
            if(!isJsonString(txtArea.value)) {
                alert('Value is invalid JSON');
                return;
            }
            if(!['t2i-','i2i-','ext-'].includes(txtInput.value.substr(0,4))) {
                alert('Name does not have valid prefix (t2i-, i2i-, ext-)');
                return;
            }

            // Remove overlay
            document.body.style.overflow = 'scroll';
            document.body.removeChild(editContainer);

            // Update data and refresh UI
            awqLog('editSettings: updating '+ settingKey + (settingKey == txtInput.value ? '' : ' to ' + txtInput.value));
            delete conf.savedSetting[settingKey];
            conf.savedSetting[txtInput.value] = txtArea.value;
            localStorage.awqSavedSetting = JSON.stringify(conf.savedSetting);
            refreshSettings();

            // Select option again
            let optionToSelect = Array.from(settingStorage.options).find(item => item.text ===txtInput.value);
            optionToSelect.selected = true;
        };
    }

    function saveSettings() {
        if(conf.ui.settingName.value.length < 1) {alert('Missing name'); return;}
        if(conf.savedSetting.hasOwnProperty(conf.ui.settingName.value)) {alert('Duplicate name'); return;}

        let seettingSetName = conf.commonData.activeType + '-'+ conf.ui.settingName.value;
        conf.savedSetting[seettingSetName] = getValueJSON();

        localStorage.awqSavedSetting = JSON.stringify(conf.savedSetting);

        awqLogPublishMsg(`Saved new setting set ` + seettingSetName);
        refreshSettings();
    }
    function refreshSettings() {
        awqLog('refreshSettings: saved settings:'+Object.keys(conf.savedSetting).length);
        conf.ui.settingName.value = "";
        conf.ui.settingsStorage.innerHTML = "";

        for (let prop in conf.savedSetting) {
            let newOption = document.createElement('option');
            newOption.innerHTML = prop;
            newOption.value = conf.savedSetting[prop]
            conf.ui.settingsStorage.appendChild(newOption);
        }
        if(Object.keys(conf.savedSetting).length < 1) {
            let blankOption = document.createElement('option');
            blankOption.innerHTML = c_defaultTextStoredSettings;
            blankOption.value = "";
            conf.ui.settingsStorage.appendChild(blankOption);
        }
    }
    async function loadSetting() {

        if(conf.ui.settingsStorage.value.length < 1) return;
        let itemName = conf.ui.settingsStorage.options[conf.ui.settingsStorage.selectedIndex].text;
        let itemType = itemName.split('-')[0];
        awqLog('loadSetting: ' + itemName);

        await loadJson(conf.ui.settingsStorage.value);
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

    function clickStartButton(p_type) {
        const c_max_time_to_wait = 100;
        let targetButton = conf[conf.commonData.activeType].controls.genrateButton.el;
        awqLog(`clickStartButton: working ${conf.commonData.working} waiting ${conf.commonData.working} type ${p_type}`);
        if(conf.commonData.working || conf.commonData.waiting) return;

        targetButton.click();

        conf.commonData.waiting = true;
        return new Promise(resolve => {
            let retryCount = 0;
            let waitForSwitchInterval = setInterval(function() {
                retryCount++;
                if(retryCount >= c_max_time_to_wait) {
                    targetButton.click(); retryCount = 0;
                    awqLog(`Work has not started after ${c_max_time_to_wait/10} seconds, clicked again`);
                }
                if(!webUICurrentyWorkingOn(p_type)) return;
                conf.commonData.waiting = false;
                awqLog('clickStartButton: work has started');
                clearInterval(waitForSwitchInterval);
                resolve();
            },c_wait_tick_duration);
        });
    }

    function switchTabAndWait(p_type) {
        if(p_type == conf.commonData.activeType) return;
        awqLog('switchTabAndWait: ' + p_type);

        conf.shadowDOM.root.querySelector(conf[p_type].controls.tabButton.sel).click(); // Using .el doesn't work

        conf.commonData.waiting = true;
        return new Promise(resolve => {
            let startingTab = conf.commonData.activeType;
            let waitForSwitchInterval = setInterval(function() {
                if(conf.commonData.activeType !== p_type) return;
                conf.commonData.waiting = false;
                awqLogPublishMsg(`Switched active tab from ${startingTab} to ${conf.commonData.activeType}`);
                clearInterval(waitForSwitchInterval);
                resolve();
            },c_wait_tick_duration);
        });
    }

    function switchTabAndWaitUntilSwitched(p_targetTabName, p_tabConfig) {
        awqLog('switchTabAndWaitUntilSwitched: p_target=' + p_targetTabName + ' p_config=' + p_tabConfig);

        let targetTabConf = p_tabConfig.filter( (elem) => { return elem.name == p_targetTabName })[0];
        function correctTabVisible() {
            return conf.shadowDOM.root.querySelector(targetTabConf.containerSel).style.display == 'none' ? false : true;
        }

        if(correctTabVisible()) return;

        conf.shadowDOM.root.querySelector(targetTabConf.buttonSel).click();

        conf.commonData.waiting = true;
        return new Promise(resolve => {
            let waitForSwitchInterval = setInterval(function() {
                if(!correctTabVisible()) return;
                conf.commonData.waiting = false;
                awqLog('switchTabAndWaitUntilSwitched: switch complete');
                clearInterval(waitForSwitchInterval);
                resolve();
            },c_wait_tick_duration);
        });
    }

    function switchModelAndWait(p_target_model) {
        awqLog('switchModelAndWait:' + p_target_model);
        let selectElem = conf.commonData.sdModelCheckpoint.el;
        let selectElemContainer = conf.commonData.sdModelCheckpointContainer.el;
        let oldValue = selectElem.value;

        if(selectElem.value == p_target_model) return;

        selectElem.value = p_target_model;
        triggerChange(selectElem);
        conf.commonData.waiting = true;
        awqLogPublishMsg(`Waiting for ${p_target_model} to load`);

        return new Promise(resolve => {
            function modelSwitchedAndLoaded() { return selectElem.value == p_target_model && selectElemContainer.querySelector('.wrap div') == null} // Value changed and not loading
            let waitForSwitchInterval = setInterval(function() {
                if(!modelSwitchedAndLoaded()) return;
                clearInterval(waitForSwitchInterval);
                awqLogPublishMsg(`${p_target_model} has completed loading`);
                conf.commonData.waiting = false;
                resolve();
            },c_wait_tick_duration);
        });
    }

    function webUICurrentyWorkingOn(p_itemType) {
        if(p_itemType == 'i2i') {
            return conf.i2i.controls.skipButton.el.getAttribute('style') == 'display: block;';
        } else if (p_itemType == 't2i') {
            return conf.t2i.controls.skipButton.el.getAttribute('style') == 'display: block;';
        } else {
            return conf.ext.controls.loadingElement.el.querySelectorAll('.z-20').length > 0;
        }
    }

    function waitForTaskToComplete(p_itemType) {
        awqLog(`waitForTaskToComplete: Waiting to complete work for ${p_itemType}`);

        conf.commonData.waiting = true;
        return new Promise(resolve => {
            let waitForCompleteInterval = setInterval(function() {
                if(webUICurrentyWorkingOn(p_itemType)) return;
                clearInterval(waitForCompleteInterval);
                awqLog(`Work is complete for ${p_itemType}`);
                conf.commonData.waiting = false;
                conf.commonData.working = false;
                resolve();
            },c_wait_tick_duration);
        });
    }

    function filterPrompt(p_prompt_text, p_neg) {
        let newPromptText = p_prompt_text;
        for(let i=0; i < conf.promptFilter.length; i++) {
            if(!conf.promptFilter[i].hasOwnProperty('pattern') ||
               !conf.promptFilter[i].hasOwnProperty('flags') ||
               !conf.promptFilter[i].hasOwnProperty('replace')) continue;

            let regEx = new RegExp(conf.promptFilter[i].pattern, conf.promptFilter[i].flags);
            let tmpNewPromptText = newPromptText.replace(regEx, conf.promptFilter[i].replace);

            if(tmpNewPromptText !== newPromptText) {
                let changesCount = levenshteinDist(newPromptText, tmpNewPromptText);
                awqLogPublishMsg(`Filtered ${p_neg ? '(neg)' : ''}prompt with filter (${conf.promptFilter[i].desc}), ${changesCount} char changes`);
                awqLog(`Filtered from:<pre>${newPromptText}</pre>to:<pre>${tmpNewPromptText}</pre>`);
                newPromptText = tmpNewPromptText;
            }
        }
        return newPromptText;
    }

    function exportImport() {
        let exportJSON = JSON.stringify({
            savedSetting: conf.savedSetting,
            currentQueue: conf.currentQueue,
            notificationSound: conf.notificationSound,
            maxOutputLines:conf.maxOutputLines,
            autoscrollOutput:conf.autoscrollOutput,
            promptFilter:conf.promptFilter,
            extensionScript:conf.extensionScript,
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
            conf.promptFilter = parsedImportJSON.promptFilter;
            conf.extensionScript = parsedImportJSON.extensionScript;
            localStorage.awqNotificationSound = parsedImportJSON.awqNotificationSound;
            localStorage.awqSavedSetting = JSON.stringify(conf.savedSetting);
            localStorage.awqCurrentQueue = JSON.stringify(conf.currentQueue);
            localStorage.awqNotificationSound = conf.notificationSound ? 1 : 0;
            localStorage.awqMaxOutputLines = conf.maxOutputLines;
            localStorage.awqAutoscrollOutput = conf.autoscrollOutput ? 1 : 0;
            localStorage.awqPromptFilter = JSON.stringify(conf.promptFilter);
            localStorage.awqextensionScript = conf.extensionScript;
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
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    function stringDiffCount(p_str1, p_str2) {
        let count = 0;
        for(let i = 0; i < p_str1.length; i++){
            if(p_str1[i] === p_str2[i]){
                continue;
            };
            count++;
        };
        return count;
    };
    function getCallStack() {
        try {
            throw new Error();
        } catch (err) {
            return err.stack.replace(/^getCallStack.*\n/, '');
        }
    }

    function levenshteinDist(s1, s2) {
            if (s1 === s2) {
                return 0;
            } else {
                var s1_len = s1.length, s2_len = s2.length;
                if (s1_len && s2_len) {
                    var i1 = 0, i2 = 0, a, b, c, c2, row = [];
                    while (i1 < s1_len) {
                        row[i1] = ++i1;
                    }
                    while (i2 < s2_len) {
                        c2 = s2.charCodeAt(i2);
                        a = i2;
                        ++i2;
                        b = i2;
                        for (i1 = 0; i1 < s1_len; ++i1) {
                            c = a + (s1.charCodeAt(i1) === c2 ? 0 : 1);
                            a = row[i1];
                            b = b < a ? (b < c ? b + 1 : c) : (a < c ? a + 1 : c);
                            row[i1] = b;
                        }
                    }
                    return b;
                } else {
                    return s1_len + s2_len;
                }
            }
    };


    function getValueJSON(p_type) {
		let type = p_type || conf.commonData.activeType;
        awqLog('getValueJSON: type=' + type);
        let valueJSON = {type:type};

        if(type == 'ext') { // Needs special saving since it's not an input but a tab switch
            valueJSON.extrasMode = conf.ext.controls.extrasMode.filter((elem) => {
                return conf.shadowDOM.root.querySelector(elem.containerSel).style.display == 'none' ? false : true
            })[0].name;
            valueJSON.extrasResizeMode = conf.ext.controls.extrasResizeMode.filter((elem) => {
                return conf.shadowDOM.root.querySelector(elem.containerSel).style.display == 'none' ? false : true
            })[0].name;
        }
        if(type == 'i2i') { // Needs special saving since it's not an input but a tab switch
            valueJSON.i2iMode = conf.i2i.controls.i2iMode.filter((elem) => {
                return conf.shadowDOM.root.querySelector(elem.containerSel).style.display == 'none' ? false : true
            })[0].name;
        }

        for (let prop in conf[type]) {
            if(prop !== 'controls') {
                try {
                    if(conf[type][prop].el.type == 'fieldset') { // Radio buttons
                        valueJSON[prop] = conf[type][prop].el.querySelector('input:checked').value;
                    } else if(conf[type][prop].el.type == 'checkbox') {
                        valueJSON[prop] = conf[type][prop].el.checked;
                    } else { // Inputs, Textarea
                        valueJSON[prop] = conf[type][prop].el.value;
                        if(prop == 'prompt') valueJSON[prop] = filterPrompt(valueJSON[prop]);
                        if(prop == 'negPrompt' && conf.ui.promptFilterNeg.checked) valueJSON[prop] = filterPrompt(valueJSON[prop], true);
                    }
                } catch(e) {
                    awqLogPublishError(`Failed to retrieve settings for ${type} item ${prop} with error ${e.message}: <pre style="margin: 0;">${e.stack}</pre>`);
                }
            }
        }

        valueJSON.sdModelCheckpoint = conf.commonData.sdModelCheckpoint.el.value;
        return JSON.stringify(valueJSON);
    }
    async function loadJson(p_json) {
        let inputJSONObject = JSON.parse(p_json);
		let type = inputJSONObject.type ? inputJSONObject.type : conf.commonData.activeType;
        let oldData = JSON.parse(getValueJSON(type));
        let waitForThisContainer;
        awqLog('loadJson: ' + type);

        if(inputJSONObject.sdModelCheckpoint) await switchModelAndWait(inputJSONObject.sdModelCheckpoint); // Switch model?

        if(conf.commonData.activeType != inputJSONObject.type) await switchTabAndWait(inputJSONObject.type); // Switch tab?

        if(inputJSONObject.extrasResizeMode) await switchTabAndWaitUntilSwitched(inputJSONObject.extrasResizeMode, conf.ext.controls.extrasResizeMode); // Needs special loading since it's not an input but a tab switch
        if(inputJSONObject.extrasMode) await switchTabAndWaitUntilSwitched(inputJSONObject.extrasMode, conf.ext.controls.extrasMode); // Needs special loading since it's not an input but a tab switch

        if(inputJSONObject.i2iMode) await switchTabAndWaitUntilSwitched(inputJSONObject.i2iMode, conf.i2i.controls.i2iMode); // Needs special loading since it's not an input but a tab switch

        let loadOutput = 'loadJson: loaded: ';

        for (let prop in inputJSONObject) {
            let triggerOnBaseElem = true;
            if(['type','extrasMode','extrasResizeMode','sdModelCheckpoint', 'i2iMode'].includes(prop)) continue;
            try {
                if(oldData[prop] != inputJSONObject[prop]) loadOutput += `${prop}:${oldData[prop]}-->${inputJSONObject[prop]} | `;

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
        awqLog(loadOutput.replace(/\|\s$/, ''));

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