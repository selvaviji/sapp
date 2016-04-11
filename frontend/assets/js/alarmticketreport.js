
function ticketdisplay(arr)
{
	  
	console.log("hi");
   	var str=" <table class='uk-table uk-table-striped uk-table-hover'><thead><tr>"+
            "<th>Ticket ID</th>"+"<th>Site ID</th>"+"<th>Ticket Remark</th>"+"<th>Recorded Date</th>"+
            "<th>Assign To</th></tr></thead>";
            var temp="";
    for(i=0;i<arr.length;i++)
    { 
    	 k=arr[i].id;
    	
             if(temp!=arr[i].ticket_id)
             {
                 str+= '<tr><td>'+arr[i].ticket_id+'</td><td>'+arr[i].site_id+
                  '</td>';
                  temp=arr[i].ticket_id;
             }
             else
             {
              str+='<td>&nbsp</td>'+'<td>&nbsp</td>';
             }

               str+= '<td>'+arr[i].ticket_remark+'</td><td>'+arr[i].recorded_date+
                  '</td><td>'+arr[i].assign_to+'</td></tr>';

    }
     str+='</table>';  
     document.getElementById("tabledata").innerHTML=str;                      

 }


 