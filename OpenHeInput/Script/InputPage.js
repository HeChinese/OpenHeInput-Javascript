/* 
  * Copyright (c) 2015 Guilin Ouyang. All rights reserved.
  * 
  * Licensed under the Apache License, Version 2.0 (the "License"); 
  * you may not use this file except in compliance with the License. 
  * You may obtain a copy of the License at 
  * 
  *      http://www.apache.org/licenses/LICENSE-2.0 
  * 
  * Unless required by applicable law or agreed to in writing, software 
  * distributed under the License is distributed on an "AS IS" BASIS, 
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. 
  * See the License for the specific language governing permissions and 
  * limitations under the License. 
  */

/** 
    There are several globel objects:
    1. hanZi_index,
    2. hanZi_maBen,
    3. ciZu_index,
    4. ciZu_maBen,
    5. symbole_maBen,
    6. hanZi_list,
*/

/**
    Declare InputPage closure.

    variable:
    1. setting for heInput setting, such as simplify/traditional, mainkeyboard Chinese/English, number pad Chinese/Number
    2. heClient for all related to HeInput

    HeInput entry point.
*/
var inputPage = function () {

    var isShiftDown = false; // true for shift key down, false for else,
    var isCtrlDown = false; // true for control key down, false for else,
   
    //setting belong to input page.
    var setting = Setting();
    var heClient = HeClient();

    function init() {
        setupPage();
        //heClient.init();
        var heTextArea = document.getElementById("heTextArea");
        heTextArea.value = "";
        heTextArea.onkeydown = handleKeyDownEvent;
        heTextArea.onkeypress = handleKeyPressEvent;
        heTextArea.onkeyup = handleKeyUpEvent;
    }

    function handleKeyDownEvent(e) {

        //console.log("KeyDown.which = " + e.which);

        // Control key down
        if (e.which == 17) {

            isCtrlDown = true;
            //if control key down at same time, do not process
        }
        else {
            isCtrlDown = false;
        }

        //if control key down at same time, do not process
        if (e.ctrlKey)
            return true;

        // Shift key down
        if (e.which == 16) {
            isShiftDown = true;
        }
        else {
            isShiftDown = false;
        }

        var needFurtherProcess = heClient.handleKeyDownEvent(e, setting);

        if (!needFurtherProcess) {
            setting.setIsNumberInput(false);
        }
        else {
            // number pad 0...9 || main keyboard 0...9
            if (e.which >= 96 && e.which <= 105 || e.which >= 48 && e.which <= 57) {
                setting.setIsNumberInput(true);
            }

            // backspace need to toggle isNumberInput value
            if (e.which == 8)
                setting.toggleIsNumberInput();
        }

        return needFurtherProcess;
    }

    function handleKeyPressEvent(e) {

        if (setting.getIsNumberInput()) {
            return true;
        }

        var needFurtherProcess = heClient.handleKeyPressEvent(e, setting);

        if (!needFurtherProcess) {
            //setting.setIsNumberInput(false);
        }

        return needFurtherProcess;
    }

    /*
    When only shift key down and up without other key interupt, will change to English input mode.
    When only ctrol key down and up without other key interupt, will change to HeInput mode.
    KeyUp event is use to detect these case.
    //*/
    function handleKeyUpEvent(e) {

        //console.log("KeyUp e.which: " + e.which);
        if ((e.which == 16) && isShiftDown) {

            var mainKeyboardMode = setting.InputMode.EnglishMode;
            var numPadMode = setting.numPadInputMode();

            setting.settingKeyboardInputMode(mainKeyboardMode, numPadMode);

            isShiftDown = false;
            document.getElementById("englishInput").checked = true;
            heClient.hideInputDisplay();
        }
        else if ((e.which == 17) && isCtrlDown) {

            var mainKeyboardMode = setting.InputMode.SimplifiedChineseMode;
            var numPadMode = setting.numPadInputMode();

            setting.settingKeyboardInputMode(mainKeyboardMode, numPadMode);

            isCtrlDown = false;
            document.getElementById("heInput").checked = true;
        }
    }

    function setupPage() {

        var heTextArea = document.getElementById('heTextArea');

        heTextArea.style.width = (window.innerWidth > 520 ? 480 : window.innerWidth - 40) + "px";
        var height = (window.innerHeight > 320 ? 280 : window.innerHeight - 40);
        heTextArea.style.height =  height + "px";
    }

    function copyAll() {
        window.prompt("Copy to clipboard: Ctrl+C, Enter", document.getElementById('heTextArea').value);
        document.getElementById('heTextArea').focus();
    }

    function changeKeyboardSetting() {

        //console.log("changeKeyboardSetting......");
        var mainKeyboardMode = setting.mainKeyboardInputMode();
        var numPadMode = setting.numPadInputMode();

        if (document.getElementById("mainKeyboardOnly4HeInput").checked) {
            mainKeyboardMode = setting.InputMode.SimplifiedChineseMode;
            numPadMode = setting.InputMode.NumberMode;
        }
        else if (document.getElementById("numPadOnly4HeInput").checked) {
            mainKeyboardMode = setting.InputMode.EnglishMode;
            numPadMode = setting.InputMode.SimplifiedChineseMode;
        }
        else  // if(document.getElementById("both4HeInput").checked)
        {
            mainKeyboardMode = setting.InputMode.SimplifiedChineseMode;
            numPadMode = setting.InputMode.SimplifiedChineseMode;
        }

        setting.settingKeyboardInputMode(mainKeyboardMode, numPadMode);

        document.getElementById('heTextArea').focus();
    }

    function hide_show_image(id) {
        var img = document.getElementById(id);
        var assistantSec = document.getElementById('assistantSection');
        if (img.style.display == 'block' || img.style.display == '') {
            img.style.display = 'none';
            assistantSec.style.display = 'block';
            document.getElementById('hide_show_btn').value = "显示字根表(Show Image)";
        }
        else {
            img.style.display = 'block';
            assistantSec.style.display = 'none';
            document.getElementById('hide_show_btn').value = "输入设定(Setting)";
        }

        document.getElementById('heTextArea').focus();
    }

    function toggleHeInput() {

        var mainKeyboardMode = setting.mainKeyboardInputMode();
        var numPadMode = setting.numPadInputMode();

        if (document.getElementById("heInput").checked) {

            document.getElementById('both4HeInput').checked = true;

            mainKeyboardMode = setting.InputMode.SimplifiedChineseMode;
            numPadMode = setting.InputMode.SimplifiedChineseMode;

            setting.settingKeyboardInputMode(mainKeyboardMode, numPadMode);
        }
        else {
            mainKeyboardMode = setting.InputMode.EnglishMode;
            numPadMode = setting.InputMode.NumberMode;

            setting.settingKeyboardInputMode(mainKeyboardMode, numPadMode);
        }        
        document.getElementById('heTextArea').focus();
    }

    function findDanZiCode() {

        var danZi = document.getElementById('DanZi_Code_Wanted').value.charAt(0);
        var result = heClient.heDataServer.provideDanZiCode(danZi);
        document.getElementById('Code_Result').innerHTML = result;
    }

    return {
        init: init,
        copyAll: copyAll,
        findDanZiCode: findDanZiCode,
        toggleHeInput: toggleHeInput,
        changeKeyboardSetting: changeKeyboardSetting,
        hide_show_image: hide_show_image
    }
}();