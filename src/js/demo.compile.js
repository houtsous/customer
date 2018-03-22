/**
 * Created by admin on 2018/3/8.
 */
$(function(){
    $("#aaa").ayCombobox({
        data:[
            {value:'java',label:'JAVA'},{value:'c',label:'C'},
            {value:'php',label:'PHP'},{value:'python',label:'PYTHON'},
            {value:'c++',label:'C++'},{value:'c#',label:'C#'}],
        clear:true,search:true,onChange:function(oldValues,oldIndexs,oldItems,newValues,newIndexs,newItems){
            console.log("onChange............");
            console.log(oldValues,oldIndexs,oldItems,newValues,newIndexs,newItems);
        }
    });
    $("#bbb").ayCombobox({
        url:'http://localhost:7001/customer/src/data/data.json',
        clear:true,search:false,responseHandler:function(data){
            if(data.code === 1){
                return data.list;
            }else{
                return [];
            }
        },onChange:function(oldValues,oldIndexs,oldItems,newValues,newIndexs,newItems){
            console.log("onChange............");
            console.log(oldValues,oldIndexs,oldItems,newValues,newIndexs,newItems);
        }
    });

    $("#ccc").bind("click",function(){
        $("#bbb").ayCombobox("reload",{
            url:'http://localhost:7001/customer/src/data/data2.json'
        });
    });
});
