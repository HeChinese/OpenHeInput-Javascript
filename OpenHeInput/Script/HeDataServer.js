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

/* Declare HeDataServer closure
 * which includes:
 * 1. TypingState, 
 * 2. several input engines which find Chinese words and phrases for given codes
 * 3. provide interface for client use.
*/

function HeDataServer() {

    var typingState = TypingState();

    var heMaEngine = HeMaEngine();
    var symbolEngine = SymbolEngine();
    var menuEngine = MenuEngine();

    function typeCharAndNumber(typedMa,setting) {

        //console.log("passedMa3:" + typedMa);
        typingState.typeMa(typedMa);

        if (typingState.getMaShu() == 0) {
            return null;
        }

        //console.log("typingState.m1:" + typingState.getMa1());

        var m1 = typingState.getMa1();
        switch (m1) {
            case 0:
                return menuEngine.formCandArray(typingState);
                break;
            case 6: //for puncturations
            case 7: //for math symbols
            case 8://for numbers
            case 9://for English chars
            case 62:
                return symbolEngine.formCandArray(typingState);
                break;
            default:
                if (m1 > 0 && m1 <= 55) {
                    return heMaEngine.formCandArray(typingState, setting);
                }
                break;
        }
    }

    function provideDanZiCode(danZi) {

        var result = "";
        var index = danZi_List.indexOf(danZi);
        if (index > -1) {
            var maStr = danZi_List.substr(index + 1, 3);
            var m1 = CharToMa[maStr.charAt(0)];
            var m2 = CharToMa[maStr.charAt(1)];
            var m3 = CharToMa[maStr.charAt(2)];

            result = danZi
                    + ': [' + maToCChar[m1]
                    + maToCChar[m2]
                    + maToCChar[m3] + ']' + "  "
                    + m1 + " "
                    + m2 + " "
                    + m3;
        }
        return result;
    }

    function provideZiCiObject(ziCiStr) {

        var ziCodeStr1, ziCodeStr2, ziCodeStr3, ziCodeStr4;
        var ziIndex = 0;

        var ziCiObj = { "ZiCi": "", "M1": 0, "M2": 0, "M3": 0, "M4": 0 };
        ziCiObj.ZiCi = ziCiStr;

        switch (ziCiStr.length) {

            case 1:
                ziIndex = danZi_List.indexOf(ziCiStr);
                if (ziIndex == -1)
                    break;
                ziCodeStr1 = danZi_List.substr(ziIndex + 1, 3);
                ziCiObj.M1 = CharToMa[ziCodeStr1.charAt(0)];
                ziCiObj.M2 = CharToMa[ziCodeStr1.charAt(1)];
                ziCiObj.M3 = CharToMa[ziCodeStr1.charAt(2)];
                break;
            case 2:
                ziIndex = danZi_List.indexOf(ziCiStr.charAt(0));
                if (ziIndex == -1)
                    break;
                ziCodeStr1 = danZi_List.substr(ziIndex + 1, 3);

                ziIndex = danZi_List.indexOf(ziCiStr.charAt(1));
                if (ziIndex == -1)
                    break;
                ziCodeStr2 = danZi_List.substr(ziIndex + 1, 3);

                ziCiObj.M1 = CharToMa[ziCodeStr1.charAt(0)];
                ziCiObj.M2 = CharToMa[ziCodeStr1.charAt(1)];
                ziCiObj.M3 = CharToMa[ziCodeStr2.charAt(0)];
                ziCiObj.M4 = CharToMa[ziCodeStr2.charAt(1)];

                break;
            case 3:
                ziIndex = danZi_List.indexOf(ziCiStr.charAt(0));
                if (ziIndex == -1)
                    break;
                ziCodeStr1 = danZi_List.substr(ziIndex + 1, 3);

                ziIndex = danZi_List.indexOf(ziCiStr.charAt(1));
                if (ziIndex == -1)
                    break;
                ziCodeStr2 = danZi_List.substr(ziIndex + 1, 3);

                ziIndex = danZi_List.indexOf(ziCiStr.charAt(2));
                if (ziIndex == -1)
                    break;
                ziCodeStr3 = danZi_List.substr(ziIndex + 1, 3);

                ziCiObj.M1 = CharToMa[ziCodeStr1.charAt(0)];
                ziCiObj.M2 = CharToMa[ziCodeStr2.charAt(0)];
                ziCiObj.M3 = CharToMa[ziCodeStr3.charAt(0)];
                ziCiObj.M4 = CharToMa[ziCodeStr3.charAt(1)];
                break;
            case 4:
                ziIndex = danZi_List.indexOf(ziCiStr.charAt(0));
                if (ziIndex == -1)
                    break;
                ziCodeStr1 = danZi_List.substr(ziIndex + 1, 3);

                ziIndex = danZi_List.indexOf(ziCiStr.charAt(1));
                if (ziIndex == -1)
                    break;
                ziCodeStr2 = danZi_List.substr(ziIndex + 1, 3);

                ziIndex = danZi_List.indexOf(ziCiStr.charAt(2));
                if (ziIndex == -1)
                    break;
                ziCodeStr3 = danZi_List.substr(ziIndex + 1, 3);

                ziIndex = danZi_List.indexOf(ziCiStr.charAt(4));
                if (ziIndex == -1)
                    break;
                ziCodeStr4 = danZi_List.substr(ziIndex + 1, 3);

                ziCiObj.M1 = CharToMa[ziCodeStr1.charAt(0)];
                ziCiObj.M2 = CharToMa[ziCodeStr2.charAt(0)];
                ziCiObj.M3 = CharToMa[ziCodeStr3.charAt(0)];
                ziCiObj.M4 = CharToMa[ziCodeStr4.charAt(0)];
                break;
            default:
                break;
        }

        return ziCiObj;
    }

    var CharToMa = {
        "a": 35, "b": 51, "c": 53, "d": 33,
        "e": 13, "f": 32, "g": 31, "h": 41, "i": 23, "j": 42, "k": 43, "l": 44, "m": 0,
        "n": 45, "o": 24, "p": 25, "q": 15, "r": 12, "s": 34, "t": 11, "u": 22, "v": 52,
        "w": 14, "x": 54, "y": 21, "z": 55
    };

    var maToCChar = {
        0: '', 11: '一', 12: '彐', 13: "匚", 14: "又", 15: "王",
        21: '丨', 22: "凵", 23: "冂", 24: "口", 25: "日",
        31: '十', 32: "土", 33: "艹", 34: "木", 35: "钅",
        41: '丿', 42: "亻", 43: "人", 44: "女", 45: '豸',
        51: '亠', 52: '冫', 53: "氵", 54: '火', 55: "心"
    };

    /*
    function provideMaShu() {
        return typingState.provideMaShu();
    }
    //*/

    return {
        
        typingState: typingState,
        typeCharAndNumber: typeCharAndNumber,
        provideDanZiCode: provideDanZiCode,
        provideZiCiObject: provideZiCiObject
    }
}