var array=[];
var fieldsdata=[];
function ticketdisplay(arr,arr1)
{
	 array=arr;
	 fieldsdata=arr1;
	console.log(arr);
   	var str=" <table class='uk-table uk-table-striped uk-table-hover'><thead><tr>"+"<th>Check Box</th>"+
            "<th>Alarm Id</th>"+"<th>SiteID</th>"+"<th>Ticket Desc</th>"+"<th>Ticket State</th>"+
            "<th>Created Date</th>"+"<th>Updated Date</th>"+"<th>Assign Status</th>"+"<th>Assign Date</th></thead></tr></thead>";
    for(i=0;i<arr.length;i++)
    {
    	 k=arr[i].ticket_id;
    	 str+='<tr>'+'<td>'+'<input type="checkbox" name="chkuser[]" onchange="fun1('+k+')"  >'+
                  '</td><td>'+arr[i].alarmid+'</td><td>'+arr[i].site_id+
                  '</td><td>'+arr[i].ticket_desc+'</td><td>'+arr[i].ticket_state+
                  '</td><td>'+arr[i].created_date+'</td><td>'+arr[i].updated_date+
                  '</td><td>'+arr[i].assign_status+'</td><td>'+arr[i].assign_date+'</td></tr>';

    }
     str+='</table>';  
     document.getElementById("tabledata").innerHTML=str;                      

 }
 var checkboxval=[];
 function fun1(k)
 {  
    checkboxval.push(k);
 }

 function change()
 {
 	console.log("change entered"+checkboxval);
 	var dropdownval=document.getElementById("fieldsupervisor").value;
 	
 	console.log("dropvalue"+dropdownval); 
 	for(i=0;i<fieldsdata.length;i++)
 	{
       if(fieldsdata[i].user_name==dropdownval)
       {
       	 var dropdownid=fieldsdata[i].user_id;
       	 console.log("dropdownid"+dropdownid);
       }
 	}	
     $.ajax({
                url: '/assignticket/assigntickt',
                type: 'POST',
                cache: false, 
                data: { recordids:checkboxval,idval:dropdownid}, 
                    success: function(data){
                        alert('Success!');
                    }
                    ,error: function(jqXHR, textStatus, err){
                        alert('text status '+textStatus+', err '+err);
                    }
            });
 	     window.location.href='/assignticket'; 

 }

 