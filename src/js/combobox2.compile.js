$(function () {
    var $body = $("body");
    var currentId;
    var $tar;
    $body.bind("click", function () {
        if(!$tar || !$tar.data("options")) return;
        var options = $tar.data("options");
        var id = $tar.attr("data-href");
        var  $combo2 = $.manage[id]["$combobox2"];
        var $arrow = $.manage[id]["$combobox2_arrow"];
        var $combo2_down = $.manage[id]["$combobox2_down"];
        var $combo2_checkbox = $.manage[id]["$combobox2_checkbox"];
        $combo2.removeClass("show");
        $arrow.removeClass("fa-angle-up").addClass("fa-angle-down");
        var $combo2_item = $combo2.find(".combobox2_item");
        $combo2_item.show().removeClass("check");
        $combo2_item.children(".combobox2_icheck").removeClass(options.icheckTypeCheck).addClass(options.icheckTypeClear).css("color", options.icheckColorClear);
        if(options.isMultiSelect){
            $tar.data("selectItems").forEach(function (item, index) {
                $combo2.find(".combobox2_item").eq(item.index - 1).addClass("check").children(".combobox2_icheck").removeClass(options.icheckTypeClear).addClass(options.icheckTypeCheck).css("color", options.icheckColorCheck);
            });
            if($tar.data("selectAll")){
                $combo2_checkbox.removeClass("fa-square").addClass("fa-check-square");
            }else{
                $combo2_checkbox.removeClass("fa-check-square").addClass("fa-square");
            }
        }else{
            var selectIndex = $tar.data("selectIndex") || 1;//如果没有默认选中值且又没有选择--点击body
            $combo2.find(".combobox2_item").eq(selectIndex - 1).addClass("check").children(".combobox2_icheck").removeClass(options.icheckTypeClear).addClass(options.icheckTypeCheck).css("color", options.icheckColorCheck);
        }
        $combo2_down.removeClass("active");
        $combo2.find(".combobox2_search_inp").val("");
    });
    $.manage = {};
    $.fn.ayCombobox = function (options_customer, customerValue) {
        var $target = $(this);
        var $combobox2_wrap;
        var pw = $target.data("pw") || null;
        var dw = null;
        var combobox2_height;
        var id = $target.attr("data-href") || null;
        //数据格式[{value:'',text:'',selected:true}]
        var sourceData = null;
        var datas = null;
        var selectIndexs = [];//多选
        var selectValues = [];
        var selectTexts = [];
        var selectItems = [];

        var selectIndex = null;
        var selectValue = null;
        var selectText = null;
        var selectItem = null;
        var options_default = {};
        var options = {};

        var method = {
            "showPanel": function () {
                $.manage[id]["$combobox2"].addClass("show");
                $.manage[id]["$combobox2_arrow"].removeClass("fa-angle-down").addClass("fa-angle-up");
            },
            "hidePanel": function () {
                $.manage[id]["$combobox2"].removeClass("show");
                $.manage[id]["$combobox2_down"].removeClass("active");
                $.manage[id]["$combobox2_arrow"].removeClass("fa-angle-up").addClass("fa-angle-down");
            },
            getId: function () {
                return id;
            },
            clear: function(){
                $.manage[id]["$combobox2_input"].text("");
                $target.val("");
                $target.data("setType", "method");
                $.manage[id]["$combobox2_item"].removeClass("check");
                $.manage[id]["$combobox2_icheck"].removeClass(options.icheckTypeCheck).addClass(options.icheckTypeClear).css("color", options.icheckColorClear);
                if($target.data("options").isMultiSelect){
                    options.onChange($target.data("selectValues"), $target.data("selectItems"), $target.data("selectIndexs"), [], [], []);
                    $.manage[id].oldItems = [];
                    $.manage[id].oldValues = [];
                    $.manage[id].oldIndexs = [];
                    $.manage[id].oldTexts = [];
                    $target.data("selectItems", []);
                    $target.data("selectIndexs", []);
                    $target.data("selectValues", []);
                    $target.data("selectTexts", []);

                }else{
                    options.onChange($target.data("selectValue"),$target.data("selectItem"),$target.data("selectIndex"),null,null,null);
                    $target.data("selectItem",[]);
                    $target.data("selectValue",[]);
                    $target.data("selectIndex",[]);
                    $target.data("selectText",[]);
                }
            },
            getSelectIndexs: function () {
                return $target.data("selectIndexs");
            },
            setValues: function (values) {
                if (!(values instanceof Array)) throw new Error("setValues(array)方法传参类型错误");
                id = $target.attr("data-href");
                $target.data("setType", "method");
                $target.val(values.join(options.splitStr));
                var list = $target.data("data");
                var $combobox2_item = $.manage[id]["$combobox2"].find(".combobox2_item");
                var $combobox2_input = $.manage[id]["$combobox2_down"].find(".combobox2_input");
                $combobox2_item.removeClass("check").children(".combobox2_icheck").removeClass(options.icheckTypeCheck).addClass(options.icheckTypeClear).css("color", options.icheckColorClear);
                list.forEach(function (item, index) {
                    values.forEach(function (it, ind) {
                        if (it === item[options.valueField]) {
                            $combobox2_item.eq(item.index - 1).addClass("check").children(".combobox2_icheck").removeClass(options.icheckTypeClear).addClass(options.icheckTypeCheck).css("color", options.icheckColorCheck);
                            selectItems.push($.extend(true, {}, item));
                            selectValues.push(item[options.valueField]);
                            selectTexts.push(item[options.textField]);
                            selectIndexs.push(item.index);
                            $combobox2_input.text(selectTexts.join(options.splitStr));
                        }
                    });
                });
                options.onChange($target.data("selectValues"), $target.data("selectItems"), $target.data("selectIndexs"), selectValues, selectItems, selectIndexs);
                $.manage[id].oldItems = selectItems;
                $.manage[id].oldValues = selectValues;
                $.manage[id].oldIndexs = selectIndexs;
                $.manage[id].oldTexts = selectTexts;
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
            },
            reload: function(opt){
                options = $.extend({},$target.data("options"),opt);
                /*options.url = opt.url;
                options.data = opt.data;
                opt.param && (options.queryParams = opt.param);*/
                if(options.isMultiSelect){
                    $.manage[id].oldValues = [],$.manage[id].oldItems=[],$.manage[id].oldIndexs=[];
                }else{

                }
                $target.data("selectItems", []);
                $target.data("selectValues", []);
                $target.data("selectTexts", []);
                $target.data("selectIndexs", []);
                $target.data("setType", "method");
                //接触绑定之前的事件
                id = $target.attr("data-href");
                $.manage[id]["$combobox2_input"].text("");
                $.manage[id]["clearFirst"] = true;
                $.manage[id]["$combobox2"].unbind();
                $.manage[id]["$combobox2_down"].unbind();
                $.manage[id]["$combobox2_sure"].unbind();
                $.manage[id]["$combobox2_item"].unbind();
                $.manage[id]["$combobox2_icheck"].unbind();
                loadData();
            }
        };

        function createInput() {
            var inp_html = [];
            inp_html.push('<div id="' + id + '_combobox2_down" class="combobox2_down ' + options.inputClass + '">');
            inp_html.push('<div class="combobox2_input"></div>');
            if (options.clear) inp_html.push('<span class="fa fa-times-circle combobox2_clear"></span>');
            inp_html.push('<span id="' + id + '_combobox2_arrow" class="fa fa-angle-down combobox2_arrow" aria-hidden="true"></span>');
            inp_html.push('</div>');
            var $createInput = $(inp_html.join(""));
            //创建包裹元素
            $combobox2_wrap = $("<div></div>");
            $combobox2_wrap.css({"position": "relative", "display": dw.display});
            $combobox2_wrap.prop("id", id + "_combobox2_wrap");
            $target.after($combobox2_wrap);
            $combobox2_wrap.append($target);
            $combobox2_wrap.append($createInput);
            pw = {
                offsetLeft: $target[0].offsetLeft,
                offsetTop: $target[0].offsetTop
            };
            $target.data("pw",pw);
            $createInput.css({"width": options.inputWidth + "px", "height": options.inputHeight + "px"});
            $createInput.css({
                "margin-left": dw.marginLeft + "px",
                "margin-top": dw.marginTop + "px",
                "left": dw.left + "px",
                "top": dw.top + pw.offsetTop + "px",
                "margin-right": dw.marginRight + "px",
                "right": dw.right + "px",
                "margin-bottom": dw.marginBottom + "px",
                "bottom": dw.bottom + "px"
            });
            var $combobox2_down = $("#" + id + "_combobox2_down");
            var $combobox2_input = $combobox2_down.find(".combobox2_input");
            $combobox2_input.css("line-height", $combobox2_input.outerHeight() + "px");
            $.manage[id]["$combobox2_input"] = $combobox2_input;
            $.manage[id]["$combobox2_arrow"] = $combobox2_down.find(".combobox2_arrow");
            $.manage[id]["$combobox2_clear"] = $combobox2_down.find(".combobox2_clear");
            $.manage[id]["$combobox2_down"] = $combobox2_down;
            $target.hide();
        }

        function findSelect(list, setValues) {
            var sv = null;
            if(options.isMultiSelect){
                sv = setValues || $target.val().split(options.splitStr);
                (list || datas).forEach(function (item, index) {
                    sv.forEach(function (it, ind) {
                        if (it === item[options.valueField]) {
                            $.manage[id]["$combobox2_item"].eq(item.index - 1).addClass("check").children(".combobox2_icheck").removeClass(options.icheckTypeClear).addClass(options.icheckTypeCheck).css("color", options.icheckColorCheck);
                            selectItems.push($.extend(true, {}, item));
                            selectValues.push(item[options.valueField]);
                            selectTexts.push(item[options.textField]);
                            selectIndexs.push(item.index);
                            $.manage[id]["$combobox2_input"].text(selectTexts.join(options.splitStr));
                        }
                    });
                });
                //最初选择/绑定的值
                $.manage[id].oldItems = selectItems || [];
                $.manage[id].oldValues = selectValues || [];
                $.manage[id].oldIndexs = selectIndexs || [];
                $.manage[id].oldTexts = selectTexts || [];
                $target.data("dselectItems", selectItems);
                $target.data("dselectValues", selectValues);
                $target.data("dselectTexts", selectTexts);
                $target.data("dselectIndexs", selectIndexs);
                $target.data("selectItems", selectItems);
                $target.data("selectValues", selectValues);
                $target.data("selectTexts", selectTexts);
                $target.data("selectIndexs", selectIndexs);
            }else{
                sv = $target.val();
                (list || datas).forEach(function (item, index) {
                    if (sv === item[options.valueField]) {
                        $.manage[id]["$combobox2_item"].eq(item.index - 1).addClass("check").children(".combobox2_icheck").removeClass(options.icheckTypeClear).addClass(options.icheckTypeCheck).css("color", options.icheckColorCheck);
                        $.manage[id]["$combobox2_input"].text(item[options.textField]);
                        //最初选择/绑定的值
                        selectItem = $.extend(true, {}, item);
                        selectValue = item[options.valueField];
                        selectIndex = item.index;
                        selectText = item[options.textField];
                        $target.data("dselectItem", selectItem);
                        $target.data("dselectValue", selectValue);
                        $target.data("dselectText", selectText);
                        $target.data("dselectIndex", selectIndex);
                        $target.data("selectItem", selectItem);
                        $target.data("selectValue", selectValue);
                        $target.data("selectText", selectText);
                        $target.data("selectIndex", selectIndex);
                        return;
                    }
                });
            }
        }

        function loadList(){
            var html = [];
            datas.forEach(function (item, index) {
                html.push('<li class="combobox2_item">');
                html.push('<div class="combobox2_icheck fa '+options.icheckTypeClear+'"></div>');
                html.push('<div class="desc">');
                html.push(options.formatter(item));
                html.push('</div></li>');
            });
            $.manage[id]["$combobox2_list"].html(html.join(""));
            $.manage[id]["$combobox2_item"] = $.manage[id]["$combobox2_list"].find(".combobox2_item");
            $.manage[id]["$combobox2_icheck"] = $.manage[id]["$combobox2_list"].find(".combobox2_icheck");
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
                html.push('<div class="combobox2_search"><input id="' + id + '_search_inp" class="combobox2_search_inp" placeholder="请输入搜索项,');
                html.push(options.searchStrCase === false ? '不区分大小写' : '区分小小写');
                html.push('" /></div>');
            }
            html.push('<ul class="combobox2_list"');
            html.push(' style="height:');
            html.push(options.height + "px");
            html.push(';" >');
            html.push('</ul>');
            if(options.isMultiSelect){
                html.push('<div class="combobox2_btns"><div class="combobox2_select"><span class="combobox2_checklab">全选/反选</span><span class="combobox2_checkbox fa fa-square"></span></div><div class="combobox2_sure">确定</div></div>');
            }
            html.push('</div>');
            var $combobox2 = $(html.join(""));
            $combobox2_wrap.append($combobox2);
            $.manage[id]["$combobox2"] = $combobox2;
            $.manage[id]["$combobox2_list"] = $combobox2.find(".combobox2_list");
            $.manage[id]["$combobox2_search_inp"] = $combobox2.find(".combobox2_search_inp");
            $.manage[id]["$combobox2_checkbox"] = $combobox2.find(".combobox2_checkbox");
            $.manage[id]["$combobox2_sure"] = $combobox2.find(".combobox2_sure");
            loadList();
            findSelect();
            combobox2_height = $combobox2.height();
        }

        function dingwei() {
            return {
                "marginLeft": ayTools.getStyle(this, "marginLeft") || 0,
                "marginRight": ayTools.getStyle(this, "marginRight") || 0,
                "marginTop": ayTools.getStyle(this, "marginTop") || 0,
                "marginBottom": ayTools.getStyle(this, "marginBottom") || 0,
                "top": ayTools.getStyle(this, "top") === 'auto' || 0,
                "bottom": ayTools.getStyle(this, "bottom") === 'auto' || 0,
                "left": ayTools.getStyle(this, "left") === 'auto' || 0,
                "right": ayTools.getStyle(this, "right") === 'auto' || 0,
                "display": ayTools.getStyle(this, "display")
            }
        }

        function createId() {
            id = "combobox2_" + $(".combobox2_down").length;
            $.manage[id] = {loadFirst:true,clearFirst:true};
            $target.attr("data-href",id);
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
                if($.manage[id].loadFirst){
                    render();
                }else{
                    loadList();
                }
                bind();
                $.manage[id].loadFirst = false;
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
                        if($.manage[id].loadFirst){
                            render();
                            bind();
                        }else{
                            loadList();
                            bind();
                        }
                        $.manage[id].loadFirst = false;
                    }
                });
            }
        }

        //var oldItems = [], oldIndexs = [], oldValues = [], oldTexts = []; //之前选择的值
        var selectItems2 = [], selectValues2 = [], selectIndexs2 = [], selectTexts2 = [];//在点击确定之前临时的缓存
        //$select --- combobox2_item
        function select($select) {
            var ind = $select.index();
            var currentItem = datas[ind];
            var currentValue = currentItem[options.valueField];
            var currentIndex = currentItem.index;
            var currentText = currentItem[options.textField];
            var st = $target.data("setType");
            if (st === "method") {
                if(options.isMultiSelect){
                    selectItems2 = $target.data("selectItems").slice(0);
                    selectValues2 = $target.data("selectValues").slice(0);
                    selectIndexs2 = $target.data("selectIndexs").slice(0);
                    selectTexts2 = $target.data("selectTexts").slice(0);
                }
            }
            var $icheck = $select.children(".combobox2_icheck");
            if (!$select.hasClass("check")) { //添加
                if(options.isMultiSelect){
                    var copyItem = $.extend({}, currentItem);
                    selectItems2.push(copyItem);
                    selectValues2.push(currentValue);
                    selectIndexs2.push(currentIndex);
                    selectTexts2.push(currentText);
                }else{
                    $.manage[id]["$combobox2_item"].removeClass("check");
                    $.manage[id]["$combobox2_icheck"].removeClass(options.icheckTypeCheck).addClass(options.icheckTypeClear).css("color",options.icheckColorClear);
                    options.onChange(selectValue,selectItem,selectIndex,currentItem,currentIndex,currentValue);
                    selectItem = currentItem,selectIndex = currentIndex,selectValue = currentValue;selectText = currentText;
                    $target.data("selectItem",currentItem);
                    $target.data("selectValue",currentValue);
                    $target.data("selectIndex",currentIndex);
                    $target.data("selectText",currentText);
                    $target.val(currentValue);
                    $.manage[id]["$combobox2_input"].text(currentText);
                    method.hidePanel();
                }
                $select.addClass("check");
                $icheck.removeClass(options.icheckTypeClear).addClass(options.icheckTypeCheck);
                $icheck.css("color", options.icheckColorCheck);
                //options.onSelect && options.onSelect(currentValue, currentIndex,currentItem);
            } else { //删除
                if(options.isMultiSelect){
                    $select.addClass("check");
                    $icheck.css("color", options.icheckColorClear);
                    $icheck.removeClass(options.icheckTypeCheck).addClass(options.icheckTypeClear);
                    for (var i = 0; i < selectItems2.length; i++) {
                        if (selectItems2[i][options.valueField] === currentValue) {
                            selectItems2.splice(i, 1);
                            selectValues2.splice(i, 1);
                            selectIndexs2.splice(i, 1);
                            selectTexts2.splice(i, 1);
                            break;
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
                }else{
                    currentItem = null,currentIndex = null,currentValue = null,selectText = null;
                    options.onChange(selectValue,selectItem,selectIndex,currentValue,currentItem,currentIndex);
                    $target.data("selectItem",currentItem);
                    $target.data("selectValue",currentValue);
                    $target.data("selectIndex",currentIndex);
                    $target.data("selectText",currentText);
                    $target.val("");
                    $.manage[id]["$combobox2_input"].text("");
                    method.hidePanel();
                }
                $select.addClass("check");
                $icheck.css("color", options.icheckColorClear);
                $icheck.removeClass(options.icheckTypeCheck).addClass(options.icheckTypeClear);
            }
            $target.data("setType", "select");//设值方式
        }
        function bindList(){
            if (options.checkOnSelect) {  //如果设置为 true，当用户点击某一行时，则会选中/取消选中复选框。如果设置为 false 时，只有当用户点击了复选框时，才会选中/取消选中复选框
                $.manage[id]["$combobox2_item"].unbind().bind("click", function (event) {
                    event.stopPropagation();
                    select($(this));
                });
            } else {
                $.manage[id]["$combobox2_icheck"].unbind().bind("click", function (event) {
                    event.stopPropagation();
                    select($(this).parent());
                });
            }
        }

        function selectAll(event,type){
            event.stopPropagation();
            $target.data("setType","select");
            if(type === 'select'){
                $.manage[id]["$combobox2_item"].each(function(index,e){
                    if(!e.classList.contains("check")){
                        e.classList.add("check");
                        var icheck = e.firstElementChild;
                        icheck.classList.remove(options.icheckTypeClear);
                        icheck.classList.add(options.icheckTypeCheck);
                        icheck.style.color = options.icheckColorCheck;
                    }
                    selectItems2.push(datas[index]);
                    selectValues2.push(datas[index][options.valueField]);
                    selectIndexs2.push(datas[index].index);
                    selectTexts2.push(datas[index][options.textField]);
                });
            }
            else if(type === 'clear'){
                $.manage[id]["$combobox2_item"].removeClass("check");
                $.manage[id]["$combobox2_icheck"].removeClass(options.icheckTypeCheck).addClass(options.icheckTypeClear).css("color", options.icheckColorClear);
                selectItems2 = [];
                selectValues2 = [];
                selectIndexs2 = [];
                selectTexts2 = [];
            }
        }

        //点击叉号清除
        function clear(event){
            event.stopPropagation();
            $.manage[id]["$combobox2_input"].text("");
            $target.val("");
            $.manage[id]["$combobox2_item"].removeClass("check");
            $.manage[id]["$combobox2_icheck"].removeClass(options.icheckTypeCheck).addClass(options.icheckTypeClear).css("color", options.icheckColorClear);
            if ($.manage[id].clearFirst || $target.data("setType")==="method") {
                if(options.isMultiSelect){
                    options.onChange(selectValues,selectItems,selectIndexs, [], [], []);
                    selectItems = [], selectIndexs = [], selectTexts = [], selectValues = [];
                    selectItems2 = [], selectIndexs2 = [], selectTexts2 = [], selectValues2 = [];
                    $.manage[id].oldIndexs = [], $.manage[id].oldValues = [], $.manage[id].oldTexts = [], $.manage[id].oldItems = [];
                }else{
                    options.onChange(selectValue,selectItem,selectIndex , null, null, null);
                    selectValue=null, selectIndex=null, selectItem=null,selectText=null;
                }
            } else {
                if(options.isMultiSelect){
                    selectItems = [], selectIndexs = [], selectTexts = [], selectValues = [];
                    selectItems2 = [], selectIndexs2 = [], selectTexts2 = [], selectValues2 = [];
                    options.onChange(oldValues,oldItems,oldIndexs, selectValues,selectItems ,selectIndexs);
                    $.manage[id].oldIndexs = [], $.manage[id].oldValues = [], $.manage[id].oldTexts = [], $.manage[id].oldItems = [];
                }else{
                    options.onChange(selectValue,selectItem ,selectIndex, null, null, null);
                    selectValue=null, selectIndex=null, selectItem=null,selectText=null;
                }
            }
            $target.data("selectItems", selectItems);
            $target.data("selectIndexs", selectIndexs);
            $target.data("selectValues", selectValues);
            $target.data("selectTexts", selectTexts);
            $.manage[id].clearFirst = false;
        }

        //事件绑定操作
        function bind() {
            $.manage[id]["$combobox2"].unbind().bind("click", function (event) {
                event.stopPropagation();
            });
            bindList();
            //全选/反选
            $.manage[id]["$combobox2_checkbox"].unbind().bind("click",function(event){
                $(this).toggleClass("fa-square fa-check-square");
                if($(this).hasClass("fa-check-square")){ //全选
                    selectAll(event,"select");
                }else{  //反选
                    selectAll(event,"clear");
                }
            });
            $.manage[id]["$combobox2_sure"].unbind().bind("click", function (event) {
                event.stopPropagation();
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
                if(options.isMultiSelect){
                    if($.manage[id]["$combobox2_checkbox"].hasClass("fa-check-square")){
                        $target.data("selectAll",true);
                    }else{
                        $target.data("selectAll",false);
                    }
                }
                $.manage[id]["$combobox2_input"].text(selectTexts.join(options.splitStr));
                $target.val(selectValues.join(options.splitStr));
                options.onChange($.manage[id].oldValues,$.manage[id].oldItems,$.manage[id].oldIndexs, selectValues,selectItems, selectIndexs);
                //缓存上次选中的结果集
                $.manage[id].oldValues = selectValues.slice(0);
                $.manage[id].oldItems = selectItems.slice(0);
                $.manage[id].oldIndexs = selectIndexs.slice(0);
                $.manage[id].oldTexts = selectTexts.slice(0);
                currentId = null, $tar = null;
                selectItems2 = [],selectIndexs = [],selectValues2=[],selectTexts2=[];
                method.hidePanel();
                $.manage[id]["$combobox2_search_inp"].val("");
                $.manage[id]["$combobox2_item"].show();
            });

            function cut() {
                event.stopPropagation();
                if ($.manage[id]["$combobox2"].hasClass("show")) {
                    $.manage[id]["$combobox2"].removeClass("show");//关闭操作
                    $.manage[id]["$combobox2_down"].removeClass("active");
                    method.hidePanel();
                    selectItems2 = [], selectIndexs2 = [], selectTexts2 = [], selectValues2 = [];
                } else {
                    //判断是否有其他打开项
                    $.manage[id]["$combobox2_down"].addClass("active");
                    if (currentId && $tar) {
                        if (currentId != id) {
                            $body.trigger("click");
                        }
                    }
                    if (document.body.offsetHeight - $.manage[id]["$combobox2_down"][0].getBoundingClientRect().bottom - options.offsetTop < combobox2_height) {
                        //向上展示
                        $.manage[id]["$combobox2"].css({"top": pw.offsetTop - combobox2_height - 2 - options.offsetTop + "px"});//2 表示边框
                    } else {
                        //向下展示
                        $.manage[id]["$combobox2"].css({"top": pw.offsetTop + options.inputHeight + options.offsetTop + "px"});
                    }
                    //打开操作
                    method.showPanel();
                    selectItems2 = selectItems.slice(0);
                    selectIndexs2 = selectIndexs.slice(0);
                    selectTexts2 = selectTexts.slice(0);
                    selectValues2 = selectValues.slice(0);
                }
                currentId = id;
                $tar = $target;
            }

            if (options.triggerType === "input") {
                $.manage[id]["$combobox2_down"].addClass("trigger");
                $.manage[id]["$combobox2_down"].unbind().bind("click", cut);
            }
            else if (options.triggerType === "hover") {
                $.manage[id]["$combobox2_down"].addClass("trigger");
                $.manage[id]["$combobox2_down"].hover(
                    function () {
                        $.manage[id]["$combobox2"].addClass("show");
                        $.manage[id]["$combobox2_arrow"].removeClass("fa-angle-down").addClass("fa-angle-up");
                    },
                    function () {
                        $.manage[id]["$combobox2"].removeClass("show");
                        $.manage[id]["$combobox2_arrow"].removeClass("fa-angle-up").addClass("fa-angle-down");
                    }
                );
            }
            else if (options.triggerType === "arrow") {
                $.manage[id]["$combobox2_arrow"].addClass("trigger");
                $.manage[id]["$combobox2_arrow"].unbind().bind("click", cut);
            }

            if (options.clear) {
                $.manage[id]["$combobox2_down"].hover(
                    function () {
                        $.manage[id]["$combobox2_clear"].show();
                    },
                    function () {
                        $.manage[id]["$combobox2_clear"].hide();
                    }
                );
                $.manage[id]["$combobox2_clear"].unbind().bind("click", clear);
            }

            if (options.search) {
                $.manage[id]["$combobox2_search_inp"].unbind().bind("click", function (event) {
                    event.stopPropagation();
                });
                $.manage[id]["$combobox2_search_inp"].unbind().bind("input", function (event) {
                    event.stopPropagation();
                    var text = $(this).val();
                    if (text === "") {
                        $.manage[id]["$combobox2_item"].show();
                    } else {
                        $.manage[id]["$combobox2_item"].hide();
                        var reg = new RegExp(text, options.searchStrCase ? 'g' : 'gi');
                        if (typeof options.filter === 'function') {
                            datas.forEach(function (item, index) {
                                if (reg.test(options.filter(item, index))) {
                                    $.manage[id]["$combobox2_item"].eq(item.index - 1).show();
                                }
                            });
                        } else {
                            datas.forEach(function (item, index) {
                                if (reg.test(item[options.textField])) {
                                    $.manage[id]["$combobox2_item"].eq(item.index - 1).show();
                                }
                            });
                        }
                    }
                });
            }
        }

        if (typeof options_customer === "string") { //method
            $target.data("selectAll",false);//默认全选是false
            options = $target.data("options");
            return method[options_customer](customerValue);
        }
        else if (Object.prototype.toString.call(options_customer) === "[object Object]") {//object
            $target.data("selectAll",false);//默认全选是false
            dw = dingwei.call(this[0]);
            /**
             * @namespace combobox2
             * @description 下拉选择多选
             * @version 2.0
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
             * @property {string}   options_default.icheckColorCheck  - 选中checkbox的颜色 (默认:'#3272bb')
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
                isMultiSelect: false,
                queryParams: {},//当服务端请求时所传递的参数
                search: true,//是否有搜索框
                searchStrCase: false,//搜索条件是否区分大小写
                clear: true,//是否有清除按钮
                contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
                url: null,
                icheckTypeClear: options_customer.isMultiSelect ? 'fa-square-o' : 'fa-circle-o',//默认单选,font图标类样式 font-awsome
                icheckTypeCheck: options_customer.isMultiSelect ? 'fa-check-square-o' : 'fa-dot-circle-o',
                icheckColorCheck: '#40AFFE',
                icheckColorClear: '#ccc',
                checkOnSelect: false,
                method: 'get',
                data: [],
                height: 200,//下拉框高度,超过了有滚动条
                width: targetWidth < 170 ? 170 : targetWidth, //容器宽度
                inputWidth: targetWidth < 170 ? 170 : targetWidth,
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
                onChange: function (oldValues,oldItems ,oldIndexs, selectValues,selectItems ,selectIndexs) {
                }
            };
            options = $.extend({}, options_default, options_customer);
            $target.data("options", options);
            $target.data("setType", "select");
            createId();
            createInput.call(this);
            loadData();
        }
    };
});