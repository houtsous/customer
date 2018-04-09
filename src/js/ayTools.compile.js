(function () {
    /**
     * @private
     * @constant
     * */
    const appVersion = navigator.appVersion.toLocaleLowerCase(),
      ua = navigator.userAgent;
    /**
     * @namespace ayTools
     * @description ayTools是常用工具类<br>
     * 包含最基础、最常用的操作 如：日期处理、mobile平台的兼容处理等等
     * 这里的操作不依赖于任何第三方库<br>
     * @see <a href="http://usejsdoc.org/tags-inner.html">jsDoc文档查看</a>
     * @author 朱方
     * @version 1.0
     * */
    var ayTools = {
        /**
         * @function 数据根据值来获得相应的索引
         * @description ayTools.getIndexByValue()
         * @param {Array} array - 待查找的数组
         * @param {(string|number|boolean)} value - 要查找的值
         * @return {Array} arry -  查出的索引,有可能有重复所以返回时数组
         */
        getIndexByValue: function (array, value) {
            var arry = [];
            array.forEach(function (t, i) {
                if (t === value) {
                    arry.push(i);
                }
            });
            return arry;
        },
        /**
         * @function 数组去重复
         * @description ayTools.unique()
         * @param {Array} 待归整的数组(含有重复项)
         * @return {Array} result - 已经去重复的数组
         */
        unique: function () {
            var result = [];
            var filter = {};
            for (var i = 0; i < this.length; i++) {
                var curr = null;
                if (typeof this[i] === 'object') curr = JSON.stringify(this[i]);
                else curr = this[i];
                if (!filter[curr]) {
                    filter[curr] = true;
                    result.push(JSON.parse(curr));
                }
            }
            return result;
        },
        /**
         * @description ayTools.getParameter() 获取url ?a=1&&b=2 后的查询key
         * @function 获取url查询参数-单个
         * @param {string} key值
         * @param {...string} url
         * @return {string|number} par_obj[parameter]  根据key获取指定的值
         */
        getParameter: function (parameter,url) {
            var par_obj = {};
            var url = url || location.search.trim();
            url = url.trim().replace("?","");
            if (url) {
                var arr_url = url.split("&");
                for (var i = 0; i < arr_url.length; i++) {
                    var current = decodeURIComponent(arr_url[i]);
                    if (current.indexOf("=") == -1) {
                        continue;
                    }
                    var current_arr = current.split("=");
                    par_obj[current_arr[0]] = current_arr[1];
                }
                return par_obj[parameter];
            }
        },
        /**
         * @description ayTools.getParameters() 获取url 后的查询key
         * @method 获取url查询参数-多个
         * @example ?a=1&&b=2&&c=3
         * ayTools.getParameters().a
         * //return 1
         * @param {...string} url - 可传可不传,如果不传获取的是当前地址栏的?后的查询条件
         * @param {...string} splitStr - url的分割符 默认是&&
         * @return {Object} par_obj - 把url的key-value组合成对象形式
         */
        getParameters: function () {
            var par_obj = {};
            var url = arguments[0] || location.search.trim();
            var splitStr = arguments[1] || "&";
            url = url.trim().replace("?","");
            if (url) {
                var arr_url = url.split(splitStr);
                for (var i = 0; i < arr_url.length; i++) {
                    var current = decodeURIComponent(arr_url[i]);
                    if (current.indexOf("=") == -1) {
                        continue;
                    }
                    var current_arr = current.split("=");
                    par_obj[current_arr[0]] = current_arr[1];
                }
                return par_obj;
            } else {
                return {};
            }
        },
        /**
         * @description ayTools.getStyle()
         * @method 获取当前样式属性值
         * @example
         * ayTools.getStyle(document.getElementById("aa"),"height")
         * @param {Object} elem - DOM对象
         * @param {string} name - 属性名字
         * @return {string} 属性值
         */
        getStyle: function (elem, name) {
            function isN(result){
                if(isNaN(parseFloat(result))){
                    return result;
                }else{
                    return parseFloat(result);
                }
            }

            if(elem.style && elem.style[name]){
                var re = elem.style[name];
                return isN(re);
            }
            else if (elem.currentStyle) {
                var re = elem.currentStyle[name];
                return isN(re);

            } else if (document.defaultView
              && document.defaultView.getComputedStyle) {
                name = name.replace(/[A-Z]/g, "-$1");
                name = name.toLowerCase();
                var s = document.defaultView.getComputedStyle(elem, "");
                var re = s && s.getPropertyValue(name);
                return isN(re);
            } else
                return null;
        },
        /**
         * @description ayTools.empty({})
         * 只用于判断对象、字符串等，不能用于数字，因为数字0会被误判
         * @function 判断一个对象是否为空
         * @return {boolean} - true为空
         */
        empty: function (obj) {
            if (!obj || obj == "" || obj == '--') {
                return true;
            } else if (typeof obj === "object") {
                for (var prop in obj) {
                    return false;
                }
                return true;
            }
            return false;
        },
        /**
         * @description ayTools.isSupportHtml5()
         * @function 当前浏览器是否支持html5
         * @return {boolean} true是支持html5
         */
        isSupportHtml5: function () {
            return document.createElement('canvas').getContext ? true : false;
        },
        /**
         * @description ayTools.isArray()
         * @function 判断是否为数组
         * @param {Array} array - 待验证的数组
         * @return true是数组 false不是数组
         */
        isArray: function (array) {
            return Array.prototype.isPrototypeOf(array);
        },
        /**
         * @description ayTools.isObject()
         * @function 判断是否为对象
         * @param obj - 待验证的对象
         * @return true是对象 false不是对象
         */
        isObject: function (obj) {
            return Object.prototype.toString.call(obj) === "[object Object]";
        },
        /**
         * @description ayTools.formatMoney()
         * @function 格式化金额
         * @example formatMoney("138000.245") 或 formatMoney(138000.245) = "138,000.25"
         * @param {number} money 金额数值或字符串
         * @param {number} digits 小数位数，默认是 2位小数
         * @param {...string} seperator 分隔符，默认是","
         * @return {string} ret - 格式化后的字符串，如："123,001.23"
         */
        formatMoney: function (money, digits, seperator) {
            if (!money) {
                return null;
            }
            if (digits !== null && typeof digits !== "undefined") {
                digits = (digits >= 0 && digits <= 20) ? digits : 2;
            } else {
                digits = 2;
            }

            seperator = (seperator && typeof seperator === "string") ? seperator : ",";
            var originStr = parseFloat((money + "").replace(/[^\d\.-]/g, "")).toFixed(digits) + "",
              intArray = originStr.split(".")[0].split("").reverse(),
              digitPart = originStr.split(".")[1],
              temp = "",
              ret = "";
            for (var i = 0; i < intArray.length; i++) {
                temp += intArray[i];
                if ((i + 1) % 3 == 0 && (i + 1) != intArray.length) {
                    temp += seperator;
                }
            }
            ret = temp.split("").reverse().join("");
            if (digits > 0) {
                ret = ret + "." + digitPart;
            }
            return ret;
        },

        /**
         * @description ayTools.formatDate() 将 20150315 格式化为 2015-03-15
         * @function 日期格式化-年月日时分秒毫秒
         * @param {string|number} date - 时间戳（20150315）或者字符串形式的日期（2015-02-14）
         * @param {...string} formate 分隔符，默认是 "yyyy-MM-dd hh:mm:ss.S"
         * @return {string} 格式化后的字符串，若输入日期过长或过短，则返回null
         */
        formatDate: function (date, formate) {
            try{
                var formate = formate || "yyyy-MM-dd hh:mm:ss.S";
                var d = new Date(date);
                formate = formate.replace("yyyy",d.getFullYear()).replace("MM",d.getMonth())
                  .replace("MM",d.getMonth()).replace("dd",d.getDate()+1).replace("hh",d.getHours)
                  .replace("mm",d.getMinutes).replace("mm",d.getSeconds()).replace("mm",d.getMilliseconds());
                return formate;
            }catch (e){
                console.log(e.message);
            }
            return null;
        },
        /**
         * @description ayTools.digits() 如 1234.56 ，返回 2
         * @function 获取一个浮点数的小数部分的位数
         * @param {number} 数字
         * @return {number} 小数的位数
         */
        digits: function (number) {
            var digits = 0,
              numStr = number.toString();
            if (numStr.indexOf('.') >= 0) {
                digits = numStr.split('.')[1].length;
            }
            return digits;
        },

        /**
         * @description 因为js原生不支持replaceAll，提供了一个类似java中replaceAll的功能
         * 匹配后，把所有的reg替换成target
         * @function 扩展replaceAll
         * @param {string} source 源字符串
         * @param {RegExp} reg 要替换的模式
         * @param {string} target 默认为空串，即 ""
         * @return {string} 替换后的串
         */
        replaceAll: function (source, reg, target) {
            if (this.empty(source) || this.empty(reg)) {
                console.log("输入的原字符串和匹配模式reg不能为空");
                return null;
            }
            if (this.empty(target)) {
                target = "";
            }
            return source.split(reg).join(target);
        },
        /**
         * @description ayTools.check5Px()
         * @function 移动设备是否支持0.5px线
         * @return {boolean} true支持0.5px线
         */
        check5Px: function () {
            if (window.devicePixelRatio && devicePixelRatio >= 2) {
                var testElem = document.createElement('div');
                testElem.style.border = '.5px solid transparent';
                document.body.appendChild(testElem);
                if (testElem.offsetHeight == 1) {
                    return true;
                }
                document.body.removeChild(testElem);
                return false;
            }
        },
        /**
         * @description ayTools.loadcssfile("../../style/css/xxx.css")
         * @function js动态加载css文件
         * @param {string} filename - css href的路径
         */
        loadcssfile: function (filename) {
            var fileref = document.createElement('link');
            fileref.setAttribute("rel", "stylesheet");
            fileref.setAttribute("type", "text/css");
            fileref.setAttribute("href", filename);
            document.getElementsByTagName("head")[0].appendChild(fileref);
        },
        /**
         * @description ayTools.loadcssfile("../../js/xxx.js")
         * @function js动态加载script文件
         * @param {string} filename - script src的路径
         */
        loadscriptfile: function (filename) {
            var fileref = document.createElement('script');
            fileref.setAttribute("type", "text/javascript");
            fileref.setAttribute("src", filename);
            document.getElementsByTagName("head")[0].appendChild(fileref);
        },
        /**
         * @description ayTools.compareDay()
         * @function 比较两个日期相差天数
         * @param {string|number} startDate - 开始日期 可以是时间戳 也可以是string
         * @param {string|number} endDate - 结束日期
         * @return {number} 相差天数
         */
        compareDay: function (startDate, endDate) {
            if (typeof startDate === 'number' && typeof endDate === 'number') {
                return (endDate - startDate) / 3600 / 1000 / 24;
            }
            else if (typeof startDate === 'string' && typeof endDate === 'string') {
                var sDate = new Date(startDate), eDate = new Date(endDate);
                return (eDate - sDate) / 3600 / 1000 / 24
            } else {
                console.error("参数传递错误");
            }
        },
        /**
         * @description ayTools.IEVersion()
         * @method 查看IE版本号
         * @return {number} IE版本号
         */
        IEVersion: function () {
            var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
            var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器
            var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器
            var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
            if (isIE) {
                var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
                reIE.test(userAgent);
                var fIEVersion = parseFloat(RegExp["$1"]);
                if (fIEVersion == 7) {
                    return 7;
                } else if (fIEVersion == 8) {
                    return 8;
                } else if (fIEVersion == 9) {
                    return 9;
                } else if (fIEVersion == 10) {
                    return 10;
                } else {
                    return 6;//IE版本<=7
                }
            } else if (isEdge) {
                return 'edge';//edge
            } else if (isIE11) {
                return 11; //IE11
            } else {
                return -1;//不是ie浏览器
            }
        },

        /**
         * @description ayTools.myBrowser()
         * @method 判断浏览器种类
         * @return {string} 浏览器种类 IE、FF、Opera、Safari、chrome
         */
        myBrowser: function () {
            var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
            var isOpera = userAgent.indexOf("Opera") > -1;
            if (isOpera) {
                return "Opera"
            }
            //判断是否Opera浏览器
            if (userAgent.indexOf("Firefox") > -1) {
                return "FF";
            } //判断是否Firefox浏览器
            if (userAgent.indexOf("Chrome") > -1) {
                return "Chrome";
            }
            if (userAgent.indexOf("Safari") > -1) {
                return "Safari";
            } //判断是否Safari浏览器
            if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
                return "IE";
            }
        },
        /**
         * @description ayTools.isCheckByCheckbox("name属性")
         * @method 判断指定名称的复选框是否被选中
         * @param {string} name - 复选框名称
         * @return {boolean} isCheck - true选中否则没有选中
         */
        isCheckByCheckbox: function (name) {
            var obj = document.getElementsByName(name);
            var isCheck = false;
            for (var i = 0; i < obj.length; i++) {
                if (obj[i].checked == true) {
                    isCheck = true;
                    break;
                }
            }
            return isCheck;
        },

        /**
         * @description ayTools.getCountByCheckbox("name属性")
         * @method 判断指定名称的复选框被选中个数
         * @param {string} name - 复选框名称
         * @return {number} count - checkbox选中的个数
         */
        getCountByCheckbox: function (name) {
            var obj = document.getElementsByName(name);
            var count = 0;
            for (var i = 0; i < obj.length; i++) {
                if (obj[i].checked == true) {
                    count++;
                }
            }
            return count;
        },
        /**
         * @description ayTools.getValueByCheckbox("name属性")
         * @method 判断指定名称选中的复选框的所有值
         * @param {string} name - 复选框名称
         * @return {Array} values - 所有选中的复选框选中的值
         */
        getValueByCheckbox: function (name) {
            var obj = document.getElementsByName(name);
            var values = [];
            for (var i = 0; i < obj.length; i++) {
                if (obj[i].checked == true) {
                    values.push(obj[i].value);
                }
            }
        },
        /**
         * @description ayTools.getValueByRadio("name属性")
         * @method 判断指定名称选中的单选框的值
         * @param {string} name - 单选框名称
         * @return {Array} values - 选中的单选框选中的值
         */
        getValueByRadio: function (name) {
            var obj = document.getElementsByName(name);
            return obj[0].value;
        },
        /**
         * @description ayTools.findDomFromParent()
         * @method 查找父级页面的dom元素
         * @param {string} selector - 欲获取元素的选择器名字 .class | #id
         * @param {string} name - iframe的名字
         * @param {Object} w - 当前起始点的window
         * @return {Object} {nodeList:元素数组,ifr:当前iframe,wind:父级window}
         */
        findDomFromParent: function (selector,name,w) {
            var wind = w.parent;
            return {
                nodeList: wind.document.querySelectorAll(selector)[0],
                wind: wind,
                ifr: wind.document.getElementsByName(name)[0],
                findDomFromParent: arguments.callee
            }

        },
        /**
         * @description ayTools.findDomFromChild()
         * @method 查找子级页面的dom元素
         * @param {string} selector - 欲获取元素的选择器名字 .class | #id
         * @param {string} name - iframe的名字
         * @param {Object} w - 当前起始点的window
         * @return {Object} {nodeList:元素数组,ifr:当前iframe,wind:父级window}
         */
        findDomFromChild: function (selector,name,w) {
            var wind = window.frames[name];
            return {
                nodeList: wind.document.querySelectorAll(selector)[0],
                wind: wind,
                ifr: wind.document.getElementsByName(name)[0],
                findDomFromParent: arguments.callee
            }
        },
        /**
         * @description 生成UUID
         * @example ayTools.getUUID()
         * @method 生成UUID
         */
        getUUID: function() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random() * 16 | 0,
                  v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        },
        /**
         * @description 获取工程的绝对路径
         * @example ayTools.getProjectAbsPath()
         * @method 获取工程的绝对路径
         */
        getProjectAbsPath: function() {
            var arr = window.location.href.split("/");
            return arr[0] + "//" + arr[2] + "/" + arr[3] + "/";
        },
        /**
         * @description 设置cookie信息；默认有效期是天
         * @example ayTools.setCookie({username:'小张',age:20},1)
         * @method 设置cookie
         * @param {Object} obj - 以键值对存储信息
         * @param {...number} days - 有效天数默认一天
         */
        setCookie: function (obj,days){
            var days = days || 1;
            var exp = new Date();
            exp.setTime(exp.getTime() + days*24*60*60*1000);
            for(var name in obj){
                document.cookie = name + "="+ escape (obj[name]) + ";expires=" + exp.toGMTString();
            }
        },
        /**
         * @description 保存cookie信息
         * @example 设置： ayTools.setCookie({username:'小张',age:20},1)
         * 获取：ayTools.getCookie()["name"]
         * @method 获取cookie
         * @returns {Object} 以键值对方式返回保存的信息
         */
        getCookie: function (){
            var arr;
            var reg= /\w+=\w+/g;
            arr= document.cookie.match(reg);
            return ayTools.getParameters(arr.join("&"));
        },
        /**
         * @description 清除指定key的cookie信息
         * @param {string} name - 指定的key的名字
         * @example 设置： ayTools.setCookie({username:'小张',age:20},1)
         * 获取：ayTools.clearCookie("name")
         * @method 清除cookie
         * @returns {Object} 以键值对方式返回保存的信息
         */
        clearCookie: function (name){
            var exp = new Date();
            exp.setTime(exp.getTime() - 1);
            if(name!=null)
                document.cookie= name + "=0"+";expires="+exp.toGMTString();
        },
        /**
         * @description 清除所有cookie信息
         * @example 设置： ayTools.setCookie({username:'小张',age:20},1)
         * 获取：ayTools.clearAllCookie()
         * @method 清除所有cookie信息
         * @returns {Object} 以键值对方式返回保存的信息
         */
        clearAllCookie: function(){
            var keys= document.cookie.match(/\w+(?=\=)/g);
            if (keys) {
                for (var i = keys.length; i--;)
                    document.cookie=keys[i]+'=0;expires=' + new Date(-1).toGMTString()
            }
        },
        // 注册命名空间
        register: function() {
            var arg = arguments[0];
            var arr = arg.split('.');
            var str = '';
            for(var i = 0; i < arr.length; i++) {
                str = i == 0 ? arr[i] : (str + '.' + arr[i]);
                var sval = "   if(typeof " + str + "=='undefined' ) { " + str + "= new Object(); } ";
                eval(sval);
            }
        }
    };
    window.ayTools = ayTools;
    /**
     * 兼容AMD和非AMD规范
     */
    if (typeof define === "function" && define.amd) {
        define([], function () {
            return ayTools;
        });
    }
})();
