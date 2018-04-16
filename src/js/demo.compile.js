/**
 * Created by admin on 2018/3/8.
 */
$(function(){
    $("#aaa").ayCombobox({
        data:[
            {value:'java',label:'JAVA'},{value:'c',label:'C'},
            {value:'php',label:'PHP'},{value:'python',label:'PYTHON'},
            {value:'c++',label:'C++'},{value:'c#',label:'C#'},{value:'rube',label:'Rube'},{value:'jsp',label:'Jsp'}],
        isMultiSelect:true,
        clear:true,search:true,onChange:function(oldValues,oldItems,oldIndexs,newValues,newItems,newIndexs){
            console.log("onChange............");
            console.log(oldValues,oldItems,oldIndexs,newValues,newItems,newIndexs);
        }
    });
    $("#test").click(function(){
        $("#bbb").ayCombobox("clear");
    });
    $("#bbb").ayCombobox({
        url:'http://localhost:7001/customer/src/data/data.json',
        isMultiSelect:true,
        clear:true,search:false,responseHandler:function(data){
            if(data.code === 1){
                return data.list;
            }else{
                return [];
            }
        },onChange:function(oldValues,oldItems,oldIndexs,newValues,newItems,newIndexs){
            console.log("onChange............");
            console.log(oldValues,oldItems,oldIndexs,newValues,newItems,newIndexs);
        }
    });

    $("#rebinds").bind("click",function(){
        $("#bbb").ayCombobox("reload",{
            url:'http://localhost:7001/customer/src/data/data2.json'
            /*data:[{"value":"apple","label":"Apple"},{"value":"orange","label":"Orange"},
                {"value":"mango","label":"Mango"},{"value":"blueberry","label":"Blueberry"}]*/
        });
    });

    $("#rebind").bind("click",function(){
        $("#eee").ayCombobox("reload",{
            url:'http://localhost:7001/customer/src/data/data2.json'
        });
    });

    $("#eee").ayCombobox({
        data:[
            {value:'ljr',label:'梁静茹'},{value:'zjl',label:'周杰伦'},
            {value:'ljj',label:'林俊杰'},{value:'she',label:'SHE'}],
        isMultiSelect:false,responseHandler:function(data){
            if(data.code === 1){
                return data.list;
            }else{
                return [];
            }
        },
        clear:true,search:false,onChange:function(oldValues,oldItems,oldIndexs,newValues,newItems,newIndexs){
            console.log("onChange............");
            console.log(oldValues,oldItems,oldIndexs,newValues,newItems,newIndexs);
        }
    });

    //重新绑定--多选

    /*var $subject = $("[name='subject']");
    $("#setValues").click(function(){
        var values = [];
        $subject.filter(":checked").each(function(i,e){
            values.push($(this).val())
        });
        $("#aaa").ayCombobox("setValues",values);
    });

    var $fruit = $("[name='fruit']");
    $("#setValue").click(function(){
        var value = $fruit.filter(":checked").val();
        $("#eee").ayCombobox("setValue",value);
    });*/


});
