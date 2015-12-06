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

// Declare HeEngine closure
function HeMaEngine() {

    //danZi index
    var beginIndex = 0, endIndex = 0;
    var beginMaBen = 0; endMaBen = 0;
    var subS = "";

    //Cizu index
    var beginCiZuIndex = 0, endCiZuIndex = 0;
    var beginCiZuMaBen = 0; endCiZuMaBen = 0;

    var candStr = ""; //substring in danZi_maben, generate when maShu = 4, can be used by maShu = 5,6,7,8
    var ciZuCand = ""; //substring in ciZu_maBen, generate with maShu = 6, can be used by maShu = 6,7,8

    //Number_To_Char function
    var MaToChar = {
        0: "m", 11: "t", 12: "r", 13: "e", 14: "w", 15: "q",
        21: "y", 22: "u", 23: "i", 24: "o", 25: "p",
        31: "g", 32: "f", 33: "d", 34: "s", 35: "a",
        41: "h", 42: "j", 43: "k", 44: "l", 45: "n",
        51: "b", 52: "v", 53: "c", 54: "x", 55: "z"
    };

    //Char_To_Number function
    var CharToMa = {
        "a": 35, "b": 51, "c": 53, "d": 33,
        "e": 13, "f": 32, "g": 31, "h": 41, "i": 23, "j": 42, "k": 43, "l": 44, "m": 0,
        "n": 45, "o": 24, "p": 25, "q": 15, "r": 12, "s": 34, "t": 11, "u": 22, "v": 52,
        "w": 14, "x": 54, "y": 21, "z": 55
    };

    //Next_Char function
    var MaToNextShuMa = {
        0: 11,
        11: 12, 12: 13, 13: 14, 14: 15, 15: 21,
        21: 22, 22: 23, 23: 24, 24: 25, 25: 31,
        31: 32, 32: 33, 33: 34, 34: 35, 35: 41,
        41: 42, 42: 43, 43: 44, 44: 45, 45: 51,
        51: 52, 52: 53, 53: 54, 54: 55, 55: 0
        //since danZi_index 00 follow 55
    };

    var MaToNextChar = {
        0: "t", 11: "r", 12: "e", 13: "w", 14: "q", 15: "y",
        21: "u", 22: "i", 23: "o", 24: "p", 25: "g",
        31: "f", 32: "d", 33: "s", 34: "a", 35: "h",
        41: "j", 42: "k", 43: "l", 44: "n", 45: "b",
        51: "v", 52: "c", 53: "x", 54: "z", 55: "m"
        //since danZi_index 00 follow 55
    };

    // 
    function getDanZiIndex(typingState) {

        var maShu = typingState.getMaShu();
        var m1 = typingState.getMa1();
        var m2 = typingState.getMa2();
        var m3 = typingState.getMa3();
        var m4 = typingState.getMa4();

        var nextShuMa = 0;

        switch (maShu) {
            case 0:
                beginIndex = 0;
                endIndex = 0;//danZi_Index.length -1; //pass the string by 1
                beginMaBen = 0;
                endMaBen = 0;//danZi_MaBen.length -1;
                break;
            case 1:
            case 2:
                if (m1 == 0) {
                    return false;
                }

                beginIndex = danZi_Index.indexOf(MaToChar[m1]);//.toUpperCase());
                //Get index substring between m1 and next(m1)
                if (m1 == 55) {
                    //get substring from m1==55 to end;
                    subS = danZi_Index.slice(beginIndex);
                }
                else {
                    endIndex = danZi_Index.indexOf(MaToNextChar[m1]);
                    subS = danZi_Index.substring(beginIndex, endIndex);
                }

                //m2=0,
                //works, but I'm not sure it works with other browsers
                //endMaBen=parseInt((danZi_Index.substr(beginIndex+3,12)).match(/[A-Z](\d{1,5})/)[1]);
                beginIndex = subS.indexOf(MaToChar[0].toUpperCase());
                //endIndex is used for finding endMaBen
                endIndex = subS.indexOf(MaToChar[11].toUpperCase());

                beginMaBen = parseInt(subS.substr(beginIndex + 1, 5));
                endMaBen = parseInt(subS.substr(endIndex + 1, 5));

                break;
            case 3:
            case 4:
                //case 5:
                //case 6:
                //case 7:
                //case 8:
                {
                    beginIndex = danZi_Index.indexOf(MaToChar[m1]);//.toUpperCase());
                    if (m1 == 55) {
                        //endIndex=danZi_Index.length-1;
                        subS = danZi_Index.slice(beginIndex);
                    }
                    else {
                        endIndex = danZi_Index.indexOf(MaToNextChar[m1]);
                        subS = danZi_Index.substring(beginIndex, endIndex);
                    }


                    beginIndex = subS.indexOf(MaToChar[m2].toUpperCase());
                    //endIndex is used for finding endMaBen
                    beginMaBen = parseInt(subS.substr(beginIndex + 1, 5));

                    endIndex = 0;
                    //Following code for calculate endIndex and endMaBen
                    if ((m1 == 55) && (m2 == 55)) {
                        //endIndex = ?
                        //endIndex should be total number or HanZi
                        //But From reality maben I know:
                        endMaBen = beginMaBen + 2;
                    }
                    else if ((m1 != 55) && (m2 == 55)) {
                        //subS = subS.substr(beginIndex+1,16);
                        endIndex = danZi_Index.indexOf(MaToNextChar[m1]);//.toUpperCase());
                        endMaBen = parseInt(danZi_Index.substr(endIndex + 2, 5));
                    }
                    else {
                        endIndex = subS.indexOf(MaToNextChar[m2].toUpperCase());

                        //Following fix bug for 11 13, since 11 14, 11 15 has not record;
                        nextShuMa = MaToNextShuMa[m2];
                        while (endIndex <= 0) {

                            if (nextShuMa < 55) {
                                endIndex = subS.indexOf(MaToNextChar[nextShuMa].toUpperCase());

                                nextShuMa = MaToNextShuMa[nextShuMa];
                            }
                            else //nextShuMa == 55
                            {
                                // Fix 51 54 bug, since 51 55 has no record in danZi_Index file.
                                endIndex = danZi_Index.indexOf(MaToNextChar[m1]);//.toUpperCase());
                                endMaBen = parseInt(danZi_Index.substr(endIndex + 2, 5));
                                return;
                            }
                        }

                        if (endIndex > beginIndex + 5 || endIndex <= 0) {
                            break;
                        }
                        endMaBen = parseInt(subS.slice(endIndex + 1));

                    }
                }

                break;
            default:
                break;
        }
    }

    function getCiZuIndex(typingState) {

        var maShu = typingState.getMaShu();
        var m1 = typingState.getMa1();
        var m2 = typingState.getMa2();
        var m3 = typingState.getMa3();
        var m4 = typingState.getMa4();

        switch (maShu) {
            case 0:
                beginCiZuIndex = 0;
                endCiZuIndex = 0;//ciZu_Index.length -1; //pass the string by 1
                beginCiZuMaBen = 0;
                endCiZuMaBen = 0;//ciZu_MaBen.length -1;
                break;
            case 6:
                beginCiZuIndex = 0;
                endCiZuIndex = 0;//ciZu_Index.length -1; //pass the string by 1
                beginCiZuMaBen = 0;
                endCiZuMaBen = 0;//ciZu_MaBen.length -1;

                beginCiZuIndex = ciZu_Index.indexOf(MaToChar[m1] + ":");//.toUpperCase());
                if (m1 == 55) {
                    //ready for only m2==55 and m3==55
                    //endCiZuMaBen=ciZu_MaBen.length-1;	
                    endCiZuIndex = ciZu_Index.length;
                }
                else {
                    //this give the m1 index boundry
                    endCiZuIndex = ciZu_Index.indexOf(MaToNextChar[m1] + ":");
                    //endCiZuIndex=ciZu_Index.length-1;
                }

                //since m1 scope is begin with "t:Tm" format
                beginCiZuIndex = ciZu_Index.indexOf(MaToChar[m2].toUpperCase(), beginCiZuIndex);
                //endIndex is used for finding endMaBen
                if (m2 == 55) {
                    //use m1's boundary as m1=55's boundary
                    subS = ciZu_Index.substring(beginCiZuIndex, endCiZuIndex);
                    //ready for only m2==55, whoever it is already there
                    //m1==55 endCiZuIndex is same as before
                }
                else {
                    //ready for m2!=55, and following sentence should by always success, 
                    //since every two m1m2 has cizu items
                    endCiZuIndex = ciZu_Index.indexOf(MaToNextChar[m2].toUpperCase(), beginCiZuIndex + 1);
                    subS = ciZu_Index.substring(beginCiZuIndex, endCiZuIndex);
                }
                //else m2=55 then m2's endCiZuIndex is same as m1 

                //no m3 item 
                if ((subS.indexOf(MaToChar[m3])) == -1) {
                    beginCiZuMaBen = 0;
                    endCiZuMaBen = 0;
                    //TypeBack();		
                    return;
                }

                beginCiZuIndex = ciZu_Index.indexOf(MaToChar[m3], beginCiZuIndex + 1) //+1 is optional
                beginCiZuMaBen = parseInt(ciZu_Index.substr(beginCiZuIndex + 1, 6)); //it woundn't reach file's end, since the last number is 6 digital

                //count endCiZuMaBen
                //only care about the end of scope
                if ((m1 == 55) && (m2 == 55) && (m3 == 55)) {
                    //already prepared
                    endCiZuMaBen = ciZu_MaBen.length - 1;
                    //beginCiZuMaBen=0;
                }
                else if ((m2 == 55) && (m3 == 55)) {
                    //subS=ciZu_Index.substring(endCiZuIndex+2,subS.length-1);
                    endCiZuIndex = ciZu_Index.indexOf(MaToNextChar[m1] + ":");
                    endCiZuMaBen = parseInt(ciZu_Index.substr(endCiZuIndex + 4, 6));
                }
                else if (m3 == 55) //((m2 != 55) 
                {
                    //use m2's boundary as m3==55's boundary
                    endCiZuMaBen = parseInt(ciZu_Index.substr(endCiZuIndex + 2, 6));
                }
                else //for
                {
                    subS = ciZu_Index.slice(beginCiZuIndex + 1);

                    if ((beginCiZuIndex = subS.search(/[a-z]\d/)) != -1) // sure it exist, since is m3 !=55, even it pass m2's boundary
                    {
                        endCiZuMaBen = parseInt(subS.slice(beginCiZuIndex + 1));
                    }
                    else //cann't find the next_char through the scope
                    {
                        //in case of my mistake, use m3==5's endCiZuMaBen
                        endCiZuMaBen = parseInt(ciZu_Index.substr(endCiZuIndex + 2, 6));
                        //endCiZuMaBen=beginCiZuMaBen+20
                    }
                }
                break;
            default:
                break;
        }

    }
   
    function formCandArray(typingState, setting) {

        var maShu = typingState.getMaShu();
        var m1 = typingState.getMa1();
        var m2 = typingState.getMa2();
        var m3 = typingState.getMa3();
        var m4 = typingState.getMa4();

        var i = 0, heMaOrder;
        var subs = "";
        var candArray = new Array();

        switch (maShu) {
            case 1:
                {
                    switch (m1) {
                        case 1:
                            candArray.push("不");
                            break;
                        case 2:
                            candArray.push("是");
                            break;
                        case 3:
                            candArray.push("去");
                            break;
                        case 4:
                            candArray.push("和");
                            break;
                        case 5:
                            candArray.push("请");
                            break;
                        default:
                            return false;
                            break;
                    }

                    var tempM1 = m1;
                    var typingStateTemp = TypingState();
                    for (var c = 5; c > 0; c--) {

                        typingStateTemp.clearState();
                        m1 = tempM1 * 10 + c;
                        m2 = 0;
                        typingStateTemp.typeMa(m1);
                        typingStateTemp.typeMa(m2);
                        getDanZiIndex(typingStateTemp);

                        candStr = (danZi_MaBen.substring(beginMaBen * 4, endMaBen * 4)).match(/[^a-zA-Z]\d/g);

                        for (i = 0; i < candStr.length; i++) {
                            if (parseInt(candStr[i].charAt(1)) > 0) {
                                subs = ""
                                subs += candStr[i].charAt(0);
                                subs += ' ' + c;  //((CharToMa[candStr[i].charAt(0)])%10);
                                candArray.push(subs);
                            }
                        }
                    }
                    m1 = tempM1;
                }
                break;
            case 2:
                {
                    getDanZiIndex(typingState);
                    candStr = (danZi_MaBen.substring(beginMaBen * 4, endMaBen * 4)).match(/\S\d/g);

                    for (i = 0; i < candStr.length; i++) {
                        candArray.push(candStr[i].charAt(0));
                    }
                }
                break;
            case 3:
                {
                    var c = 0;

                    var typingStateTemp = TypingState();
                    
                    var tempM1 = m1;
                    var tempM2 = m2;
                    /*
                    for (c = 1; c < 6; c++) {

                        m2 = tempM2 * 10 + c;
                        typingStateTemp.clearState();
                        typingStateTemp.typeMa(m1);
                        typingStateTemp.typeMa(m2);
                        getDanZiIndex(typingStateTemp);
                        if ((m1 == 55) && (m2 == 55)) {
                            candStr = (danZi_MaBen.slice(beginMaBen * 4)).match(/\S\d/g);
                        }
                        else {
                            candStr = (danZi_MaBen.substring(beginMaBen * 4, endMaBen * 4)).match(/\S\d/g);
                        }

                        for (i = 0; i < candStr.length; i++) {
                            if (parseInt(candStr[i].charAt(1)) == 3) {
                                candArray.push(candStr[i].charAt(0));
                            }
                        }
                    }
                    //*/

                    for (c = 5; c > 0; c--) {

                        m1 = tempM2 * 10 + c;
                        m2 = 0;
                        typingStateTemp.clearState();
                        typingStateTemp.typeMa(m1);
                        typingStateTemp.typeMa(m2);
                        getDanZiIndex(typingStateTemp);
                        candStr = (danZi_MaBen.substring(beginMaBen * 4, endMaBen * 4)).match(/\S\d/g);

                        for (i = 0; i < candStr.length; i++) {
                            if (parseInt(candStr[i].charAt(1)) > 0) {
                                subs = ""
                                subs += candStr[i].charAt(0);
                                subs += ' ' + c;  //((CharToMa[candStr[i].charAt(0)])%10);
                                candArray.push(subs);
                            }
                        }
                    }
                    m1 = tempM1;
                    m2 = tempM2;
                }
                break;
            case 4:
                {
                    getDanZiIndex(typingState);
                    if ((m1 == 55) && (m2 == 55)) {
                        candStr = (danZi_MaBen.slice(beginMaBen * 4)).match(/[a-z]{2}\S\d/g);
                    }
                    else {
                        if (endMaBen > beginMaBen) {
                            candStr = (danZi_MaBen.substring(beginMaBen * 4, endMaBen * 4)).match(/[a-z]{2}\S\d/g);
                        }
                    }

                    if (endMaBen > beginMaBen) {
                        for (i = 0; i < candStr.length; i++) {
                            if (parseInt(candStr[i].charAt(3)) > 1) {
                                subs = ""
                                subs += candStr[i].charAt(2);
                                subs += ' '+CharToMa[candStr[i].charAt(0)];
                                candArray.push(subs);
                            }
                        }

                        //max 2 items need to check, however sometime candStr.length==0
                        for (i = 0; i < candStr.length; i++) {
                            if (parseInt(candStr[i].charAt(3)) < 2) {
                                subs = ""
                                subs += candStr[i].charAt(2);
                                subs += ' '+CharToMa[candStr[i].charAt(0)];
                                candArray.push(subs);
                                break;
                            }
                        }
                    }
                }
                break;
            case 5:
                {
                    if (endMaBen > beginMaBen) {
                        for (i = 1; i < candStr.length; i++) {
                            if ((Math.floor((CharToMa[candStr[i].charAt(0)]) / 10) == m3) && (parseInt(candStr[i].charAt(3)) > 2)) {
                                subs = ""
                                subs += candStr[i].charAt(2);
                                subs += ' '+(CharToMa[candStr[i].charAt(0)] % 10);
                                candArray.push(subs);
                            }
                        }

                        if (candStr.length >= 3) {
                            for (i = 0; i < 3; i++) {
                                if ((Math.floor((CharToMa[candStr[i].charAt(0)]) / 10) == m3) && (parseInt(candStr[i].charAt(3)) < 3)) {
                                    subs = ""
                                    subs += candStr[i].charAt(2);
                                    subs += ' '+(CharToMa[candStr[i].charAt(0)] % 10);
                                    candArray.push(subs);
                                }
                            }
                        }
                    }
                }
                break;
            case 6:
                {
                    if (endMaBen > beginMaBen) {
                        for (i = 0; i < candStr.length; i++) {
                            heMaOrder = parseInt(candStr[i].charAt(3));
                            if (((candStr[i].charAt(0)) == MaToChar[m3]) && (heMaOrder > 2) && (heMaOrder < 6)) {
                                subs = ""
                                subs += candStr[i].charAt(2);
                                subs += ' '+CharToMa[candStr[i].charAt(1)];
                                candArray.push(subs);
                            }
                        }
                    }

                    getCiZuIndex(typingState);
                    
                    if (endCiZuMaBen > 0) //like 111213 has no item
                    {
                        ciZuCand = (ciZu_MaBen.substring(beginCiZuMaBen, endCiZuMaBen)).match(/[a-z][^a-z]+/g);

                        for (i = 0; i < ciZuCand.length; i++) {
                            subs = ""
                            subs += ciZuCand[i].match(/[^a-z]+/);
                            subs += ' '+CharToMa[ciZuCand[i].charAt(0)];
                            candArray.push(subs);
                        }
                    }

                    if (endMaBen > beginMaBen) {
                        for (i = 1; i < candStr.length; i++) {
                            heMaOrder = parseInt(candStr[i].charAt(3));
                            if (((candStr[i].charAt(0)) == MaToChar[m3]) && (heMaOrder > 5))  //||(heMaOrder<3)))
                            {
                                subs = ""
                                subs += candStr[i].charAt(2);
                                subs += ' '+CharToMa[candStr[i].charAt(1)];
                                candArray.push(subs);
                            }
                        }

                        if (candStr.length >= 2) {
                            for (i = 0; i < 2; i++) {
                                heMaOrder = parseInt(candStr[i].charAt(3));
                                if (((candStr[i].charAt(0)) == MaToChar[m3]) && (heMaOrder < 3)) {
                                    subs = ""
                                    subs += candStr[i].charAt(2);
                                    subs += ' '+CharToMa[candStr[i].charAt(1)];
                                    candArray.push(subs);
                                }
                            }
                        }
                    }
                }
                break;
            case 7:
                {
                    if (endMaBen > beginMaBen) {
                        for (i = 0; i < candStr.length; i++) {
                            heMaOrder = parseInt(candStr[i].charAt(3));
                            if ((candStr[i].charAt(0)) == MaToChar[m3] && (Math.floor(CharToMa[candStr[i].charAt(1)] / 10) == m4)) {
                                if ((heMaOrder < 6) && (heMaOrder > 4)) {
                                    subs = ""
                                    subs += candStr[i].charAt(2);
                                    subs += ' '+(CharToMa[candStr[i].charAt(1)] % 10);
                                    candArray.push(subs);
                                }
                            }
                        }
                    }

                    if (endCiZuMaBen > 0) {
                        for (i = 0; i < ciZuCand.length; i++) {
                            if (Math.floor(CharToMa[ciZuCand[i].charAt(0)] / 10) == m4) {
                                subs = ""
                                subs += ciZuCand[i].match(/[^a-z]+/);
                                subs += ' '+CharToMa[ciZuCand[i].charAt(0)] % 10;
                                candArray.push(subs);
                            }
                        }
                    }

                    if (endMaBen > beginMaBen) {
                        for (i = 2; i < candStr.length; i++) {
                            heMaOrder = parseInt(candStr[i].charAt(3));
                            if ((candStr[i].charAt(0)) == MaToChar[m3] && Math.floor(CharToMa[candStr[i].charAt(1)] / 10) == m4) {
                                if (heMaOrder > 5)   //||(heMaOrder<5))
                                {
                                    subs = ""
                                    subs += candStr[i].charAt(2);
                                    subs += ' '+(CharToMa[candStr[i].charAt(1)] % 10);
                                    candArray.push(subs);
                                }
                            }
                        }

                        if (candStr.length >= 3) {
                            for (i = 0; i < 3; i++) {
                                heMaOrder = parseInt(candStr[i].charAt(3));
                                if ((candStr[i].charAt(0)) == MaToChar[m3] && Math.floor(CharToMa[candStr[i].charAt(1)] / 10) == m4) {
                                    if (heMaOrder < 5) {
                                        subs = ""
                                        subs += candStr[i].charAt(2);
                                        subs += ' '+(CharToMa[candStr[i].charAt(1)] % 10);
                                        candArray.push(subs);
                                    }
                                }
                            }
                        }
                    }
                }
                break;
            case 8:
                {
                    if (endMaBen > beginMaBen) {
                        for (i = 0; i < candStr.length; i++) {
                            heMaOrder = parseInt(candStr[i].charAt(3));
                            if ((candStr[i].charAt(0)) == MaToChar[m3] && (candStr[i].charAt(1)) == MaToChar[m4]) {
                                if ((heMaOrder < 6) && (heMaOrder > 4))
                                    candArray.push(candStr[i].charAt(2));
                            }
                        }
                    }

                    if (endCiZuMaBen > 0) {
                        for (i = 0; i < ciZuCand.length; i++) {
                            if ((ciZuCand[i].charAt(0)) == MaToChar[m4]) {
                                candArray.push(ciZuCand[i].match(/[^a-z]+/));
                            }
                        }
                    }

                    if (endMaBen > beginMaBen) {
                        for (i = 2; i < candStr.length; i++) {
                            heMaOrder = parseInt(candStr[i].charAt(3));
                            if ((candStr[i].charAt(0)) == MaToChar[m3] && (candStr[i].charAt(1)) == MaToChar[m4]) {
                                if (heMaOrder > 5)  //||(heMaOrder<5))
                                    candArray.push(candStr[i].charAt(2));
                            }
                        }

                        if (candStr.length >= 3) {
                            for (i = 0; i < 3; i++) {
                                heMaOrder = parseInt(candStr[i].charAt(3));
                                if ((candStr[i].charAt(0)) == MaToChar[m3] && (candStr[i].charAt(1)) == MaToChar[m4]) {
                                    if (heMaOrder < 5)
                                        candArray.push(candStr[i].charAt(2));
                                }
                            }
                        }
                    }
                }

                break;
            default:
                break;
        }
        return candArray;
    }


    return {
        formCandArray: formCandArray
        
    }
}

// Declare SymbolEngine closure
function SymbolEngine() {

    //index of Symbol MaBen
    var m1ToSymbolIndex = {
        0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 356,
        6: 0, 7: 62, 8: 158, 9: 252
    }

    //Char_To_Number function
    var CharToMa = {
        "a": 35, "b": 51, "c": 53, "d": 33,
        "e": 13, "f": 32, "g": 31, "h": 41, "i": 23, "j": 42, "k": 43, "l": 44, "m": 0,
        "n": 45, "o": 24, "p": 25, "q": 15, "r": 12, "s": 34, "t": 11, "u": 22, "v": 52,
        "w": 14, "x": 54, "y": 21, "z": 55
    };

    function formCandArray(typingState) {

        var maShu = typingState.getMaShu();
        var m1 = typingState.getMa1();
        var m2 = typingState.getMa2();
        var m3 = typingState.getMa3();
        var m4 = typingState.getMa4();

        var symbol = "";
        var i = 0;
        var subs = "";
        var candArray = new Array();

        switch (m1) {
            case 0:
                //return formCandArrayFor0(typingState);
                break;
            case 6: //for puncture
                symbol = symbol_MaBen.substring(0, m1ToSymbolIndex[7] * 3 + 3).match(/[a-z][^a-z][a-z]/g);
                break;
            case 7: //for math symbols
                symbol = symbol_MaBen.substring(m1ToSymbolIndex[7] * 3, m1ToSymbolIndex[8] * 3 + 3).match(/[a-z][^a-z][a-z]/g);
                break;
            case 8://for numbers
                symbol = symbol_MaBen.substring(m1ToSymbolIndex[8] * 3, m1ToSymbolIndex[9] * 3 + 3).match(/[a-z][^a-z][a-z]/g);
                break;
            case 9://for English chars
                symbol = symbol_MaBen.substring(m1ToSymbolIndex[9] * 3, m1ToSymbolIndex[5] * 3 + 3).match(/[a-z][\S][a-z]/g);
                break;
            case 62:
                symbol = symbol_MaBen.substring(m1ToSymbolIndex[5] * 3).match(/[a-z][^a-z][a-z]/g);
                break;
            default:
                break;
        }
        //symbol = symbol_MaBen.substring(0,m1ToSymbolIndex[7]*3+3).match(/[a-z][^a-z][a-z]/g);
        switch (maShu) //the fist ma is 6
        {
            case 2:
                {
                    var iTemp = 0;
                    for (i = 0; i < symbol.length; i++) {
                        if (CharToMa[symbol[i].charAt(0)] >= iTemp) {
                            iTemp = CharToMa[symbol[i].charAt(0)] + 1;	//every kind of symbol, only 1 selected.
                            subs = ""
                            subs += symbol[i].charAt(1);
                            subs += ' '+CharToMa[symbol[i].charAt(0)];
                            candArray.push(subs);
                        }
                    }
                }
                break;
            case 3:
                {
                    for (i = 0; i < symbol.length; i++) {
                        if (Math.floor(CharToMa[symbol[i].charAt(0)] / 10) == m2) //select all same kind of symbol
                        {
                            subs = ""
                            subs += symbol[i].charAt(1);
                            subs += ' '+CharToMa[symbol[i].charAt(0)] % 10;
                            candArray.push(subs);
                        }
                    }
                }
                break;
            case 4:
            case 5:
                {
                    for (i = 0; i < symbol.length; i++) {
                        if (CharToMa[symbol[i].charAt(0)] == m2) //select all same kind of symbol
                        {
                            subs = ""
                            subs += symbol[i].charAt(1);
                            subs += ' '+CharToMa[symbol[i].charAt(2)];
                            candArray.push(subs);;
                        }
                    }
                }
                break;
            case 6:
                {
                    for (i = 0; i < symbol.length; i++) {
                        if ((CharToMa[symbol[i].charAt(0)] == m2) &&
                            (CharToMa[symbol[i].charAt(2)] == m3)) {
                            //candArray[listCounter].maShu = 6;
                            subs = ""
                            subs += symbol[i].charAt(1);
                            //subs +=CharToMa[symbol[i].charAt(2)]+'　　';
                            candArray.push(subs);
                        }
                    }
                }
                break;
            default:
                break;
        }
        return candArray;
    }

    return {
        formCandArray: formCandArray
    }
}

// Declare MenuEngine closure
function MenuEngine() {

    function formCandArray(typingState) {

        var maShu = typingState.getMaShu();
        var m1 = typingState.getMa1();
        var m2 = typingState.getMa2();
        var m3 = typingState.getMa3();
        //var m4 = typingState.getMa4();

        var candArray = new Array();

        if (maShu == 2 && m1 == 0) {

            candArray.push("重复前次输入 0");
            candArray.push("标点符号 11");
            candArray.push("运算符号 12");
            candArray.push("数字符号 13");
            candArray.push("英文字母 14");
            candArray.push("制表符号 15");
            //candArray.push("大键盘汉字，小键盘数字 21");
            //candArray.push("大键盘英文，小键盘汉字 22");
            //candArray.push("大小键盘都输入汉字(预设) 23");
            //candArray.push("CapsLock键切换中英文输入");
            //candArray.options[candArray.options.length]=new Option("功能设置 23");
            //maShu=2;
        }
        return candArray;
    }

    return {
        formCandArray: formCandArray
    }
}