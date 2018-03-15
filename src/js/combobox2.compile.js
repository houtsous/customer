$(function () {
    var $body = $("body");
    var currentId;
    var $tar;
    var $arrow;
    var $combo2;
    var $combo2_down;
    $body.bind("click", function () {
        if (!$tar || !$arrow || !$combo2) return;
        $combo2.removeClass("show");
        $arrow.removeClass("fa-sort-asc").addClass("fa-sort-desc");
        $combo2.find(".combobox2_item").show().removeClass("check").children(".combobox2_icheck").removeClass("fa-check-square-o").addClass("fa-square-o").css("color", "#ccc");
        var options = $tar.data("options");
        $tar.data("selectItems").forEach(function (item, index) {
            $combo2.find(".combobox2_item").eq(item.index - 1).addClass("check").children(".combobox2_icheck").removeClass("fa-square-o").addClass("fa-check-square-o").css("color", options.icheckColor);
        });
        $combo2_down.removeClass("active");
        $combo2.find(".combobox2_search_inp").val("");
    });
    $.fn.ayCombobox = function (options_customer, customerValue) {
        var $target = $(this);
        var $combobox2_wrap;
        var pw = null;
        var dw = null;
        var first = true;
        var $combobox2;//当前整个combobox2 Dom对象
        var $combobox2_input;//当前整个combobox2 中输入框 Dom对象
        var $combobox2_arrow;
        var $combobox2_down;
        var $combobox2_search_inp;
        var $combobox2_clear;
        var $combobox2_item;
        var $combobox2_icheck;
        var $combobox2_sure;
        var combobox2_height;
        var id;
        //数据格式[{value:'',text:'',selected:true}]
        var sourceData = null;
        var datas = null;
        var selectIndexs = [];//多选
        var selectValues = [];
        var selectTexts = [];
        var selectItems = [];

        var options_default = {};
        var options = {};

        var method = {
            "showPanel": function () {
                $combobox2.addClass("show");
            },
            "hidePanel": function () {
                $combobox2.removeClass("show");
            },
            getId: function () {
                return id;
            },
            getSelectIndexs: function () {
                return $target.data("selectIndexs");
            },
            setValues: function (values) {
                if (!(values instanceof Array)) throw new Error("setValues(array)方法传参类型错误");
                //debugger
                $target.data("setType", "method");
                var options = $target.data("options");
                $target.val(values.join(options.splitStr));
                var list = $target.data("data");
                var $combobox2_item = $target.data("combobox2").find(".combobox2_item");
                var $combobox2_input = $target.data("combobox2_down").find(".combobox2_input");
                $combobox2_item.removeClass("check").children(".combobox2_icheck").removeClass("fa-check-square-o").addClass("fa-square-o").css("color", "#ccc");
                list.forEach(function (item, index) {
                    values.forEach(function (it, ind) {
                        if (it === item[options.valueField]) {
                            $combobox2_item.eq(item.index - 1).addClass("check").children(".combobox2_icheck").removeClass("fa-square-o").addClass("fa-check-square-o").css("color", options.icheckColor);
                            selectItems.push($.extend(true, {}, item));
                            selectValues.push(item[options.valueField]);
                            selectTexts.push(item[options.textField]);
                            selectIndexs.push(item.index);
                            $combobox2_input.text(selectTexts.join(options.splitStr));
                        }
                    });
                });
                $target.data("selectItems", selectItems);
                $target.data("selectValues", selectValues);
                $target.data("selectTexts", selectTexts);
                $target.data("selectIndexs", selectIndexs);
            },
            getSelectValues: function () {
                return $target.data("selectValues");
            },
            getSelectTexts: function () {
                return $target.data("selectTexts");
            },
            getSelectItems: function () {
                return $target.data("selectItems");
            },
            getSourceData: function () {
                return sourceData;
            }
        };

        function createInput() {
            var inp_html = [];
            inp_html.push('<div id="' + id + '_combobox2_down" class="combobox2_down ' + options.inputClass + '">');
            inp_html.push('<div class="combobox2_input"></div>');
            if (options.clear) inp_html.push('<span class="fa fa-times-circle combobox2_clear"></span>');
            inp_html.push('<span id="' + id + '_combobox2_arrow" class="fa fa-sort-desc combobox2_arrow" aria-hidden="true"></span>');
            inp_html.push('</div>');
            var $createInput = $(inp_html.join(""));
            $createInput.css({"width": options.inputWidth + "px", "height": options.inputHeight + "px"});
            $createInput.css({
                "margin-left": dw.marginLeft + "px",
                "margin-top": dw.marginTop + "px",
                "left": dw.left + "px",
                "top": dw.top + "px",
                "margin-right": dw.marginRight + "px",
                "right": dw.right + "px",
                "margin-bottom": dw.marginBottom + "px",
                "bottom": dw.bottom + "px"
            });
            //创建包裹元素
            $combobox2_wrap = $("<div></div>");
            $combobox2_wrap.css({"position": "relative", "display": dw.display});
            $combobox2_wrap.prop("id", id + "_combobox2_wrap");
            $target.after($combobox2_wrap);
            $combobox2_wrap.append($target);
            $combobox2_wrap.append($createInput);
            $combobox2_down = $("#" + id + "_combobox2_down");
            $combobox2_input = $combobox2_down.find(".combobox2_input");
            $combobox2_input.css("line-height", $combobox2_input.outerHeight() + "px");
            $combobox2_arrow = $combobox2_down.find(".combobox2_arrow");
            $combobox2_clear = $combobox2_down.find(".combobox2_clear");
            pw = {
                offsetLeft: $target[0].offsetLeft,
                offsetTop: $target[0].offsetTop
            };
            $target.hide();
        }

        function findSelect(list, setValues) {
            //debugger
            var options = $target.data("options");
            var sv = setValues || $target.val().split(options.splitStr);
            (list || datas).forEach(function (item, index) {
                sv.forEach(function (it, ind) {
                    if (it === item[options.valueField]) {
                        $combobox2_item.eq(item.index - 1).addClass("check").children(".combobox2_icheck").removeClass("fa-square-o").addClass("fa-check-square-o").css("color", options.icheckColor);
                        selectItems.push($.extend(true, {}, item));
                        selectValues.push(item[options.valueField]);
                        selectTexts.push(item[options.textField]);
                        selectIndexs.push(item.index);
                        $combobox2_input.text(selectTexts.join(options.splitStr));
                    }
                });
            });
            $target.data("selectItems", selectItems);
            $target.data("selectValues", selectValues);
            $target.data("selectTexts", selectTexts);
            $target.data("selectIndexs", selectIndexs);
        }

        function render() {
            if ($("#" + id).length > 0) {//多次绑定
                $("#" + id).remove();
            }
            var html = [];
            html.push('<div class="combobox2 ' + options.slideClass + '" id="' + id + '" style="width:');
            html.push(options.width + "px;");
            html.push('left:');
            html.push(pw.offsetLeft + options.offsetLeft + 'px;">');
            if (options.search) {
                html.push('<div class="combobox2_search"><input id="' + id + '_search_inp" class="combobox2_search_inp" /></div>');
            }
            html.push('<ul class="combobox2_list"');
            html.push(' style="height:');
            html.push(options.height + "px");
            html.push(';" >');
            datas.forEach(function (item, index) {
                html.push('<li class="combobox2_item">');
                html.push('<div class="combobox2_icheck fa fa-square-o"></div>');
                html.push('<div class="desc">');
                html.push(options.formatter(item));
                html.push('</div></li>');
            });
            html.push('</ul>');
            html.push('<div class="combobox2_btns"><div class="combobox2_sure">确定</div><!--<div class="combobox2_reset">取消</div>--></div>');
            html.push('</div>');
            $combobox2 = $(html.join(""));
            $combobox2_item = $combobox2.find(".combobox2_item");
            $combobox2_icheck = $combobox2.find(".combobox2_icheck");
            $combobox2_search_inp = $combobox2.find(".combobox2_search_inp");
            $combobox2_sure = $combobox2.find(".combobox2_sure");
            findSelect();
            $combobox2_wrap.append($combobox2);
            combobox2_height = $combobox2.height();
        }

        function dingwei() {
            return {
                "marginLeft": ayTools.getStyle(this, "marginLeft") || 0,
                "marginRight": ayTools.getStyle(this, "marginRight") || 0,
                "marginTop": ayTools.getStyle(this, "marginTop") || 0,
                "marginBottom": ayTools.getStyle(this, "marginBottom") || 0,
                "top": ayTools.getStyle(this, "top") || 0,
                "bottom": ayTools.getStyle(this, "bottom") || 0,
                "left": ayTools.getStyle(this, "left") || 0,
                "right": ayTools.getStyle(this, "right") || 0,
                "display": ayTools.getStyle(this, "display")
            }
        }

        function creatId() {
            id = "combobox2_" + $(".combobox2_down").length;
        }

        function addIndex(list) {
            datas = list.map(function (item, index, aa) {
                item.index = index + 1;
                return item;
            });
            $target.data("data", datas);
        }

        function loadData() {
            if (!options.url) {//本地查询
                sourceData = options.data;
                addIndex(options.data);
                render();
                bind();
                first = false;
            }
            else {
                $.ajax({
                    url: options.url,
                    type: options.method,
                    contentType: options.contentType,
                    dataType: 'json',
                    //async:false,
                    data: options.queryParams,
                    success: function (data) {
                        sourceData = data;
                        var res = options.responseHandler(data);
                        addIndex(res);
                        render();
                        bind();
                        first = false;
                    }
                });
            }
        }

        //事件绑定操作
        function bind() {
            $combobox2.bind("click", function (event) {
                event.stopPropagation();
            });

            var oldItems = [], oldIndexs = [], oldValues = [], oldTexts = []; //之前选择的值
            var selectItems2 = [], selectValues2 = [], selectIndexs2 = [], selectTexts2 = [];//在点击确定之前临时的缓存
            if (options.checkOnSelect) {  //如果设置为 true，当用户点击某一行时，则会选中/取消选中复选框。如果设置为 false 时，只有当用户点击了复选框时，才会选中/取消选中复选框
                $combobox2_item.css("cursor", "pointer");
                $combobox2_item.unbind().bind("click", function (event) {
                    event.stopPropagation();
                    select($(this));
                });
            } else {
                $combobox2_icheck.css("cursor", "pointer");
                $combobox2_icheck.unbind().bind("click", function (event) {
                    event.stopPropagation();
                    select($(this).parent());
                });
            }

            //$select --- combobox2_item
            function select($select) {
                //debugger
                var ind = $select.index();
                var currentItem = datas[ind];
                var currentValue = currentItem[options.valueField];
                var currentIndex = currentItem.index;
                var currentText = currentItem[options.textField];
                var st = $target.data("setType");
                if (st === "method") {
                    selectItems2 = $target.data("selectItems").slice(0);
                    selectValues2 = $target.data("selectValues").slice(0);
                    selectIndexs2 = $target.data("selectIndexs").slice(0);
                    selectTexts2 = $target.data("selectTexts").slice(0);
                }
                var $icheck = $select.toggleClass("check").children(".combobox2_icheck");
                $icheck.toggleClass("fa-square-o fa-check-square-o");
                if ($select.hasClass("check")) { //添加
                    $icheck.css("color", options.icheckColor);
                    var copyItem = $.extend({}, currentItem);
                    selectItems2.push(copyItem);
                    selectValues2.push(currentValue);
                    selectIndexs2.push(currentIndex);
                    selectTexts2.push(currentText);
                    //options.onSelect && options.onSelect(currentValue, currentIndex,currentItem);
                } else { //删除
                    $icheck.css("color", "#ccc");
                    for (var i = 0; i < selectItems2.length; i++) {
                        if (selectItems2[i][options.valueField] === currentValue) {
                            selectItems2.splice(i, 1);
                            selectValues2.splice(i, 1);
                            selectIndexs2.splice(i, 1);
                            selectTexts2.splice(i, 1);
                            break;
                        }
                    }
                }
                //排序
                selectItems2 = selectItems2.sort(function (a, b) {
                    return a.index > b.index;
                });
                selectIndexs2 = selectItems2.map(function (item) {
                    return item.index;
                });
                selectTexts2 = selectItems2.map(function (item) {
                    return item[options.textField];
                });
                selectValues2 = selectItems2.map(function (item) {
                    return item[options.valueField];
                });
                $combobox2_arrow.removeClass("fa-sort-asc").addClass("fa-sort-desc");
                $target.data("setType", "select");//设值方式
            }

            $combobox2_sure.unbind().bind("click", function (event) {
                event.stopPropagation();
                //debugger
                var setType = $target.data("setType");
                if (setType === "select") {
                    selectItems = selectItems2.slice(0);
                    selectIndexs = selectIndexs2.slice(0);
                    selectValues = selectValues2.slice(0);
                    selectTexts = selectTexts2.slice(0);
                    $target.data("selectItems", selectItems);
                    $target.data("selectIndexs", selectIndexs);
                    $target.data("selectValues", selectValues);
                    $target.data("selectTexts", selectTexts);
                }
                else if (setType === "method") {
                    selectItems = $target.data("selectItems");
                    selectIndexs = $target.data("selectIndexs");
                    selectValues = $target.data("selectValues");
                    selectTexts = $target.data("selectTexts");
                }
                $combobox2_input.text(selectTexts.join(options.splitStr));
                $target.val(selectValues.join(options.splitStr));
                if (oldValues.length === 0) {
                    options.onChange([], [], [], selectValues, selectIndexs, selectItems);
                } else {
                    /*if (JSON.stringify(oldValues) != JSON.stringify(selectValues)) {
                     options.onChange(oldValues,oldIndexs,oldItems,selectValues,selectIndexs,selectItems);
                     }*/
                    options.onChange(oldValues, oldIndexs, oldItems, selectValues, selectIndexs, selectItems);
                }
                //缓存上次选中的结果集
                oldValues = selectValues.slice(0);
                oldItems = selectItems.slice(0);
                oldIndexs = selectIndexs.slice(0);
                oldTexts = selectTexts.slice(0);
                method.hidePanel();
                //selectItems2=[];selectValues2=[];selectIndexs2=[],selectTexts2 = [];
                currentId = null, $tar = null, $arrow = null, $combo2 = null;$combo2_down = null;
                $combobox2_arrow.removeClass("fa-sort-asc").addClass("fa-sort-desc");
                $combobox2_search_inp.val("");
                $combobox2_item.show();
            });

            function cut() {
                event.stopPropagation();
                if ($combobox2.hasClass("show")) {
                    $combobox2.removeClass("show");//关闭操作
                    $combobox2_arrow.removeClass("fa-sort-asc").addClass("fa-sort-desc");
                    $combobox2_down.removeClass("active");
                    selectItems2 = [], selectIndexs2 = [], selectTexts2 = [], selectValues2 = [];
                } else {
                    //判断是否有其他打开项
                    $combobox2_down.addClass("active");
                    if (currentId && $tar && $arrow && $combo2) {
                        if (currentId != id) {
                            $body.trigger("click");
                        }
                    }
                    if (document.body.offsetHeight - $combobox2_down[0].getBoundingClientRect().bottom - options.offsetTop < combobox2_height) {
                        //向上展示
                        $combobox2.css({"top": pw.offsetTop - combobox2_height - options.offsetTop + "px"});
                    } else {
                        //向下展示
                        $combobox2.css({"top": pw.offsetTop + options.inputHeight + options.offsetTop + "px"});
                    }
                    $combobox2.addClass("show");//打开操作
                    $combobox2_arrow.removeClass("fa-sort-desc").addClass("fa-sort-asc");
                    selectItems2 = selectItems.slice(0);
                    selectIndexs2 = selectIndexs.slice(0);
                    selectTexts2 = selectTexts.slice(0);
                    selectValues2 = selectValues.slice(0);
                }
                currentId = id;
                $tar = $target;
                $combo2 = $combobox2;
                $arrow = $combobox2_arrow;
                $combo2_down = $combobox2_down;
            }

            if (options.triggerType === "input") {
                $combobox2_down.addClass("trigger");
                $combobox2_down.bind("click", cut);
            }
            else if (options.triggerType === "hover") {
                $combobox2_down.addClass("trigger");
                $combobox2_down.hover(
                    function () {
                        $combobox2.addClass("show");
                        $combobox2_arrow.removeClass("fa-sort-desc").addClass("fa-sort-asc");
                    },
                    function () {
                        $combobox2.removeClass("show");
                        $combobox2_arrow.removeClass("fa-sort-asc").addClass("fa-sort-desc");
                    }
                );
            }
            else if (options.triggerType === "arrow") {
                $combobox2_arrow.addClass("trigger");
                $combobox2_arrow.bind("click", cut);
            }

            if (options.clear) {
                $combobox2_down.hover(
                    function () {
                        $combobox2_clear.show();
                    },
                    function () {
                        $combobox2_clear.hide();
                    }
                );
                $combobox2_clear.bind("click", (function (event) {
                    var fr = first;
                    return function (event) {
                        event.stopPropagation();
                        $combobox2_input.text("");
                        $target.val("");
                        $combobox2_item.removeClass("check");
                        $combobox2_icheck.removeClass("fa-check-square-o").addClass("fa-square-o").css("color", "#ccc");
                        if (fr) {
                            options.onChange(selectValues, selectIndexs, selectItems, [], [], []);
                            selectItems = [], selectIndexs = [], selectTexts = [], selectValues = [];
                            selectItems2 = [], selectIndexs2 = [], selectTexts2 = [], selectValues2 = [];
                        } else {
                            selectItems = [], selectIndexs = [], selectTexts = [], selectValues = [];
                            selectItems2 = [], selectIndexs2 = [], selectTexts2 = [], selectValues2 = [];
                            options.onChange(oldIndexs, oldValues, oldItems, selectValues, selectIndexs, selectItems);
                            oldIndexs = "", oldValues = [], oldTexts = [], oldItems = [];
                        }
                        $target.data("selectItems", selectItems);
                        $target.data("selectIndexs", selectIndexs);
                        $target.data("selectValues", selectValues);
                        $target.data("selectTexts", selectTexts);
                        fr = false;
                    }
                })());
            }

            if (options.search) {
                $combobox2_search_inp.bind("click", function (event) {
                    event.stopPropagation();
                });
                $combobox2_search_inp.bind("input", function (event) {
                    event.stopPropagation();
                    var text = $(this).val();
                    if (text === "") {
                        $combobox2_item.show();
                    } else {
                        $combobox2_item.hide();
                        var reg = new RegExp(text, options.searchStrCase ? 'g' : 'gi');
                        if (typeof options.filter === 'function') {
                            datas.forEach(function (item, index) {
                                if (reg.test(options.filter(item, index))) {
                                    $combobox2_item.eq(item.index - 1).show();
                                }
                            });
                        } else {
                            datas.forEach(function (item, index) {
                                if (reg.test(item[options.textField])) {
                                    $combobox2_item.eq(item.index - 1).show();
                                }
                            });
                        }
                    }
                });
            }
        }

        if (typeof options_customer === "string") {//method
            return method[options_customer](customerValue);
        }
        else if (Object.prototype.toString.call(options_customer).toLowerCase() === "[object object]") {//object
            dw = dingwei.call(this[0]);
            /**
             * @namespace combobox2
             * @description 下拉选择多选
             * @version 1.0
             * @property {object}   options_default              - 默认的值
             * @property {number}   options_default.offsetLeft   - 左偏移(默认:0)
             * @property {number}   options_default.offsetTop    - 上偏移(默认:2)
             * @property {string}   options_default.splitStr     - 以什么分割input展示的textField,valueField(默认:',')
             * @property {string}   options_default.triggerType  - 触发下拉的方式 arrow(箭头触发),
             * input(富文本触发),hover(悬浮触发)(默认:'input')
             * @property {string}   options_default.valueField      - 自定义主键值(默认:'value')
             * @property {string}   options_default.textField    - 自定义文本(默认:'label')
             * @property {Object}   options_default.queryParams  - ajax查询条件参数(默认:{})
             * @property {boolean}  options_default.search       - 是否有搜索框(默认:true)
             * @property {boolean}  options_default.searchStrCase    - 搜索条件是否区分大小写(默认:false)
             * @property {boolean}  options_default.clear        - 是否有清除按钮(默认:true)
             * @property {string}   options_default.contentType  - 数据提交的编码方式(默认:'application/x-www-form-urlencoded;charset=UTF-8')
             * @property {string}   options_default.contentType  - 远程查询的路径 (默认:null) 如果没有设置就是本地查询
             * @property {string}   options_default.icheckColor  - 选中checkbox的颜色 (默认:'#3272bb')
             * @property {boolean}  options_default.checkOnSelect  - 选中一整行为选中,否则只有选择checkbox才能选中 (默认:false)
             * @property {string}   options_default.method       - 提交方式 (默认:'get')
             * @property {Object}   options_default.data         - 本地加载时数据源 (默认:[]) 默认格式是[{value:xxx1,label:yyy1},{value:xxx2,label:yyy2},....]
             * @property {number}   options_default.height       - 下拉选择框滚动区域的高度 (默认:200)
             * @property {number}   options_default.width        - 下拉选择框的宽度 注意: 最小值为175,小于175按照175算 (默认:175)
             * @property {number}   options_default.inputWidth   - 下拉选择框后生成的富文本宽度 注意: 最小值为175,小于175按照175算 (默认:175)
             * @property {number}   options_default.inputHeight  - 下拉选择框后生成的富文本度度 注意: 最小值为30,小于30按照30算 (默认:30)
             * @property {string}   options_default.slideClass   - 下拉框自定义添加的类样式名字 (默认:'')
             * @property {string}   options_default.inputClass   - 下拉选择框后生成的富文本的类样式名字 (默认:'')
             */
            var targetHeight = $(this).outerHeight();
            var targetWidth = $(this).outerWidth();
            options_default = {
                offsetLeft: 0,
                offsetTop: 2,
                splitStr: ',',//以什么分割input展示的textField,valueField
                triggerType: 'input',//arrow和input hover 3种方式 触发下拉的方式 点击箭头 input 点击这个框触发
                valueField: 'value',//value值
                textField: 'label',
                queryParams: {},//当服务端请求时所传递的参数
                search: true,//是否有搜索框
                searchStrCase: false,//搜索条件是否区分大小写
                clear: true,//是否有清除按钮
                contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
                url: null,
                icheckColor: '#3272bb',
                checkOnSelect: false,
                method: 'get',
                data: [],
                height: 200,//下拉框高度,超过了有滚动条
                width: targetWidth < 175 ? 175 : targetWidth, //容器宽度
                inputWidth: targetWidth < 175 ? 175 : targetWidth,
                inputHeight: targetHeight > 30 ? targetHeight : 30,
                slideClass: '',//下拉框类样式
                inputClass: '',//input框类样式
                /**
                 * @description 自定义筛选方法
                 * @memberof combobox2
                 * @inner
                 * @method filter
                 * @param {Object} item - 当前选择的项
                 * @return {string|number} 返回筛选后的text,通过textField进行比较
                 */
                filter: null,//过滤
                /**
                 * @description 格式化显示的通过textField进行比较
                 * @method formatter
                 * @inner
                 * @memberof combobox2
                 * @param {Object} item - 当前的项
                 * @return {string|number} 格式化后的text,通过textField进行比较
                 */
                formatter: function (item) {
                    return item[options["textField"]]
                },
                /**
                 * @description 自定义远程返回,当后台返回json格式不是自己想的格式时，自定义返回json格式
                 * @method responseHandler
                 * @inner
                 * @memberof combobox2
                 * @param {Object} item - 当前的项
                 * @example 后台返回{code:1,message:"成功",list:[]} 但我们只想要list
                 * 于是用到responseHandler responseHandler : function(res){return res.code === 1? res.list:[];}
                 * @return {Array} 自定义返回后json格式
                 */
                responseHandler: function (res) {
                    return res;
                },
                /**
                 * @description 选择后的如果值改变的事件
                 * @method onChange
                 * @inner
                 * @memberof combobox2
                 * @param {Object} oldValues - 之前的值
                 * @param {Object} oldIndexs - 之前的索引
                 * @param {Object} oldItems - 之前的项
                 * @param {Object} selectValues - 当的前值
                 * @param {Object} selectIndexs - 当前的索引
                 * @param {Object} selectItems - 当前的项
                 */
                onChange: function (oldValues, oldIndexs, oldItems, selectValues, selectIndexs, selectItems) {
                }
            };
            options = $.extend({}, options_default, options_customer);
            $target.data("options", options);
            $target.data("setType", "select");
            creatId();
            createInput.call(this);
            $target.data("combobox2_down", $combobox2_down);
            loadData();
            $target.data("combobox2", $combobox2);
        }
    };
});