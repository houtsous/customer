/**
 * Created by admin on 2018/3/8.
 */
$(function(){
    $("#aaa").ayCombobox({
        data:[
            {value:'java',label:'JAVA'},{value:'c',label:'C'},
            {value:'php',label:'PHP'},{value:'python',label:'PYTHON'},
            {value:'c++',label:'C++'},{value:'c#',label:'C#'}],
        isMultiSelect:true,
        clear:true,search:true,onChange:function(oldValues,oldItems,oldIndexs,newValues,newItems,newIndexs){
            console.log("onChange............");
            console.log(oldValues,oldItems,oldIndexs,newValues,newItems,newIndexs);
        }
    });
    $("#test").click(function(){
        $("#aaa").ayCombobox("clear");
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

    $("#ccc").bind("click",function(){
        $("#bbb").ayCombobox("reload",{
            url:'http://localhost:7001/customer/src/data/data2.json'
        });
    });

    $("#eee").ayCombobox({
        data:[
            {value:'ljr',label:'梁静茹'},{value:'zjl',label:'周杰伦'},
            {value:'ljj',label:'林俊杰'},{value:'she',label:'SHE'}],
        clear:true,search:true,isMultiSelect:false,onChange:function(oldValues,oldItems,oldIndexs,newValues,newItems,newIndexs){
            console.log("onChange............");
            console.log(oldValues,oldItems,oldIndexs,newValues,newItems,newIndexs);
        }
    });
    var $subject = $("[name='subject']");
    $("#setValues").click(function(){
        var values = [];
        $subject.filter(":checked").each(function(i,e){
            values.push($(this).val())
        });
        $("#aaa").ayCombobox("setValues",values);
    });
});
