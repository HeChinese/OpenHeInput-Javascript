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

/** Declear heClient closure.
    It is bridge between input page and HeDataServer
    process input before call HeDataServer.
*/

function HeClient() {

    var danYinHaoOpen = false;
    var shuangYinHaoOpen = false;
    var inputString = '';
    var candList = new Array();
    var selectedIndex = 0;

    var maSpan = document.getElementById('MaSpan');
    var cCharSpan = document.getElementById('CCharSpan');
    var candSelect = document.getElementById('CandSelect');

    var heDataServer = HeDataServer();
    var candBook = candidateBook();

    // if keydown event return false, 
    // the keypress event will pass (don't process)
    // process all necessary key events except direct punctuation input from main keyboard 
    function handleKeyDownEvent(e, setting) {

        //console.log("KeyDown.which = " + e.which);
        var typedMa = null;
        var typedMa = keyDownWhichToMa[e.which];
        var retCandArray = new Array();

        var isMainKeyboardHeInputMode = (setting.mainKeyboardInputMode() < setting.InputMode.HeInputMode);
        var isNumPadHeInputMode = (setting.numPadInputMode() < setting.InputMode.HeInputMode);

        if (!isMainKeyboardHeInputMode) {

            if (e.which >= 65 && e.which <= 90 || e.which == 32) { // 32: space
                //26 english char typed and setting to no-HeInputMode, then do not process it
                return true;
            }
        }
        else if (e.which >= 96 && e.which <= 105 && !isNumPadHeInputMode) {
            //NumPad number 0~9 and setting to no HeInputMode, then do not process it
            return true;
        }

        var maShu = heDataServer.typingState.getMaShu();

        //ShuMa typing and process
        if (typedMa >= 0 && typedMa <= 55) {

            // Main Keyboard number key
            if (e.which >= 48 && e.which <= 57) {

                if (heDataServer.typingState.isMenuDisplayed()){
               
                    //for typeMa = 0,1,2,...9
                    if (typedMa < candList.length) {
                        selectedIndex = typedMa;
                        menuSelected(e);                       
                    }
                    return false;
                }

                //Using main keyboard number key to select and input candidate.
                if (candList.length > 0) {

                    if (typedMa > candBook.getPageSize()-1)
                        return false;

                    inputString = String(candList[candBook.getPageStart() + typedMa]).match(/[^0-9\s]+/) + "";
                    insertText(e.target, inputString);
                    hideInputDisplay();

                    return false;
                }
                else {
                    return true;
                }
            }

            // typeMa == 0 and menu display
            if (heDataServer.typingState.isMenuDisplayed()) {

                // repeat input previous text 
                if (typedMa == 0) {
                    insertText(e.target, inputString);
                    hideInputDisplay();
                    return false;
                }
                //else continue;
            }
            
            if (maShu == 8 && candList.length > 0) {

                // whe typedMa == 0, Change select down or up with shift key
                if (typedMa == 0) {

                    if (e.shiftKey) {//true if the shift key was down when the event was fired. false otherwise.
                        if (selectedIndex == 0)
                            selectedIndex = candBook.getPageSize() - 1;
                        else
                            selectedIndex--;
                    }
                    else { // shiftkey is not down at same time.
                        if (selectedIndex == (candBook.getPageSize() - 1))
                            selectedIndex = 0;
                        else
                            selectedIndex++;
                    }

                    changeSelection();
                    return false;
                }

                // automatically push selection to 
                inputString = String(candList[candBook.getPageStart() + selectedIndex]).match(/[^0-9\s]+/) + "";
                insertText(e.target, inputString);
                hideInputDisplay();
                // and continue
            }

            retCandArray = heDataServer.typeCharAndNumber(typedMa, setting);
            if (retCandArray != null && retCandArray.length > 0) {
                candList = retCandArray;
                showInputDisplay(e.target, e.target.selectionEnd);
            }
            else {
                //retCandArray.length == 0;
                maShu = heDataServer.typingState.getMaShu();
                if (maShu > 5) {
                    // where maShu <= 4 such as m1m2 = 1114, 1115, and more has no candidate,
                    // When maShu <- 4, need to keep this ma for following cizu typing
                    //maShu >= 6, and retCandArray is emply, type back, but don't change display
                    heDataServer.typingState.typeBack();

                    //if typedMa == 0, change candidate selection
                    if (typedMa == 0) {
                        if (candList.length > 0) {
                            if (selectedIndex == (candList.length - 1))
                                selectedIndex = 0;
                            else
                                selectedIndex++;
                            changeSelection();
                        }
                    }
                }
                else {  //m1m2 = 1114, 1115, and more has no candidate,but need to update typed codes
                    showInputDisplay(e.target, e.target.selectionEnd);
                }
            }
            return false;
        }

        var actionKey = null;
        var actionKey = keyDownWhichToFunctionKey[e.which];

        if (actionKey != null && (isMainKeyboardHeInputMode || isNumPadHeInputMode)) {

            switch (actionKey) {
                case 'escape':
                    {
                        hideInputDisplay();
                        return true;
                    }
                    break;
                case 'backspace':
                case 'numPadDot':
                    {
                        if (candList.length > 0) {

                            retCandArray = heDataServer.typeCharAndNumber(-100, setting);
                            if (retCandArray != null && retCandArray.length > 0) {
                                candList = retCandArray;
                                showInputDisplay(e.target, e.target.selectionEnd);
                            }
                            else { //retCandArray == 0, there are two case, 1) maShu == 0; 2) when m1m2 = 1113,1114,etc
                                //After typeCharAndNumber, need getMaShu again.
                                maShu = heDataServer.typingState.getMaShu();
                                if (maShu == 0) {
                                    hideInputDisplay();
                                }
                                //else do not change display, it is diferrent from increasing mashu, to decreasing mashu.
                            }
                            return false;
                        }
                        else { //maShu = 0
                            return true; //
                        }
                    }
                    break;
                case 'return':
                case 'numPadEnter': //e.which is same as 'return'
                    {
                        if (heDataServer.typingState.isMenuDisplayed()) {
                            menuSelected(e);
                            return false;
                        }

                        if (candList.length > 0) {
                            inputString = String(candList[candBook.getPageStart() + selectedIndex]).match(/[^0-9\s]+/) + "";
                            insertText(e.target, inputString);
                            hideInputDisplay();
                            return false;
                        }
                        else {
                            return true;
                        }
                    }
                    break;
                case 'space':
                    {
                        if (heDataServer.typingState.isMenuDisplayed()) {
                            menuSelected(e);
                            return false;
                        }

                        if (candList.length > 0) {
                            inputString = String(candList[candBook.getPageStart() + selectedIndex]).match(/[^0-9\s]+/) + "";
                        }
                        else {
                            if (setting.getIsNumberInput()) {
                                //inputString = ' ';
                                return true;
                            }
                            else
                                inputString = "　";
                        }

                        insertText(e.target, inputString);
                        hideInputDisplay();
                        return false;
                    }
                    break;
                case 'down':
                case 'numPadPlus':
                    {
                        if (candList.length <= 0)
                            return true;

                        candBook.nextPage();
                        if (selectedIndex == (candBook.getPageSize() - 1))
                            selectedIndex = 0;
                        else
                            selectedIndex++;

                        changeSelection();
                        return false;
                    }
                    break;
                case 'up':
                case 'numPadMinus':
                    {
                        if (candList.length <= 0)
                            return true;

                        candBook.nextPage();
                        if (selectedIndex == 0)
                            selectedIndex = candBook.getPageSize() - 1;
                        else
                            selectedIndex--;

                        changeSelection();
                        return false;
                    }
                    break;
                case "right":
                case 'pagedown':
                    {
                        if (candList.length <= 0)
                            return true;
                        candBook.nextPage();
                        updateCandPage();
                        return false;
                    }
                    break;
                case 'left':
                case 'pageup':
                    {
                        if (candList.length <= 0)
                            return true;

                        candBook.previousPage();
                        updateCandPage();
                        return false;
                    }
                    break;
                case 'home':
                    {
                        if (candList.length <= 0)
                            return true;

                        candBook.home();
                        updateCandPage();
                        return false;
                    }
                    break;
                case 'end':
                    {
                        if (candList.length <= 0)
                            return true;

                        candBook.end();
                        updateCandPage();
                        return false;
                    }
                    break;
                case 'numPadStar':
                    {
                        console.log("Number pad star key keydown.");
                    }
                    break;
                case 'numPadSlash':
                    {
                        console.log("Number pad slash key keydown.");
                    }
                    break;
                default:
                    break;
            }
        }
        return true;
    }

    function menuSelected(e) {

        var typedMa = 0;
        switch (selectedIndex) {
            case 0: //repeat last input
                insertText(e.target, inputString);
                hideInputDisplay();
                break;
            case 1:
                typedMa = 11;
                break;
            case 2:
                typedMa = 12;
                break;
            case 3:
                typedMa = 13;
                break;
            case 4:
                typedMa = 14;
                break;
            case 5:
                typedMa = 15;
                break;
            case 6:
                {
                }
                break;
            case 7:
                {
                }
                break;
            case 8:
                {
                }
                break;
            default:
                break;
        }

        if (typedMa >= 11) {
            var retCandArray = heDataServer.typeCharAndNumber(typedMa);
            if (retCandArray != null && retCandArray.length > 0) {
                candList = retCandArray;
                showInputDisplay(e.target, e.target.selectionEnd);
            }
        }
    }

    // only handle direct punctuation input from main keyboard
    function handleKeyPressEvent(e, setting) {

        //console.log("KeyPress.which = " + e.which);

        if (setting.mainKeyboardInputMode()== setting.InputMode.EnglishMode) {
            //26 english char typed and setting to no-HeInputMode, then do not process it
            return true;
        }

        // previous input is number
        if (setting.getIsNumberInput()) {
            return true;
        }

        var retCandArray = new Array();

        var typedPunct = null;
        typedPunct = keyPressWhichToPunctuation[e.which];
        if (typedPunct != null) {

            if (heDataServer.typingState.isMenuDisplayed()) {
                //do nothing
                return false;
            }
            
            if (e.which == 39) { // danYinHao

                if (danYinHaoOpen) {
                    typedPunct = '’';
                }
                else {
                    typedPunct = '‘';
                }
                danYinHaoOpen = !danYinHaoOpen;
            }
            else if (e.which == 34) { //ShuanYinHao

                if (shuangYinHaoOpen) {
                    typedPunct = '”';
                }
                else {
                    typedPunct = '“';
                }
                shuangYinHaoOpen = !shuangYinHaoOpen;
            }

            if (candList.length > 0) {

                inputString = String(candList[candBook.getPageStart() + selectedIndex]).match(/[^0-9\s]+/) + typedPunct;

                insertText(e.target, inputString);
                hideInputDisplay();
            }
            else {
                insertText(e.target, typedPunct);
            }
            return false;
        }
        return true;
    }

    function changeSelection() {
        candSelect.selectedIndex = selectedIndex;
    }

    function insertText(target, text) {

        var startPos = target.selectionStart;
        var endPos = target.selectionEnd;
        var scrollTop = target.scrollTop;

        target.value = target.value.substring(0, startPos) + text + target.value.substring(endPos, target.value.length);
        target.focus();
        target.selectionStart = startPos + text.length;
        target.selectionEnd = startPos + text.length;
        target.scrollTop = scrollTop;

        //Following trick fix for HeTraining page <input type='text'>
        //originally <input type='text'> onchange event only trigered when loose focus 
        target.onchange();
    }

    function showInputDisplay(target, position) {

        var maShu = heDataServer.typingState.getMaShu();

        if (maShu == 1 || maShu == 2) {

            var coordinates = getCaretCoordinates(target, position);

            var top = target.offsetTop - target.scrollTop + coordinates.top + 24;
            var left = target.offsetLeft - target.scrollLeft + coordinates.left + 4;

            document.getElementById('inputDisplay').style.visibility = 'visible';

            document.getElementById('inputDisplay').style.top = top + "px";
            document.getElementById('inputDisplay').style.left = left + "px";
        }

        //update typing labels
        maSpan.innerHTML = heDataServer.typingState.provideMaString();
        cCharSpan.innerHTML = heDataServer.typingState.provideCCharString();

        //update candList
        if (candList == null || candList.length <= 0) {

            //candSelect.options.length = 0;
            return;
        }
        else if (candList.length > 0) {

            candBook.init(candList.length);
            updateCandPage();
        }

    }

    function updateCandPage() {

        candSelect.options.length = 0;

        var pageSize = candBook.getPageSize();

        console.log("Cand Length: " + pageSize);

        for (i = 0; i < pageSize; i++) {

            candSelect.options[i] = new Option(i + ' ' + candList[i + candBook.getPageStart()]);
        }
        candSelect.size = pageSize > 2 ? pageSize : 2;

        selectedIndex = 0;
        candSelect.selectedIndex = 0;
    }

    function hideInputDisplay() {

        document.getElementById('inputDisplay').style.visibility = 'hidden';

        candList = new Array();
        selectedIndex = 0;
        candSelect.options.length = 0;

        heDataServer.typingState.clearState();
    }

    /**
    KeyDown event includes all key event, keypress repeated some keydown event.
    in keypress event, A,a, are different e.which, 
    in keydown event, A, a, use same e.which,
    
    So use keydown event to process shuma input

    in keypress, number key on main kayboard and number pad using same e.which
    in keydown event, number key useing different e.which on main keyboard and number pad.

    Since HeInput do not use number key on main keyboard as input.
    So HeInput use keydown event to process number key.

    however
    in keypress event punctuation key on same key (one with shiftkey down) has different e.which
    in keydown event punctuation key on same key has same e.which
    So use keypress event to process punctuation key is easier.

    */
    var keyDownWhichToMa = {
        //65 - 90, a - z
        //*
        65: 35, 66: 51, 67: 53, 68: 33, 69: 13,
        70: 32, 71: 31, 72: 41, 73: 23, 74: 42,
        75: 43, 76: 44, 77: 0, 78: 45, 79: 24,
        80: 25, 81: 15, 82: 12, 83: 34, 84: 11,
        85: 22, 86: 52, 87: 14, 88: 54, 89: 21, 90: 55,
        //*/
        // 96 to 105: 0 to 9
        //Number pad
        96: 0, 97: 1, 98: 2, 99: 3, 100: 4, 101: 5, 102: 6, 103: 7, 104: 8, 105: 9,

        // 48 to 57: 0 to 9
        // number on main keyboard, only used for select and input candidate.
        48: 0, 49: 1, 50: 2, 51: 3, 52: 4, 53: 5, 54: 6, 55: 7, 56: 8, 57: 9
    };

    /* Keypress is very much like the keydown event, 
        except it isn't triggered for modifier keys like 'shift', 'esc', and 'delete'. 
        Keypress is for printable key,
        Not for shift, ctrl, alt, fn, arrow keys, page down and up, backspace, delete, Tab, CapsLock
        Do for characters, numbers, punctuals, symbols space, return.
        specially do for space, return.

        So use keyprocess to process shuma input.
        using e.which value to shuma
        do not process space and return key here
    */
    /*
    var keyPressWhichToMa = {
        
        97: 35, 98: 51, 99: 53, 100: 33, 101: 13,
        102: 32, 103: 31, 104: 41, 105: 23, 106: 42,
        107: 43, 108: 44, 109: 0, 110: 45, 111: 24,
        112: 25, 113: 15, 114: 12, 115: 34, 116: 11,
        117: 22, 118: 52, 119: 14, 120: 54, 121: 21, 122: 55
        //,77 : 16  // upcase 'M'
   
        // same for number pad and main keyboard,
        //so cann't process number event on keyPress event
        //48: 0, 49: 1, 50: 2, 51: 3, 52: 4, 53: 5, 54: 6, 55: 7, 56: 8, 57: 9,
    };
    /*
     it is good to process keypress event for to punctuation
     since with shift key down it will give different value for same key.
     for keyPress event
    */
    var keyPressWhichToPunctuation = {
        44: '，', 46: '。', 47: '、', 59: '；', 39: '‘',
        91: '［', 93: '］', 92: '＼', 60: '《', 62: '》',
        63: '？', 58: '：', 34: '“', 123: '｛', 125: '｝',
        124: '｜'
        //, 32: '　'  //space
    }

    /*
    var keyDownWhichToPunctuation = {
        188: '，', 190: '。', 191: '、', 186: '；', 222: '‘',
        219: '［', 221: '］', 220: '＼', 188: '《', 190: '》',
        191: '？', 186: '：', 186: '“', 219: '｛', 221: '｝',
        220: '｜', 32: '　'  //the last one is space
    }
    //*/

    /* For keyDown event
        Use JQuery e.which value
    */
    var keyDownWhichToFunctionKey = {
        //main keyboard
        8: "backspace",
        //9: "tab",
        13: "return",
        //19: "pause",
        27: "escape",
        32: "space",
        33: "pageup", 34: "pagedown",
        35: "end", 36: "home",
        37: "left", 38: "up",
        39: "right", 40: "down",
        //44: "printscreen", 45: "insert", 46: "delete"
        //112: "f1", 113: "f2", 114: "f3", 115: "f4", 116: "f5", 117: "f6", 118: "f7",
        //119: "f8", 120: "f9", 121: "f10", 122: "f11", 123: "f12",
        //144: "numlock", 145: "scrolllock"

        //Numpad
        13: 'numPadEnter',
        106: 'numPadStar',
        107: 'numPadPlus',
        109: 'numPadMinus',
        110: 'numPadDot',
        111: 'numPadSlash'

    };

    return {
        heDataServer: heDataServer,
        handleKeyDownEvent: handleKeyDownEvent,
        handleKeyPressEvent: handleKeyPressEvent,
        hideInputDisplay: hideInputDisplay
    }
};

function candidateBook() {

    var candLength = 0;
    var pageSize = 10;

    var pageIndex = 0;

    function init(length) {

        candLength = length;
        pageIndex = 0;
    }

    function nextPage() {

        console.log("Cand Length 0:"+candLength);
        if ((pageIndex + 1) * pageSize < candLength) {
            pageIndex++;
        }
    }

    function previousPage() {

        if (pageIndex > 0) {
            pageIndex--;
        }
    }

    function home() {
        pageIndex = 0;
    }

    function end() {
        pageIndex = Math.floor((candLength - 1) / pageSize);
    }

    return {
        init: init,
        nextPage: nextPage,
        previousPage: previousPage,
        home: home,
        end: end,
        getPageStart: function () { return pageIndex * pageSize; },
        getPageSize: function () { return (pageIndex + 1) * pageSize < candLength ? pageSize : candLength - pageIndex * pageSize; }
    }
}; //candidateWindow Closure
