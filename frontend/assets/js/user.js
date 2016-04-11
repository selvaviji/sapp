      $.ajax({
          url: '/users/userroles',
          type: 'get',
          dataType: 'json',
          contentType: 'application/json',
          success: function(data){
            //console.log("Data :"+data.roledata[0].role_name);
            //console.log("Data :"+data.roledata[0].role_name);
            var options = '<option value="">--Select UserRole--</option>';
            for (var i = 0; i < data.roledata.length; i++) {
               if(parseInt(roleid) < parseInt(data.roledata[i].role_id)){ 
		 if(eroleid == data.roledata[i].role_id){
                    options += '<option value="' + data.roledata[i].role_id + '" selected>' + data.roledata[i].role_name + '</option>';
                }else{    
                     options += '<option value="' + data.roledata[i].role_id + '">' + data.roledata[i].role_name + '</option>';
                }     
	      }	
            }
            //console.log("options :"+options);
            $("#user_type").html(options);
          }
      });

      $.ajax({
                url: '/site/customer',
                type: 'get',
                dataType: 'json',
                contentType: 'application/json',
                success: function(data){
                    //console.log("Data :"+data.custdata[0].customer_name);
                    var options = '<option value="">--Select Customer--</option>';
                    for (var i = 0; i < data.custdata.length; i++) {
                        options += '<option value="' + data.custdata[i].customer_id + '">' + data.custdata[i].customer_name + '</option>';
                    }
                    console.log("options :"+options);
                    $("#customer_id").html(options);
                }
      });
 

  $("#username").keyup(function(){
      alpha('username');
    });

    $("#username").blur(function(){
      alpha('username');
    });
    $("#password").keyup(function(){
      alpha1('password');
    });

    $("#password").blur(function(){
      alpha1('password');
    });
    $("#customer_id").change(function(){
      drop('customer_id');
    });
    $("#user_type").change(function(){
      drop('user_type');;
    });
 
