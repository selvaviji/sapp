$(function(){
      //To get site information 
      getAJAXCall('/report/getsiteinfo','get','','SiteInfo');
       //To get customer information
      getAJAXCall('/report/getcustInfo','get','','CustInfo');
    
    //exporting csv file
    $("#exl").click(function(){
        var param = document.getElementById("sqlquery").value;
        getAJAXCall('/report/exporting','post','{"sqlquery":"' + param + '"}','Excel');
    })    
    //exporting pdf file
    $("#pdf").click(function(){
        var param = document.getElementById("sqlquery").value;
        getAJAXCall('/report/exporting','post','{"sqlquery":"' + param + '"}','PDF');
    })  

    //submiting customerid while select from dropdownbox
    $('#customer_id').change(function(){
     $('#frmpageid').submit();
    });

    $('#rowsperpageval').change(function(){
     $('#frmpageid').submit();
    });

});

//pdf function start
function JSONToPDF(pdfdatas){
     var str="";
     var count=-1;
        var timestamparr=[];
        var diarr=[];
        var opentimestatus=0;
        var closetimestatus=0;
        var closetimedata;
    if(customerresult.length==1){
     str+="<h4>Shutter report for "+(customerresult[0].customer_name).toUpperCase()+"  "+" dated on "+moment(fromdate).format('DD-MM-YYYY')+" To "+moment(todate).format('DD-MM-YYYY')+"</h4>";
    }else{
     str+="<h4>Shutter report for All Customer dated on "+moment(fromdate).format('DD-MM-YYYY')+" To "+moment(todate).format('DD-MM-YYYY')+"</h4>";
    }
                             str+="<h4>"+"Created date:"+moment(Date().slice(0,24)).format('DD-MM-YYYY H:mm:ss')+"</h4>"+
                              "<table id='customers'><thead><tr><th>Site ID</th>"+
                                "<th>Site Name</th>"+
                                "<th>Customer</th>"+
                                "<th>Open Time</th>"+
                                "<th>Close Time</th>"+
                                "</tr></thead>";
                                for(var i=0;i<pdfdatas.Fullcustdata.length;i++)
                                {
                                    //console.log(pdfdatas.Fullcustdata[i].siteid);
                                    str+="<tr><td>"+pdfdatas.Fullcustdata[i].siteid+"</td>"+
                                    "<td>"+pdfdatas.Fullcustdata[i].site_name+"</td>"+
                                    "<td>"+pdfdatas.Fullcustdata[i].customer_name+"</td>";
                                    timestamparr=pdfdatas.Fullcustdata[i].timestamp.split(",");
                                    console.log("time="+timestamparr);
                                    diarr=pdfdatas.Fullcustdata[i].Di20.split(",");
                                    for(var j=0;j<diarr.length;j++){
                                        if(opentimestatus==0 && diarr[j]==2){
                                            str+="<td>"+moment(timestamparr[j]).format('DD-MM-YYYY H:mm:ss')+"</td>";
                                                    opentimestatus=1;
                                        }
                                        if(diarr[j]==3){
                                            closetimeval=j;
                                            closetimestatus=1;
                                        }
                                    }
                                    if(opentimestatus==0){
                                        str+="<td>NO Data</td>";
                                    }
                                    if(closetimestatus==1){
                                        str+="<td>"+moment(timestamparr[closetimeval]).format('DD-MM-YYYY H:mm:ss')+"</td>";
                                    }else if(closetimestatus==0){
                                        str+="<td>NO Data</td>";
                                    }
                                        opentimestatus=0;
                                        closetimestatus=0;
                                        str+="</tr>";
                                    }                
                                str+="</table>";
                                document.getElementById("k1").innerHTML=str;
                                
                                var pdf = new jsPDF('l', 'pt', 'a2');
                                source = $("#k1")[0];
                        // we support special element handlers. Register them with jQuery-style 
                        // ID selector for either ID or node name. ("#iAmID", "div", "span" etc.)
                        // There is no support for any other type of selectors 
                        // (class, of compound) at this time.
                        specialElementHandlers = {
                            '#bypassme': function(element, renderer) {
                                // true = "handled elsewhere, bypass text extraction"
                                return true
                            }
                        };
                        margins = {
                            top: 20,
                            bottom: 60,
                            left: 40,
                            width: 522
                        };
                        // all coords and widths are in jsPDF instance's declared units
                        // 'inches' in this case
                        pdf.fromHTML(
                            source, // HTML string or DOM elem ref.
                            margins.left, // x coord
                            margins.top, {// y coord
                                'width': margins.width, // max width of content on PDF
                                'elementHandlers': specialElementHandlers
                            },
                            function(dispose) {
                                // dispose: object with X, Y of the last line add to the PDF 
                                //          this allow the insertion of new lines after html
                                pdf.save("shutter_"+moment(Date().slice(0,24)).format('DD-MM-YYYY H:mm:ss')+'.pdf');
                            }, margins
    );
}//end Pdf function

//Displying in CSV Format 
function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
        //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
        var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
        var CSV = '';    
        var count=-1;
        var timestamparr=[];
        var diarr=[];
        var opentimestatus=0;
        var closetimestatus=0;
        var closetimedata;
        //Set Report title in first row or line
        CSV += ReportTitle + '\r\n\n';
        //This condition will generate the Label/Header
        if (ShowLabel) {
             var row = "";
        //This loop will extract the label from 1st index of on array
            row+="Site ID"+","+"Site Name"+","+"Customer"+","+"  Open Time"+","+"Close Time ";
                               
                 row = row.slice(0, -1);
            //append Label row with line break
            CSV += row + '\r\n';
        }     
        //1st loop is to extract each row
        for (var i = 0; i < arrData.length; i++) {
             var row = "";
            //console.log("array length"+arrData.length);
            //2nd loop will extract each column and convert it in string comma-seprated
            for (var index in arrData[i]) {
                //console.log("index :"+index+" Data:"+arrData[i][index]);
                if(index == 'timestamp'){
                    timestamparr=arrData[i].timestamp.split(",");
                    //console.log("time="+timestamparr);
                    diarr=arrData[i].Di20.split(",");
                        for(var j=0;j<diarr.length;j++){
                            //console.log("index"+j+"timestamp"+timestamparr[j]+"di20"+diarr[j]+"siteid"+outageDatas[count].siteid);
                                if(opentimestatus==0 && diarr[j]==2){
                                     row+= moment(timestamparr[j]).format('DD-MM-YYYY H:mm:ss')+",";
                                     opentimestatus=1;
                                }
                                if(diarr[j]==3){
                                    closetimeval=j;
                                    closetimestatus=1;
                                }
                        }
                            if(opentimestatus==0){
                                row+="No Data "+",";
                            }
                            if(closetimestatus==1){
                               row+=moment(timestamparr[closetimeval]).format('DD-MM-YYYY H:mm:ss');
                            }else if(closetimestatus==0){
                                row+="No Data";
                            }
                                 opentimestatus=0;
                                 closetimestatus=0;            
                }else if (index== 'Di20' ){
                    row+="";
                }else{
                    row += '"' + arrData[i][index] + '",';
                }
            }
                row.slice(0, row.length - 1);
            //add a line break after each row
                 CSV += row + '\r\n';
        }

        if (CSV == '') {        
             alert("Invalid data");
             return;
        }   
        
        //Generate a file name
        var fileName = "shutter_"+moment(Date().slice(0,24)).format('DD-MM-YYYY H:mm:ss');
        //this will remove the blank-spaces from the title and replace it with an underscore
        fileName += ReportTitle.replace(/ /g,"_");   
        
        //Initialize file format you want csv or xls
        var uri = 'data:text/xls;charset=utf-8,' + escape(CSV);
        
        // Now the little tricky part.
        // you can use either>> window.open(uri);
        // but this will not work in some browsers
        // or you will not get the correct file extension    
        
        //this trick will generate a temp <a /> tag
        var link = document.createElement("a");    
        link.href = uri;
        
        //set the visibility hidden so it will not effect on your web-layout
        link.style = "visibility:hidden";
        link.download =fileName+moment(Date().slice(0,24)).format('DD-MM-YYYY H:mm:ss') +".csv";
        
        //this part will append the anchor tag and remove it after automatic click
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
}
//display excel  format function ends           

function getAJAXCall(urlstr,methodtype,datas,module){
    $.ajax({
        url: urlstr,
        type: methodtype,
        dataType: 'json',
        data : datas,
        contentType: 'application/json',
        success: function(data){
           //customer Name dropdown box module
            if(module == 'CustInfo'){
                var options = '<option value="">--All--</option>';
                for (var i = 0; i < data.custdata.length; i++) {
                    if(custid == data.custdata[i].customer_id){
                        options += '<option value="' + data.custdata[i].customer_id + '" selected>' + data.custdata[i].customer_name + '</option>';    
                    }else{    
                        options += '<option value="' + data.custdata[i].customer_id + '">' + data.custdata[i].customer_name + '</option>';
                    }
                }
                $("#customer_id").html(options);
             //Site Name dropdown box module
            }else if(module == 'SiteInfo'){
                sid = siteid.split(",");
                //console.log("data sid"+data.custdata);
                var options = '';
                for (var i = 0; i < data.custdata.length; i++) {
                    options += '<option value="' + data.custdata[i].site_code + '" >' + data.custdata[i].site_code + '</option>';

                }

                $("#siteid").html(options);  
                window.testSelAll = $('.testSelAll').SumoSelect({okCancelInMulti:false, selectAll:true });
                for(var i=0; i<sid.length; i++){
                    for(var j=0; j<data.custdata.length; j++){
                        if(sid[i] == data.custdata[j].site_code){
                            $('select.testSelAll')[0].sumo.selectItem(j)          
                        }    
                    }
                }
            }else if(module == 'Excel'){
                var arr2=[];
                arr2=data.Fullcustdata;
                     if(customerresult.length==1){
                      JSONToCSVConvertor(arr2, "Shutter report for "+(customerresult[0].customer_name).toUpperCase()+" dated on "+ moment(fromdate).format('DD-MM-YYYY')+" To "+moment(todate).format('DD-MM-YYYY'), true);
                    }else{
                       JSONToCSVConvertor(arr2, "Shutter report for All Customer dated on "+ moment(fromdate).format('DD-MM-YYYY')+" To "+moment(todate).format('DD-MM-YYYY'), true);   
                    }
             //exporting pdf file module
            }else if(module == 'PDF'){
                var arr2=data;
                JSONToPDF(arr2);
            } 
        }//end of success function
    });
 }   
 