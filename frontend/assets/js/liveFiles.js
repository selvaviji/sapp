$(function(){
    //To get site information
    getAJAXCall('/report/getsiteinfo','get','','SiteInfo');
    //To get customer information
    getAJAXCall('/report/getcustInfo','get','','CustInfo');
    
    $("#exl").click(function(){
        var param = document.getElementById("sqlquery").value;
        getAJAXCall('/report/exporting','post','{"sqlquery":"' + param + '"}','Excel');
    })    

    $('#pageval').change(function(){
         $('#frmpageid').submit();
    });

    $('#customer_id').change(function(){
        $('#frmpageid').submit();
    });
});

//reset start
function refreshPage(){
        window.location.href= "/live";
    }
//end reset
     
//Displying in CSV Format start
function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
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
               
                //Now convert each value to string and comma-seprated
                 row += index.toUpperCase() + ',';
                
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
                if(index == 'rawdata_recordingtimestamp'){
                    row += moment(arrData[i][index]).format('DD-MM-YYYY H:mm:ss')+',';
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
        var fileName = "live_"+moment(Date().slice(0,24)).format('DD-MM-YYYY H:mm:ss');
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
        link.download = fileName +moment(Date().slice(0,24)).format('DD-MM-YYYY H:mm:ss') +".csv";
        
        //this part will append the anchor tag and remove it after automatic click
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
}
//display csv format function ends           


function getAJAXCall(urlstr,methodtype,datas,module){
    $.ajax({
        url: urlstr,
        type: methodtype,
        dataType: 'json',
        data : datas,
        contentType: 'application/json',
        success: function(data){
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
                      JSONToCSVConvertor(arr2,"Live report for "+(customerresult[0].customer_name).toUpperCase()+" dated on "+ moment(fromdate).format('DD-MM-YYYY')+" to "+ moment(todate).format('DD-MM-YYYY'), true);
                    }else{
                       JSONToCSVConvertor(arr2,"Live report for all customer "+" dated on "+ moment(fromdate).format('DD-MM-YYYY')+" to "+ moment(todate).format('DD-MM-YYYY'), true);   
                    }
            }
        }
    })
}            