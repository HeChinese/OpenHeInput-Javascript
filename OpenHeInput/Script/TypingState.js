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

/* Declare typingState closure.
*/
function TypingState() {

    var m1 = 0, m2 = 0, m3 = 0, m4 = 0;
    var maShu = 0;
    var m1Char = "", m2Char = "", m3Char = "", m4Char = "";
    var savedShuMa = 0;

    var MaToChineseChar = {
        0: '', 11: '一', 12: '彐', 13: "匚", 14: "又", 15: "王",
        21: '丨', 22: "凵", 23: "冂", 24: "口", 25: "日",
        31: '十', 32: "土", 33: "艹", 34: "木", 35: "米",
        41: '丿', 42: "亻", 43: "人", 44: "女", 45: '豸',
        51: '丶', 52: '冫', 53: "氵", 54: '火', 55: "心"
    };

    //index of Symbol MaBen
    var m1ToSymbolIndex = {
        0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 356,
        6: 0, 7: 62, 8: 158, 9: 252
    }

    // type ma
    var typeMa = function (ma) {

        if (ma == -100) {
            return typeBack();
        }

        var maShuBefore=maShu;
        var m1Before = m1;
        var m2Before = m2;

        switch (maShu) {
            case 0:
                {
                    m1 = ma;
                    m2 = 0;
                    m3 = 0;
                    m4 = 0;

                    if (ma > 10) //ma>10
                        maShu = 2;
                    else if (ma == 0)
                        maShu = 2; //changed for Online Input
                    else if (ma < 6)
                        maShu = 1;
                    else //if (ma<10) //ma=6,7,8,9
                        maShu = 2;
                }
                break;
            case 8://Continue type
                {
                    m1 = ma;
                    m2 = 0;
                    m3 = 0;
                    m4 = 0;

                    if (ma > 10) //ma>10
                        maShu = 2;
                    else if (ma == 0)
                        maShu = 0;
                    else if (ma < 6)
                        maShu = 1;
                    else //if (ma<10) //ma=6,7,8,9
                        maShu = 2;
                }
                break;
            case 1:
                {
                    m2 = 0;
                    m3 = 0;
                    m4 = 0;
                    if (ma > 10) //ma= 11,12..55
                    {
                        m1 = ma;
                        maShu = 2;
                    }
                    else if (ma == 0) {
                        m1 = 0;
                        maShu = 2;
                    }
                    else if (ma < 6)//ma=1,2,3,4,5
                    {
                        m1 = m1 * 10 + ma;
                        maShu = 2;
                    }
                    else //if (ma<10) //ma = 6,7,8,9
                    {
                    }
                }
                break;
            case 2: //maShu==2 before type
                {
                    m2 = 0;
                    m3 = 0;
                    m4 = 0;
                    if (m1 == 0) {
                        switch (ma) {
                            case 0:
                                m1 = 0;
                                break;
                            case 1:
                            case 2:
                            case 3:
                                //case 4:
                                //if(ma<4) //ma=1,2,3
                                {
                                    m2 = ma;
                                    maShu = 3;
                                }
                                break;
                            case 11:
                                m1 = 6;
                                break;
                            case 12:
                                m1 = 7;
                                break;
                            case 13:
                                m1 = 8;
                                break;
                            case 14:
                                m1 = 9;
                                break;
                            case 15:
                                m1 = 62;
                                break;
                            case 31:
                                //m1=61;
                                break;

                            default:
                                break; //ignore
                        }
                    }
                        //else m1>0
                    else if (ma > 10) //m1>0 and ma= 11 12 ... 55
                    {
                        m2 = ma;
                        maShu = 4;
                    }
                    else if (ma == 0) //m1>0 and ma=0
                    {
                        if ((m1 == 8)) {
                            m2 = 0;
                            maShu = 4;
                        }
                        else if (m1 == 0) {
                            //for repeat input
                            m2 = 0;
                            maShu = 4;
                        }
                        else if ((m1 == 6) || (m1 == 7) || (m1 == 9) || (m1 == 61) || (m1 == 62)) //ignore
                        {
                            //ignore
                        }
                        else //m1=11,12...55
                        {
                            maShu = 4;
                            m2 = ma;
                        }
                    }
                    else if (ma < 6)// m1>0 and ma=1,2,3,4,5
                    {
                        if (m1 == 0) {
                            if (ma < 4) //ma=1,2,3
                            {
                                m2 = ma;
                                maShu = 3;
                            }
                            else {
                                //ignore
                            }
                        }
                        else {
                            m2 = ma;
                            maShu = 3;
                        }
                    }
                    else if (ma < 10) //m1>0 and ma = 6,7,8,9
                    {
                    }
                }
                break;
            case 3: //maShu=3
                {
                    if (m1 == 0) {
                        maShu = 2;

                        if (ma < 6 || ma > 10) {
                            var mT = 0;

                            if (ma > 10)
                                mT = ma;
                            else //if (ma < 6)
                                mT = m2 * 10 + ma;

                            switch (mT) {
                                case 0:
                                    m1 = 0;
                                    break;
                                case 11:
                                    m1 = 6;
                                    break;
                                case 12:
                                    m1 = 7;
                                    break;
                                case 13:
                                    m1 = 8;
                                    break;
                                case 14:
                                    m1 = 9;
                                    break;
                                case 15:
                                    m1 = 62;
                                    break;
                                case 31:
                                    //m1=61;
                                    break;
                                
                                default:
                                    break; //ignore
                            }
                        }
                    }
                    else if (ma > 10) //m1>0 and ma= 11 12 ... 55
                    {
                        m2 = ma;
                        maShu = 4;
                    }

                    else if (ma == 0)  //m1>0 and ma=0
                    {
                    }
                    else if (ma < 6)  //m1>0 and ma=1,2,3,4,5
                    {
                        {
                            m2 = m2 * 10 + ma;
                            maShu = 4;
                        }
                    }
                    else if (ma < 10) //ma = 6,7,8,9
                    {
                        if ((m1 == 6) || (m1 == 7) || (m1 == 8) || (m1 == 9)) {
                            //	m2=m2*10+ma;
                            //	maShu=4;
                        }
                        else if (m1 == 0) {
                            //ignore
                        }
                        else //m1=11,12...55
                        {
                            //ignore
                        }
                    }

                }
                break;
            case 4: //maShu=4
                {

                    if (ma > 10) //ma= 11,12..55
                    {
                        m3 = ma;
                        maShu = 6;
                        //}
                    }
                    else if (ma == 0) {
                        if ((m1 == 6) || (m1 == 7) || (m1 == 8) || (m1 == 9) || (m1 == 61) || (m1 == 62)) //no chance for m1=0
                        {
                            //all cases are >0
                        }
                        else {
                            maShu = 6;
                            m3 = ma;
                        }
                    }
                    else if (ma < 6)//ma=1,2,3,4,5
                    {
                        m3 = ma;
                        maShu = 5;
                        //}
                    }
                    else if (ma < 10) //ma = 6,7,8,9
                    {
                    }
                }
                break;
            case 5://maShu=5
                {
                    if (ma > 10) //ma= 11,12..55
                    {
                        m3 = ma;
                        maShu = 6;
                    }
                    else if (ma == 0) {
                    }
                    else if (ma < 6)//ma=1,2,3,4,5
                    {
                        m3 = m3 * 10 + ma;
                        maShu = 6;
                    }
                    else if (ma < 10) //ma = 6,7,8,9
                    {
                    }
                }
                break;
            case 6: //maShu=6
                {
                    if ((m1 == 0) || (m1 == 6) || (m1 == 7) || (m1 == 8) || (m1 == 9) || (m1 == 61) || (m1 == 62)) //m1=6,7,8 only have 3 ma, m1=0 has 2 ma
                    {
                        //ignore
                    }
                    else if (ma > 10) //ma= 11,12..55
                    {
                        if (m2 > 0) {
                            m4 = ma;
                            maShu = 8;
                        }
                        else if (m2 == 0 && m3 == 0) //After M2 Queried
                        {
                            m4 = ma;
                            maShu = 8;
                        }
                        else if (m2 == 0 && m3 > 0)  //after M2 queried
                        {
                            m2 = ma;
                            m3 = 0;
                            m4 = 0;
                            maShu = 4;
                        }
                    }

                    else if (ma == 0) {
                        maShu = 8;
                        m4 = ma;
                    }
                    else if (ma < 6)//ma=1,2,3,4,5
                    {
                        m4 = ma;
                        maShu = 7;
                    }
                    else if (ma < 10) //ma = 6,7,8,9
                    {
                    }
                }
                break;
            case 7://maShu=7
                {
                    if (ma == 0) {
                    }
                    else if (ma < 6)//ma=1,2,3,4,5
                    {
                        if (m2 > 0) {
                            m4 = m4 * 10 + ma;
                            maShu = 8;
                        }
                        else if (m2 == 0 && m3 == 0) //After M2 Queried
                        {
                            m4 = m4 * 10 + ma;
                            maShu = 8;
                        }
                        else if (m2 == 0 && m3 > 0) {
                            m4 = m4 * 10 + ma;
                            m2 = m4;
                            m3 = 0;
                            m4 = 0;
                            maShu = 4;
                        }
                    }

                    else if (ma < 10) //ma = 6,7,8,9
                    {
                    }

                    else //ma= 11,12..55
                    {
                        if (m2 > 0) {
                            m4 = ma;
                            maShu = 8;
                        }
                        else if (m2 == 0 && m3 == 0) //After M2 Queried
                        {
                            m4 = ma;
                            maShu = 8;
                        }
                        else if (m2 == 0 && m3 > 0)  //after M2 queried
                        {
                            m2 = ma;
                            m3 = 0;
                            maShu = 4;
                        }
                    }
                }
                break;
            default:
                clearState();
                break;
        }

        if (maShuBefore != maShu || m1Before != m1 || m2Before != m2) {
            savedShuMa = ma;
        }
    }

    
    // type back
    var typeBack = function () {

        //For m1 = 6,7,8,9, and 0,1,2,3,4,5 and 99
        if(maShu==2 && (m1<10 || m1 ==99))
        {
            clearState();
            return true;
        }
	
        if(savedShuMa>10 || savedShuMa == 0)
        {
            switch(maShu)
            {
                case 0:
                case 1:
                case 2:
                    clearState();
                    break;
                case 3:
                case 4:
                    {
                        maShu = 2;
                        m2 = 0;
                    }
                    break;
                case 5:
                case 6:
                    {
                        maShu = 4;
                        m3 = 0;
                    }
                    break;
                case 7:
                case 8:
                    {
                        maShu = 6;
                        m4 = 0;
                    }
                    break;
                default:
                    break;
            }
        }
        else		//savedShuMa<=10
        {
            switch (maShu)
            {
                case 0:
                case 1:
                    clearState();
                    break;
                case 2:
                    {
                        maShu = 1;
                        m1 = Math.floor(m1/10);
                    }
                    break;
                case 3:
                    {
                        maShu = 2;
                        m2 = 0;
                    }
                    break;
                case 4:
                    {
                        maShu = 3;
                        m2 = Math.floor(m2/10);
                    }
                    break;
                case 5:
                    {
                        maShu = 4;
                        m3 = 0;
                    }
                    break;
                case 6:
                    {
                        maShu = 5;
                        m3 = Math.floor(m3/10);
                    }
                    break;
                case 7:
                    {
                        maShu = 6;
                        m4 = 0;
                    }
                    break;
                case 8:
                    {
                        maShu = 7;
                        m4 = Math.floor(m4/10);
                    }
                    break;
                default:
                    break;
            }
        }
        savedShuMa = 0;
    }

    /*
    // type back
    var typeBack = function () {

        if (maShu % 2 == 1)
            maShu -= 1;
        else if (maShu > 0) {
            maShu -= 2;
        }
        else
            maShu = 0;

        if (maShu == 0)
            clearState();
        else if (maShu == 2) {
            m2 = 0;
        }
        else if (maShu == 4) {
            m3 = 0;
        }
        else //if(maShu==6)
        {
            m4 = 0;
        }
    };
    */

    var clearState = function () {
        m1 = 0;
        m2 = 0;
        m3 = 0;
        m4 = 0;
        savedShuMa = 0;
        maShu = 0;
        m1Char = "";
        m2Char = "";
        m3Char = "";
        m4Char = "";
    }

    var provideMaString = function () {

        var maString = "";
        switch (maShu) {
            case 0:
                {
                    maString = "";
                }
                break;
            case 1:
            case 2:
                maString = "" + m1;
                maString = "" + m1;
                break;
            case 3:
            case 4:
                maString = m1 + " " + m2;
                break;
            case 5:
            case 6:
                maString = m1 + " " + m2 + " " + m3;
                maString = m1 + " " + m2 + " " + m3;
                break;
            case 7:
            case 8:
                maString = m1 + " " + m2 + " " + m3 + " " + m4 + " ";
                break;
            default:
                break;
        }

        return maString;
    }

    var provideCCharString = function () {

        var cCharString = "";
        switch (maShu) {
            case 0:
            case 1:
                {
                    cCharString = "";
                }
                break;
            case 2:
            case 3:
                if ((m1 > 10) && (m1 < 56))
                    cCharString = "" + MaToChineseChar[m1];
                break;
            case 4:
            case 5:
                if ((m1 > 10) && (m1 < 56))
                    cCharString = MaToChineseChar[m1] + ' ' + MaToChineseChar[m2];
                break;
            case 6:
            case 7:
                if ((m1 > 10) && (m1 < 56))
                    cCharString = MaToChineseChar[m1] + ' ' + MaToChineseChar[m2] + ' ' + MaToChineseChar[m3];
                break;
            case 8:
                if ((m1 > 10) && (m1 < 56))
                    cCharString = MaToChineseChar[m1] + ' ' + MaToChineseChar[m2] + ' ' + MaToChineseChar[m3] + ' ' + MaToChineseChar[m4];
                break;
            default:
                break;
        }

        return cCharString;
    }

    return {
        
        getMa1: function () { return m1; },
        getMa2: function () { return m2; },
        getMa3: function () { return m3; },
        getMa4: function () { return m4; },
        getMaShu: function () { return maShu; },
     
        typeMa: typeMa,
        typeBack: typeBack,
        clearState: clearState,
        provideMaString: provideMaString,
        provideCCharString: provideCCharString,
        isMenuDisplayed: function () { return (maShu == 2 && m1 == 0);}
    }
}