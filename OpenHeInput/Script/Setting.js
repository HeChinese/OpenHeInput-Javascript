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

/* Declare Setting closure
  Setted by page or user
  passed by client to data server
*/
function Setting() {
  
    // object to simulate enum 
    var InputMode = {

        SimplifiedChineseMode: 0,
        TraditionalChineseMode: 1,

        PinYinMode: 3,
        HeEnglishMode: 4,

        NumberModeTemp: 7,  //input number between HeMaMode input, * key can be used for change back to HeMa Mode
        LianXiangMode: 8,

        HeInputMode: 10,

        EnglishMode: 15,
        NumberMode: 16
    }

    var isNumberInput = false; // true for number input, used for determine following dot key (.or。)
    var mainKeyboardInputMode = InputMode.SimplifiedChineseMode;
    var numPadInputMode = InputMode.SimplifiedChineseMode;

    function settingKeyboardInputMode(mainKeyboardMode, numPadMode) {

        mainKeyboardInputMode = mainKeyboardMode;
        numPadInputMode = numPadMode;
    }
   
    return {

        InputMode: (function () { return InputMode; })(),
        mainKeyboardInputMode: function () { return mainKeyboardInputMode; },
        numPadInputMode: function () { return numPadInputMode; },

        settingKeyboardInputMode: settingKeyboardInputMode,
        setIsNumberInput: function (value) { isNumberInput = value; },
        getIsNumberInput: function () { return isNumberInput; },
        toggleIsNumberInput: function () { isNumberInput = !isNumberInput;}
    }
}