$(function(){
   
    //DropDown box 
      getAJAXCall('/assignsite/country','get','','CountryInfo');
      getAJAXCall('/assignsite/user','get','','UserInfo');
      

    $('#country_id').change(function(){
      $('#frmpageid').submit();
    });

    $('#zone_id').change(function(){
      $('#frmpageid').submit();
    });

    $('#state_id').change(function(){
      $('#frmpageid').submit();
    });

    $('#district_id').change(function(){
      $('#frmpageid').submit();
    });

    $('#area_id').change(function(){
      $('#frmpageid').submit();
    });

   /* $('#user_id').change(function(){
      $('#frmpageid').submit();
    });*/

    //zone combobox
    var options = '<option value="">--All--</option>';
        for (var i=0; i<zoneresults.length; i++) {
             //console.log("zoneresults=="+zoneresults[i].zone_id);
            if(zone_id == zoneresults[i].zone_id){
                options += '<option value="' + zoneresults[i].zone_id + '" selected>' + zoneresults[i].zone_name + '</option>';    
                }else{    
                options += '<option value="' + zoneresults[i].zone_id + '">' + zoneresults[i].zone_name + '</option>';
            }
        }
    $("#zone_id").html(options);

    //state combobox
    var options = '<option value="">--All--</option>';
        for (var i=0; i<stateresults.length; i++) {
             //console.log("stateresults=="+stateresults[i].state_id);
            if(state_id == stateresults[i].state_id){
                options += '<option value="' + stateresults[i].state_id + '" selected>' + stateresults[i].state_name + '</option>';    
                }else{    
                options += '<option value="' + stateresults[i].state_id + '">' + stateresults[i].state_name + '</option>';
            }
        }
    $("#state_id").html(options); 

     //district combobox
    var options = '<option value="">--All--</option>';
        for (var i=0; i<distresults.length; i++) {
             //console.log("distresults=="+distresults[i].district_id);
            if(district_id == distresults[i].district_id){
                options += '<option value="' + distresults[i].district_id + '" selected>' + distresults[i].district_name + '</option>';    
                }else{    
                options += '<option value="' + distresults[i].district_id + '">' + distresults[i].district_name + '</option>';
            }
        }
    $("#district_id").html(options);

     //area combobox
    var options = '<option value="">--All--</option>';
        for (var i=0; i<arearesults.length; i++) {
             //console.log("arearesults=="+arearesults[i].area_id);
            if(area_id == arearesults[i].area_id){
                options += '<option value="' + arearesults[i].area_id + '" selected>' + arearesults[i].area_name + '</option>';    
                }else{    
                options += '<option value="' + arearesults[i].area_id + '">' + arearesults[i].area_name + '</option>';
            }
        }
    $("#area_id").html(options); 




});  
    
 


function getAJAXCall(urlstr,methodtype,datas,module){
    $.ajax({
        url: urlstr,
        type: methodtype,
        dataType: 'json',
        data : datas,
        contentType: 'application/json',
        success: function(data){
            if(module == 'CountryInfo'){
                var options = '<option value="">--All--</option>';
                for (var i = 0; i < data.custdata.length; i++) {
                    if(country_id == data.custdata[i].country_id){
                        options += '<option value="' + data.custdata[i].country_id + '" selected>' + data.custdata[i].country_name + '</option>';    
                    }else{    
                        options += '<option value="' + data.custdata[i].country_id + '">' + data.custdata[i].country_name + '</option>';
                    }
                }
               // console.log("cid=="+country_id);
                $("#country_id").html(options);
            }else if(module == 'UserInfo'){

                var options = '<option value="">--Select User--</option>';
                for (var i = 0; i < data.custdata.length; i++) {
                    if(user_id == data.custdata[i].user_id){
                       options += '<option value="' + data.custdata[i].user_id + '" selected>' + data.custdata[i].user_name + '</option>';    
                    }else{    
                         options += '<option value="' + data.custdata[i].user_id + '">' + data.custdata[i].user_name + '</option>';
                    }
                }
                console.log("uid=="+user_id);
                $("#user_id").html(options);
            }
        }//end of success function
    });  
}
