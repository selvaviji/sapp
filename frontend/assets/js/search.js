
    
/**************USER ROLE************/
                
    function userRole_display(user)
    {
      var arr=user;
      var str='<table class="uk-table uk-table-striped">'+'<thead>'+'<tr>'+'<th><strong><input type="checkbox" id="chkall" onclick="setCheckboxValues(this);"></strong></th>'+
               '<th><strong>Role Name</strong></th>'+'<th><strong>Description</strong></th>'+'<th><strong>Created Date</strong></th>'+'<th><strong>Updated Date</strong></th>'+
               '<th><strong>Operation</strong></th>'+'</tr>'+'</thead>';
       var searchVal=document.getElementById("search").value;
                    //console.log(searchVal);s
       for(var i=0;i<=arr.length-1;i++)
        {
          var roleNameVal=arr[i].role_name;
          var searchValLeng=searchVal.length;
                        //console.log("hi"+s1);
          var roleNameLeng=roleNameVal.slice(0,searchValLeng);
          console.log(roleNameLeng);
          if((roleNameLeng.toUpperCase()==searchVal.toUpperCase()) || searchValLeng==0)
            {
                           //console.log(arr[i].role_name);
             str+='<tr>'+'<td>'+'<input type="checkbox" name="chkuser[]"  >'+
                  '</td><td>'+arr[i].role_name+'</td><td>'+arr[i].role_desc+
                  '</td><td>'+arr[i].created_date+'</td><td>'+arr[i].updated_date+
                  '</td><td><a href="/userrole/edit/">Edit</a></td></tr>';

            }
        }
            str+='</table>';  
            document.getElementById("k1").innerHTML=str;                      

    }    
                
/*****MSP******/
                
function msp_display(user)
{
    var arr=user;
    console.log("lll");
    var str='<table class="uk-table uk-table-striped">'+'<thead>'+'<tr>'+'<th><strong><input type="checkbox" id="chkall" onclick="setCheckboxValues(this);"></strong></th>'+
            '<th><strong>msp_id</strong></th>'+'<th><strong>msp_name</strong></th>'+'<th><strong>msp_desc</strong></th>'+
            '<th><strong>created_date</strong></th>'+'<th><strong>updated_date</strong></th>'+'</tr>'+'</thead>';
                    
     var searchVal=document.getElementById("search").value;
     console.log(searchVal);
     for(var i=0;i<=arr.length-1;i++)
    {
      var roleNameVal=arr[i].msp_name;
      var searchValLeng=searchVal.length;
       //console.log("hi"+s1);
      var roleNameLeng=roleNameVal.slice(0,searchValLeng);
      console.log(roleNameLeng);               
      if((roleNameLeng.toUpperCase()==searchVal.toUpperCase()) || searchValLeng==0 )
        {
           str+='<tr>'+'<td><input type="checkbox" name="chkuser[]"  ></td>'+'<td>'+arr[i].msp_id+
                '</td><td>'+arr[i].msp_name+'</td><td>'+arr[i].msp_desc+'</td><td>'+arr[i].created_date+
                '</td><td>'+arr[i].updated_date+'</td></tr>';
        }
    }
        str+='</table>';  
        document.getElementById("k1").innerHTML=str;                      

}  


 //..............Pin type

function pin_display(user)
{
    var arr=user;
    console.log("lll");
    var str='<table class="uk-table uk-table-striped">'+'<thead>'+'<tr>'+
            '<th><strong><input type="checkbox" id="chkall"  onclick="setCheckboxValues(this);"></strong></th>'+
            '<th><strong>pin_id</strong></th>'+ 
            '<th><strong>pin_name</strong></th>'+
            '<th><strong>pin_desc</strong></th>'+
            '<th><strong>pin_color</strong></th>'+
            '<th><strong>created_date</strong></th>'+
            '<th><strong>updated_date</strong></th>'+ 
            '</tr>'+'</thead>';
    var searchVal=document.getElementById("search").value;
    console.log(searchVal);
    for(var i=0;i<=arr.length-1;i++)
    {  
        var roleNameVal=arr[i].pin_name;
        var searchValLeng=searchVal.length;
                        //console.log("hi"+s1);
        var roleNameLeng=roleNameVal.slice(0,searchValLeng);
        console.log(roleNameLeng);
        if((roleNameLeng.toUpperCase()==searchVal.toUpperCase()) || searchValLeng==0 )
            {
                           //console.log(arr[i].role_name);
                str+='<tr>'+'<td><input type="checkbox" name="chkuser[]"  ></td>'+
                     '<td>'+arr[i].pin_id+'</td><td>'+arr[i].pin_name+
                     '</td><td>'+arr[i].pin_desc+'</td><td>'+arr[i].pin_color+
                     '</td><td>'+arr[i].created_date+
                    '</td><td>'+arr[i].updated_date+'</td></tr>';


            }
    }
                str+='</table>';  
                 document.getElementById("k1").innerHTML=str;                      

}



//************************Customer*************

function customer_display(user)
{
    var arr=user;
    console.log("lll");
    var str='<table class="uk-table uk-table-striped">'+'<thead>'+'<tr>'+
            '<th><strong><input type="checkbox" id="chkall" onclick="setCheckboxValues(this);"></strong></th>'+
            '<th><strong>Customer Name</strong></th>'+'<th><strong>Display Name</strong></th>'+
            '<th><strong>Logo</strong></th>'+'<th><strong>Status</strong></th>'+
            '<th><strong>Created Date</strong></th>'+'<th><strong>Updated Date</strong></th>'+
            '<th><strong>Operation</strong></th>'+'</tr>'+'</thead>';
    var searchVal=document.getElementById("search").value;
    console.log(searchVal);
    for(var i=0;i<=arr.length-1;i++)
        {
            var customerNameVal=arr[i].customer_name;
            var dispNameVal=arr[i].display_name;
            var userstatus = "Disable";
            if(arr[i].user_status == '0'){
              userstatus = "Enable";
            }
            var searchValLeng=searchVal.length;
            //console.log("hi"+s1);
            var customerNameLeng=customerNameVal.slice(0,searchValLeng);
            var dispNameLeng=dispNameVal.slice(0,searchValLeng);
                        //console.log(roleNameLeng);
             if((customerNameLeng.toUpperCase()==searchVal.toUpperCase()) || (dispNameLeng.toUpperCase()==searchVal.toUpperCase()) || (searchValLeng==0))
                {
                    //console.log(arr[i].role_name);
                    str+='<tr>'+'<td><input type="checkbox" name="chkuser[]"  ></td>'+
                         '<td>'+arr[i].customer_name+'</td><td>'+arr[i].display_name+
                         '</td><td><img src='+"/uploads/"+arr[i].logo_name+' width="50px" height="50px"/></td>'+
                         '<td>'+userstatus+'</td><td>'+arr[i].created_date+
                         '</td><td>'+arr[i].updated_date+'</td>'+
                         '<td><a href='+"/customer/edit/"+arr[i].user_id+'>Edit</a></td></tr>';

                         
                }
        }
            str+='</table>';  
            document.getElementById("k1").innerHTML=str;                      

}          

    //******************USER...........
function user_display(user)
{
    var arr=user;
    console.log("lll");
    var str='<table class="uk-table uk-table-striped">'+'<thead>'+'<tr>'+
            '<th><strong><input type="checkbox" id="chkall" onclick="setCheckboxValues(this);"></strong></th>'+
            '<th><strong>user_id</strong></th>'+
            '<th><strong>user_name</strong></th>'+
            '<th><strong>pass_word</strong></th>'+
            '<th><strong>user_status</strong></th>'+
            '<th><strong>role_id</strong></th>'+
            '<th><strong>created_date</strong></th>'+
            '<th><strong>updated_date</strong></th>'+
            '<th><strong>customer_name</strong></th>'+
            '<th><strong>logo_name</strong></th>'+
            '<th><strong>display_name</strong></th>'+
            '</tr>'+'</thead>';
    var searchVal=document.getElementById("search").value;
    console.log(searchVal);
    for(var i=0;i<=arr.length-1;i++)
        {  
            var roleNameVal=arr[i].user_name;
            var searchValLeng=searchVal.length;
            //console.log("hi"+s1);
            var roleNameLeng=roleNameVal.slice(0,searchValLeng);  
            console.log(roleNameLeng);
            if((roleNameLeng.toUpperCase()==searchVal.toUpperCase()) || searchValLeng==0 )
               {
                //console.log(arr[i].role_name);
                str+='<tr>'+'<td><input type="checkbox" name="chkuser[]"  ></td>'+
                     '<td>'+arr[i].user_id+'</td><td>'+arr[i].user_name+
                     '</td><td>'+arr[i].pass_word+
                     '</td><td>'+arr[i].user_status+
                     '</td><td>'+arr[i].role_id+
                     '</td><td>'+arr[i].created_date+
                     '</td><td>'+arr[i].updated_date+
                     '</td><td>'+arr[i].customer_name+
                     '</td><td>'+arr[i].logo_name+
                     '</td><td>'+arr[i].display_name+
                     '</td></tr>';
                }
        }
            str+='</table>';  
            document.getElementById("k1").innerHTML=str;                      

}          



//***************USER
function site_display(user)
 {
    var arr=user;
    console.log("lll");
    var str='<table class="uk-table uk-table-striped">'+
            '<thead>'+'<tr>'+
            '<th><strong><input type="checkbox" id="chkall" onclick="setCheckboxValues(this);"></strong></th>'+
            '<th><strong>site_id</strong></th>'+
            '<th><strong>site_name</strong></th>'+
            '<th><strong>site_status</strong></th>'+
            '<th><strong>video_link</strong></th>'+
            '<th><strong>created_date</strong></th>'+
            '<th><strong>updated_date</strong></th>'+
            '<th><strong>Operation</strong></th>'+
            '</tr>'+'</thead>';
    var searchVal=document.getElementById("search").value;
    console.log(searchVal);
    if(arr!=undefined)
    {
    for(var i=0;i<=arr.length-1;i++)
        {
            var roleNameVal=arr[i].site_name;
            var searchValLeng=searchVal.length;
            var roleNameLeng=roleNameVal.slice(0,searchValLeng);  
            console.log(roleNameLeng);
            if((roleNameLeng.toUpperCase()==searchVal.toUpperCase()) || (searchValLeng==0) )
                {
                   //console.log(arr[i].role_name);
                    str+='<tr>'+
                          '<td><input type="checkbox" name="chkuser[]"  ></td>'+
                          '<td>'+arr[i].site_id+
                          '</td><td>'+arr[i].site_name+
                          '</td><td>'+arr[i].pass_word+
                          '</td><td>'+arr[i].site_status+
                          '</td><td>'+arr[i].video_link+
                          '</td><td>'+arr[i].created_date+
                          '</td><td>'+arr[i].updated_date+
                          '</td><td>'+arr[i].Operation+
                          '</td></tr>';
                }
        }
    }
        str+='</table>';  
        document.getElementById("k1").innerHTML=str;                      

} 


