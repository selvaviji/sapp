
    var custid;
    var siteid;
    var pin_id;
    function getAJAX(urlstr,method,result,module){
            $.ajax({    
                url:urlstr,
                type:method,
                cache:false,
                data:result,
                success:function(data){
                    if(module == 'Sitedata'){
                        var datas=[];
                        for( var i=0;i<data.custdata.length;i++) {
                                var obj={"value":data.custdata[i].site_code,"label":data.custdata[i].site_code};
                                datas.push(obj);
                        }renderSiteCombo(datas);
                    }else  if(module == 'Pindata'){
                        var datas=[];
                        for( var i=0;i<data.custdata.length;i++) {
                            var obj={"value":data.custdata[i].pin_id,"label":data.custdata[i].alarmpin_name};
                            datas.push(obj);
                        }renderPinCombo(datas); 
                    }else if(module == 'Customerdata'){
                        console.log("customer triggered");
                        var options = '<option value="">--ALL--</option>';
                        for( var i=0;i<data.custdata.length;i++) {
                            if(custid == data.custdata[i].customer_id){
                                options += '<option value="' + data.custdata[i].customer_id + '" selected>' + data.custdata[i].customer_name + '</option>';    
                            }else{    
                                options += '<option value="' + data.custdata[i].customer_id + '">' + data.custdata[i].customer_name + '</option>';
                            }
                        }
                        $('#customer_id').html(options); 
                    }
                }
            });    
    }
 
        
    function refreshing(){ 
        getAJAX('/common/getsiteinfo','get','','Sitedata');
        getAJAX('/common/getpinInfo','get','','Pindata');
        getAJAX('/common/getcustInfo','post','','Customerdata');
        tabledata();
    }

    //site combo function
    function renderSiteCombo(data){
        $("#siteid").autocomplete({
                    source: data,
                    minLength: -1,
        });
    }

    //pin combo function
    function renderPinCombo(data){
        console.log("render pincombo");
        $("#pin_id").autocomplete({
            source: data,
            select: function( event, ui ) {
                //console.log(ui.item.label);
                $( "#pin_id" ).val( ui.item.label); //ui.item is your object from the array
                $( "#pin_id1" ).val(ui.item.value);
                console.log("pin_id1=="+document.getElementById("pin_id1").value);
                return false;
            },
            minLength: -1,
        });
    }

    //Function for change of siteID based on customer selection
    function changeSite(){
        console.log("change site");
        var customerid=document.getElementById("customer_id").value;
        getAJAX('/common/getsiteinfo','get',{custid:customerid},'Sitedata'); 
    }

     //Function for Change of alarmpin name based on customer selection
    function changePin(){
        console.log("change pin");
        var customerid=document.getElementById("customer_id").value;
        getAJAX('/common/getpinInfo','get',{custid:customerid},'Pindata');
    }

    //onchange #pin_id box change value in #pin_id1(hidden box) 
    $("#pin_id").on('change keyup',function(){
            $( "#pin_id1" ).val("");
    });

   

//download xls file

var tableToExcel = (function () {
   

    var uri = 'data:application/vnd.ms-excel;base64,'
        , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{tabledata}</table></body></html>'
        , base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) }
        , format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) }
        return function (table, name, filename,todate,fdate) {
            if (!table.nodeType) 
                table=header+" dated on "+moment(fdate).format('DD-MM-YYYY')+" To "+moment(todate).format('DD-MM-YYYY')+ '\r\n\n';;
                table += document.getElementById("table").innerHTML;

            var ctx = { worksheet: name || 'Worksheet', tabledata: table }
            //console.log("table data are::"+table);
            document.getElementById("dlink").href = uri + base64(format(template,ctx));
            document.getElementById("dlink").download = filename;
            document.getElementById("dlink").click();
        }
})()
//end xls

//CSV download

//download csv function
function JSONToCSVConvertor(data,fields){
        //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
        var arrData = data;
        var fileds=JSON.stringify(fields);
        var CSV='';
        //Set Report title in first row or line
        //console.log("from:;"+document.getElementById("fromdate").value);
        //var fromdate=document.getElementById("fromdate").value;
        //var todate=document.getElementById("todate").value;
       
        CSV += header+ " Dated on " +moment().format('DD-MM-YYYY')+ '\r\n\n';
       
        //This condition will generate the Label/Header
         var row = "";
        //This loop will extract the label from 1st index of on array
        
        if(fields==undefined){
            row=rows;
        }else{
            var head="";
            for(var i=0;i<fields.length;i++){
                head+=fields[i].alarmpin_sc+",";
            }
           row+=rows+(head).toUpperCase();; 
        }
        row = row.slice(0, -1);
            //append Label row with line break
        CSV += row + '\r\n';    
        //1st loop is to extract each row
        for (var i = 0; i < arrData.length; i++) {
            var row = "";
            for (var index in arrData[i]) {
                //2nd loop will extract each column and convert it in string comma-seprated
                if(index =='RecordingTimeStamp' || index== 'updatedAt' | index=='createdAt' ){
                    row += moment(arrData[i][index]).format('DD-MM-YYYY H:mm:ss')+",";
                }else if(index=='IP'){
                    row+=arrData[i][index].replace("::ffff:","")+",";
                }else{
                  row += '"' + arrData[i][index] + '",';
                }
            }   row.slice(0, row.length - 1);
            //add a line break after each row
                 CSV += row + '\r\n';
        }

        if (CSV == '') {        
             alert("Invalid data");
             return;
        }   
        
        //Generate a file name
        var fileName = fname+moment(Date().slice(0,24)).format('DD-MM-YYYY H:mm:ss');
        //this will remove the blank-spaces from the title and replace it with an underscore
       // fileName += "Shutter".replace(/ /g,"_");   
        
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
//csv download end



//pdf function start
function JSONToPDF(){
    var str="";
    var fromdate=document.getElementById("fromdate").value;
    var todate=document.getElementById("todate").value;
   // console.log("from=="+from);
   // if(customerresult.length==1){
     str+="<h4>"+header+"  dated on "+moment(fromdate).format('DD-MM-YYYY')+" To "+moment(todate).format('DD-MM-YYYY')+"</h4>";

                        str+="<table>";
                        str+=document.getElementById("table").innerHTML;
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
                                pdf.save(fname+moment(Date().slice(0,24)).format('DD-MM-YYYY H:mm:ss')+'.pdf');
                            }, margins
    );
}
//end Pdf function
