$(function(){
    
    getAJAXCall('/report/getsiteinfo','get','','SiteInfo');
    
    $("#exl").click(function(){
        var param = document.getElementById("sqlquery").value;
        getAJAXCall('/report/exporting','post','{"sqlquery":"' + param + '"}','Excel');
    })    

    $("#pdf").click(function(){
        var param = document.getElementById("sqlquery").value;
        getAJAXCall('/report/exporting','post','{"sqlquery":"' + param + '"}','PDF');
    })    

    $('#page_id').change(function(){
         $('#frmpageid').submit();
    }); 
 
    
    
});

//reset page
function refreshPage1(){
    window.location.href= "/report/chest-door";
}
//end reset

//pdf function start
function JSONToPDF(pdfdatas){
    console.log("Length :"+pdfdatas.Fullcustdata.length);
    var str="<h4>"+"Report:Alarm Panel"+"</h4>"+
                             "<h4>"+"Current date:"+moment(Date().slice(0,24)).format('DD-MM-YYYY H:mm:ss')+"</h4>"+
                              "<table id='customers'><thead><tr><th>SiteId</th>"+
                                "<th>Site Name</th>"+
                                "<th>Type</th>"+
                                "<th>Status</th>"+
                                "<th>Open Time</th>"+
                                "<th>Close Time</th>"+
                                "<th>AlarmPin Name</th>"+
                                "</tr></thead>";
                                for(var i=0;i<pdfdatas.Fullcustdata.length;i++)
                                {
                                    console.log(pdfdatas.Fullcustdata[i].siteid);
                                    str+="<tr><td>"+pdfdatas.Fullcustdata[i].siteid+"</td>"+
                                    "<td>"+pdfdatas.Fullcustdata[i].site_name+"</td>";
                                    
                                    if(pdfdatas.Fullcustdata[i].alarmdata_alarmtype=='0')
                                         {
                                             str+="<td>"+"Alarm" +"</td>";
                                         }
                                    if(pdfdatas.Fullcustdata[i].alarmdata_alarmstatus=='0')
                                         {
                                             str+="<td>"+"Alarm Close" +"</td>";
                                         }

                                    else{
                                             str+="<td>"+"Alarm Open" +"</td>";
                                     }   
                                    str+="<td>"+moment(pdfdatas.Fullcustdata[i].alarmdata_opentime).format('DD-MM-YYYY H:mm:ss') +"</td>"+
                                    "<td>"+moment(pdfdatas.Fullcustdata[i].alarmdata_closetime).format('DD-MM-YYYY H:mm:ss') +"</td>"+
                                    "<td>"+pdfdatas.Fullcustdata[i].alarmdata_alarmpin+"</td></tr>";

                                }
                                 str+="</table>";
                                 var table1=document.createElement('div');
                                 table1.id="k1";
                                document.getElementById("k1").innerHTML=str;
                                /*if(document.getElementById("k1") != null){
                                        var idPost=document.getElementById("k1").innerHTML;
                                }*/

                                var pdf = new jsPDF('l', 'pt', 'a3');
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
                                pdf.save('ap_rpt_'+moment(Date().slice(0,24)).format('DD-MM-YYYY H:mm:ss')+'.pdf');
                            }, margins
    );
}//end Pdf function

//Displying in XLS Format start
function JSONToXLSConvertor(JSONData, ReportTitle, ShowLabel) {
        //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
        var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
        var CSV = '';    
        //Set Report title in first row or line
        CSV += ReportTitle + '\r\n\n';
        //This condition will generate the Label/Header
        if (ShowLabel) {
             var row = "";
        //This loop will extract the label from 1st index of on array
            for (var index in arrData[0]) {
                if(index != 'alarmdata_alarmpin'){
                //Now convert each value to string and comma-seprated
                 row += index.toUpperCase() + ',';
                } 
            }
                 row = row.slice(0, -1);
            //append Label row with line break
            CSV += row + '\r\n';
        }
        
        //1st loop is to extract each row
        for (var i = 0; i < arrData.length; i++) {
             var row = "";
            
            //2nd loop will extract each column and convert it in string comma-seprated
            for (var index in arrData[i]) {
                //console.log("index :"+index+" Data:"+arrData[i][index]);
                if(index == 'alarmdata_alarmtype'){
                    if(arrData[i][index] == '0'){
                        row += '"Alarm",';       
                    }else{

                    }
                }else if(index == 'alarmdata_alarmstatus'){
                    if(arrData[i][index] == '1'){
                        row += '"Alarm Open",';       
                    }else if(arrData[i][index] == '0'){
                        row += '"Alarm Close",';       
                    }
                }else if(index == 'alarmdata_opentime' || index == 'alarmdata_closetime'){
                    row += moment(arrData[i][index]).format('DD-MM-YYYY H:mm:ss')+',';
                }else if(index == 'alarmdata_alarmpin'){
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
        var fileName = "Ap_rpt_"+moment(Date().slice(0,24)).format('DD-MM-YYYY H:mm:ss');
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
        link.download = fileName +moment(Date().slice(0,24)).format('DD-MM-YYYY H:mm:ss') +".xls";
        
        //this part will append the anchor tag and remove it after automatic click
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
}
//display excel  format function ends           

function getPage(pageval){
       var pageval =document.getElementById("page_id").value;
        console.log("page value is"+pageval);
        $.ajax({
            url: '/report/chest-door',
            type: 'get',
            dataType: 'json',
            data : {pagesize: pageval},
            contentType: 'application/json',
            success: function(data){
            }
        });    
}

function getAJAXCall(urlstr,methodtype,datas,module){
    $.ajax({
        url: urlstr,
        type: methodtype,
        dataType: 'json',
        data : datas,
        contentType: 'application/json',
        success: function(data){
            if(module == 'SiteInfo'){
                sid = siteid.split(",");
                //console.log("data sid"+data.custdata);
                var options = '';
                for (var i = 0; i < data.custdata.length; i++) {
                    options += '<option value="' + data.custdata[i].site_code + '">' + data.custdata[i].site_code + '</option>';    
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
                JSONToXLSConvertor(arr2, "Alarm Panel Report", true);
            }else if(module == 'PDF'){
                var arr2=data;
                JSONToPDF(arr2);
            } 
        }//end of success function
    });
 }   
 

