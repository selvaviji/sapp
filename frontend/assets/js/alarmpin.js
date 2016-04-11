$(document).ready(function(){
            
            UpdateEdit = function (id){
                var ID=id;
                //console.log("Id :"+ID);
                //console.log("pinno:"+document.getElementById("alarmpin_no_input_"+ID).value);
                var pin_no=$("#alarmpin_no_input_"+ID).val();
                var pin_name=$("#alarmpin_name_input_"+ID).val();
                var pin_sc=$("#alarmpin_sc_input_"+ID).val();
                //var cb = $('#alarmpin_status_input_'+ID);
                //console.log("STATUS :"+cb.is(':checked'));
                var curlcmd=$("#curl_"+ID).val();
                var pin_status;
                var pin_tt;
                if($("#alarmpin_status_input_"+ID).prop('checked') == true){
                    pin_status = "0";
                }else{
                    pin_status = "1";
                }

                if($("#alarmpin_tt_input_"+ID).prop('checked') == true){
                    pin_tt = "0";
                }else{
                    pin_tt = "1";
                }
                //var pin_status=$("#alarmpin_status_input_"+ID).val();
                var pin_priority = $("#alarmpin_priority_input_"+ID).val();
                $.ajax({
                        type: "POST",
                        url: "/alarmpin/update",
                        data: { curl: curlcmd, alarmpinno: pin_no, alarmpinname: pin_name, alarmpinsc: pin_sc, alarmpinstatus: pin_status, alarmpinpriority: pin_priority, alarmpintt: pin_tt,alarmpinid: ID },
                        cache: false,
                        success: function(html){
                           alert('Success!');
                        } 
                        ,error: function(jqXHR, textStatus, err){
                            alert('text status '+textStatus+', err '+err);
                        }
                });
                
            }

            $.ajax({
                url: '/site/customer',
                type: 'get',
                dataType: 'json',
                contentType: 'application/json',
                success: function(data){
                    //console.log("Data :"+data.custdata[0].customer_name);
                    var options = '<option value="0">--Select Customer--</option>';
                    for (var i = 0; i < data.custdata.length; i++) {
                        if(customid == data.custdata[i].customer_id){
                            options += '<option value="' + data.custdata[i].customer_id + '" selected>' + data.custdata[i].customer_name + '</option>';
                        }else{    
                        options += '<option value="' + data.custdata[i].customer_id + '">' + data.custdata[i].customer_name + '</option>';
                        }
                    }
                    console.log("options :"+options);
                    $("#customer_id").html(options);
                }
            });

});


var setSelectValue = function (priorityid,pinid) {
        console.log("set Triggered :"+priorityid);
            $.ajax({
              url: '/alarmpin/priorities',
              type: 'get',
              dataType: 'json',
              contentType: 'application/json',
              success: function(data){

                //console.log("Data :"+data.roledata[0].role_name);
                var options = '<option value="0">--Select Priority--</option>';
                for (var i = 0; i < data.custdata.length; i++) {
                    if(priorityid == data.custdata[i].pin_id){
                        options += '<option value="' + data.custdata[i].pin_id + '" selected>' + data.custdata[i].pin_name + '</option>';
                    }else{    
                         options += '<option value="' + data.custdata[i].pin_id + '">' + data.custdata[i].pin_name + '</option>';
                    }     
                }
                //console.log("options :"+options);
                $("#alarmpin_priority_input_"+pinid).html(options);
                //setSelectValue('user_type', roleid);
              }
          });
        }    