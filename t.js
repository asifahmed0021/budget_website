var budgetController= (function(){

    function expense(id,description,value){
        this.id=id;
        this.description=description;
        this.value=value;
    }

    function income(id,description,value){
        this.id=id;
        this.description=description;
        this.value=value;
    }

    var data={
        allitems:{
            exp:[],
            inc:[]
        },
        totals:{
            exp:0,
            inc:0
        },
        budget:0
    };

    function updatetotals(type){
        var sum=0;
        for(var i=0;i<data.allitems[type].length;i++){
            sum+=data.allitems[type][i].value;
        }
        data.totals[type]=sum;
        return sum;
    }

    return {
        addindata: function(type,desc,val){
            var item;
            if(data.allitems[type].length>0){
                var id=(data.allitems[type][data.allitems[type].length -1]).id +1;
            }
            else{
                var id=0;
            }
            if(type==="exp"){
                item=new expense(id,desc,val);
                data.allitems.exp.push(item);
            }
            else{
                item=new income(id,desc,val);
                data.allitems.inc.push(item);
            }
            return item;
        },

        deletefromdata:function(type,myid){
            var ids,index=0;
            //getting the ids array
            ids=data.allitems[type].map(function(current){
                return current.id;
            });

            //getting index which is to be deleted
            for(index=0;index<ids.length;index++){
                if(ids[index]==myid){
                    break;
                }
            }
            data.allitems[type].splice(index,1);
            
        },

        updatebudget: function(){
            //update total values in data
            var exptotal= updatetotals("exp");
            var inctotal= updatetotals("inc");
            //update budget (inc-exp)
            data.budget=data.totals.inc - data.totals.exp;
            return {
                budget:data.budget,
                inc:inctotal,
                exp:exptotal

            }


        },

        displaydata:function(){
            console.log(data);

        }
    }


    



})();



var uiController=(function(){

    var ut={dclass:".textinput",vclass:".intvalue",tclass:".addtype",expense_container:".expense_container",income_container:".income_container"};
    
    return{
 
        
        getinput: function(){
            return{
                desc:document.querySelector(ut.dclass).value,
                val: parseFloat(document.querySelector(ut.vclass).value),
                type:document.querySelector(ut.tclass).value
            }

        },

        getutils: function(){
            return ut;
        },

        updatebudgetui: function(budget){
            console.log(budget);
            document.querySelector(".budget").textContent='$'+budget.budget;
            document.querySelector(".inval").textContent='$'+budget.inc;
            document.querySelector(".exval").textContent='$'+budget.exp;

        },

        clearfields: function(){
            document.querySelector(ut.dclass).value="";
            document.querySelector(ut.vclass).value="";
            document.querySelector(ut.tclass).value="inc";
            document.querySelector(ut.dclass).focus();
            var x=document.querySelector(".textinput");
            var y=document.querySelector(".intvalue");
            x.classList.add("blueclass");
            y.classList.add("blueclass");
            x.classList.remove("redclass");
            y.classList.remove("redclass");

        },

        deletefromui: function(itemid){
            var el=document.getElementById(itemid);
            el.parentNode.removeChild(el);

        },

        addtotable:function(item,type){
            if(type==="exp"){
                var htmlstring='<div class="entry" id= %id% ><h2 class="desc"> %desc% </h2><input type="image" src="delete.png" class="del" id="btn"></input><h2 class="valex"> %val% </h2></div>';
                var newhtmlstring;
                newhtmlstring=htmlstring.replace('%desc%',item.description);
                newhtmlstring=newhtmlstring.replace('%val%','$'+item.value);
                newhtmlstring=newhtmlstring.replace('%id%','exp-'+item.id);


                document.querySelector(ut.expense_container).insertAdjacentHTML('beforeend',newhtmlstring);

            }

            else{
                var htmlstring='<div class="entry" id=%id% ><h2 class="desc"> %desc% </h2><input type="image" src="delete.png" class="del" id="btn"></input><h2 class="valin"> %val% </h2></div>';
                var newhtmlstring;
                newhtmlstring=htmlstring.replace('%desc%',item.description);
                newhtmlstring=newhtmlstring.replace('%val%','$'+item.value);
                newhtmlstring=newhtmlstring.replace('%id%','inc-'+item.id);
                document.querySelector(ut.income_container).insertAdjacentHTML('beforeend',newhtmlstring);

            }

        }


        
    } 




})();



var appController=(function(){


    var ut=uiController.getutils(); 
    function addEntry(){
        //1)Read from input
        var input=uiController.getinput();

        if(input.desc!=="" && !isNaN(input.val) && input.val>0){
        //2)Add the entry in data
        var item=budgetController.addindata(uiController.getinput().type,uiController.getinput().desc,uiController.getinput().val);
        //3)Update in UI
        uiController.addtotable(item,input.type);
        //4)clear input fields
        uiController.clearfields();
        //5)update budget data
        var budget=budgetController.updatebudget();
        console.log(budgetController.updatebudget());
        //6)update budget in ui
        uiController.updatebudgetui(budget);

        }


    }
    document.querySelector(".ok").addEventListener("click",addEntry);
    document.querySelector(".bottom").addEventListener("click",deletefunc);
    
    function deletefunc(event){
        var entry,arr;
        if(event.target.id==="btn"){
            entry=event.target.parentNode.id;
            arr=entry.split("-");
            //delete from data
            budgetController.deletefromdata(arr[0],arr[1]);
            //delete from ui
            uiController.deletefromui(entry);
            //update budget data
            var budget=budgetController.updatebudget();
            console.log(budgetController.updatebudget());
            //6)update budget in ui
            uiController.updatebudgetui(budget);

        }
        
    }
    

    x=document.querySelector(".textinput");
    y=document.querySelector(".intvalue");
    z=document.querySelector(".addtype");
    document.addEventListener("keyup",function(event){
        if(event.key==="Tab"){
            func();
        }
    })

    x.addEventListener("click",func);
    y.addEventListener("click",func);

    function func(){
        var t=document.querySelector(".addtype").value;
        if(t==="inc"){
            //add blue hover class in both
            x.classList.add("blueclass");
            y.classList.add("blueclass");
            x.classList.remove("redclass");
            y.classList.remove("redclass");
        }
        else{
            //add red cover class in both
            x.classList.add("redclass");
            y.classList.add("redclass");
            x.classList.remove("blueclass");
            y.classList.remove("blueclass");
        }
    }


})();
