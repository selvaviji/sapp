
        $(function(){
            
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


            $.ajax({
                url: '/site/msp',
                type: 'get',
                dataType: 'json',
                contentType: 'application/json',
                success: function(data){
                    //console.log("Data :"+data.custdata[0].customer_name);
                    var options = '<option value="">--Select MSP--</option>';
                    for (var i = 0; i < data.custdata.length; i++) {
                        options += '<option value="' + data.custdata[i].msp_id + '">' + data.custdata[i].msp_name + '</option>';
                    }
                    console.log("options :"+options);
                    $("#site_msp").html(options);
                }
            });
         
        })


    $("#customer_id").change(function(){
      drop('customer_id');
    });
    $("#area_name").keyup(function(){
      alpha1('area_name');
    });
    $("#area_name").blur(function(){
      alpha1('area_name');
    });
    $("#site_code").keyup(function(){
      alpha1('site_code');
    });
    $("#site_code").blur(function(){
      alpha1('site_code');
    });
    $("#site_name").keyup(function(){
      alpha('site_name');
    });
    $("#site_name").blur(function(){
      alpha('site_name');
    });
    $("#site_pincode").keyup(function(){
      num('site_pincode');
    });
    $("#site_pincode").blur(function(){
      num('site_pincode');
    });