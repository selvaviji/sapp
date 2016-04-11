
var deleteurl;
var customerindex=0;
var roleindex=0;
var pindetailsindex=0;
var preferenceindex=0;
var siteindex=0;
var vendorindex=0;
var usersindex=0;
var fieldengineerindex=0;

function fieldengineergrid()
 {
    var fields1=[
            
           {    name: "username", 
                type: "text",
                headerTemplate: function() {
                    return "User Name";
                },
            },
             {   name: "customer_name", 
                type: "text",
                headerTemplate: function() {
                    return "Customer Name";
                },
            },
            {   name: "site_info", 
                width: 150,
                type: "text",
                headerTemplate: function() {
                    return "Site Info";
                },
            },
            {   name: "createdAt", 
                type: "text",  
               
                itemTemplate: function(value) {
                    str1=value.slice(10);
                    str1=str1.slice(1,9); 
                    value=value.slice(0,10);
                    arr2=value.split("-");
                    value=arr2[2]+"/"+arr2[1]+"/"+arr2[0];
                    value=value+""+str1;
                    return value;
                },
                headerTemplate: function() {
                    return "Created Date";
                } 
            },
            {   name: "updatedAt", 
                type: "text", 
                width: 150 ,
                itemTemplate: function(value) {
                    str1=value.slice(10);
                    str1=str1.slice(1,9);
                    value=value.slice(0,10);
                    arr2=value.split("-");
                    value=arr2[2]+"/"+arr2[1]+"/"+arr2[0];
                    value=value+" "+str1;
                    return value;
                },
                headerTemplate: function() {
                    return "Updated Date";
                }
            },
            {   headerTemplate: function() {
                    return "Edit";
                },
                itemTemplate: function(_, args) {
                    return $("<a class='uk-icon-edit editicon'>")
                            .on("click", function () {
                        window.location.href="/users/edit/"+args.id;
                            });
                },
                align: "center",
                width: 50
            },
            {   type: "control",
                editButton:false 
            }
        ];
            fieldengineerindex=1;
            var url1='/fieldengineer/getdata';
            var url2='/fieldengineer/delete';
            render(url1,url2,fields1);
 }

function usersgrid(){
    var fields1=[
        {   
            name: "user_name", 
            type: "text",
            headerTemplate: function() {
                return "User Name";
            },
        },
        {   
            name: "user_status", 
            type: "text",
            itemTemplate: function(value){
                if(value == '0'){
                    return 'Enable';
                }else{
                    return 'Disable';
                }
            },
            headerTemplate: function() {
                return "Status";
            } 
        },
        {   
            name: "created_date", 
            type: "text",  
            width: 150,
            itemTemplate: function(value) {
                str1=value.slice(10);
                str1=str1.slice(1,9); 
                value=value.slice(0,10);
                arr2=value.split("-");
                value=arr2[2]+"/"+arr2[1]+"/"+arr2[0];
                value=value+""+str1;
                return value;
            },
            headerTemplate: function() {
                return "Created Date";
            } 
        },
        {   
            name: "updated_date", 
            type: "text", 
            width: 150 ,
            itemTemplate: function(value) {
                str1=value.slice(10);
                str1=str1.slice(1,9);
                value=value.slice(0,10);
                arr2=value.split("-");
                value=arr2[2]+"/"+arr2[1]+"/"+arr2[0];
                value=value+" "+str1;
                return value;
            },
            headerTemplate: function() {
                return "Updated Date";
                }
            },
            {   headerTemplate: function() {
                    return "Edit";
                },
                itemTemplate: function(_, args) {
                    return $("<a class='uk-icon-edit editicon'>")
                            .on("click", function () {
                        window.location.href="/users/edit/"+args.user_id;
                            });
                },
                align: "center",
                width: 50
            },
            {   type: "control",
                editButton:false 
            }
        ];
            usersindex=1;
            var url1='/users/getdata';
            var url2='/users/delete';
            render(url1,url2,fields1);
 }/*userrole grind ends*/
function vendorgrid()
 {
    var fields1=[
           
           {    name: "customer_name", 
                type: "text",
                headerTemplate: function() {
                    return "Customer Name";
                },
            },
            {   name: "msp_name", 
                type: "text",
                headerTemplate: function() {
                    return "Vendor Name";
                } 
            },
            {   name: "msp_desc",
                type: "text", 
                headerTemplate: function() {
                    return "Description";
                } 
            },
            {   name: "created_date", 
                type: "text",  
                width: 150,
                itemTemplate: function(value) {
                    str1=value.slice(10);
                    str1=str1.slice(1,9); 
                    value=value.slice(0,10);
                    arr2=value.split("-");
                    value=arr2[2]+"/"+arr2[1]+"/"+arr2[0];
                    value=value+""+str1;
                    return value;
                },
                headerTemplate: function() {
                    return "Created Date";
                } 
            },
            {   name: "updated_date", 
                type: "text", 
                width: 150 ,
                itemTemplate: function(value) {
                    str1=value.slice(10);
                    str1=str1.slice(1,9);
                    value=value.slice(0,10);
                    arr2=value.split("-");
                    value=arr2[2]+"/"+arr2[1]+"/"+arr2[0];
                    value=value+" "+str1;
                    return value;
                },
                headerTemplate: function() {
                    return "Updated Date";
                }
            },
            {   headerTemplate: function() {
                    return "Edit";
                },
                itemTemplate: function(_, args) {
                    return $("<a class='uk-icon-edit editicon'>")
                            .on("click", function () {
                        window.location.href="/vendor/edit/"+args.msp_id;
                            });
                },
                align: "center",
                width: 50
            },
            {   type: "control",
                editButton:false 
            }
        ];
            vendorindex=1;
            var url1='/vendor/getdata';
            var url2='/vendor/delete';
            render(url1,url2,fields1);
 }/*userrole grind ends*/


function sitegrid()
 {
    var fields1=[
           
           {    name: "customer_name", 
                type: "text",
                headerTemplate: function() {
                    return "Customer Name";
                },
            },
            {   name: "site_code", 
                type: "text",
                headerTemplate: function() {
                    return "Site Code";
                } 
            },
            {   name: "site_name",
                type: "text", 
                headerTemplate: function() {
                    return "Site Name";
                } 
            },
            {   name: "area_name", 
                type: "text", 
                headerTemplate: function() {
                    return "Area Name";
                } 
            },
            {   name: "site_status",
                itemTemplate: function(value){
                    if(value == '0'){
                        return 'Enable';
                    }else{
                        return 'Disable';
                    }
                },
                headerTemplate: function() {
                    return "Site Status";
                } 
            },
            {   name: "site_videolink ", 
                headerTemplate: function() {
                    return "Video Link";
                } 
            },
            {   name: "created_date", 
                type: "text",  
                width: 150,
                itemTemplate: function(value) {
                    str1=value.slice(10);
                    str1=str1.slice(1,9); 
                    value=value.slice(0,10);
                    arr2=value.split("-");
                    value=arr2[2]+"/"+arr2[1]+"/"+arr2[0];
                    value=value+""+str1;
                    return value;
                },
                headerTemplate: function() {
                    return "Created Date";
                } 
            },
            {   name: "updated_date", 
                type: "text", 
                width: 150 ,
                itemTemplate: function(value) {
                    str1=value.slice(10);
                    str1=str1.slice(1,9);
                    value=value.slice(0,10);
                    arr2=value.split("-");
                    value=arr2[2]+"/"+arr2[1]+"/"+arr2[0];
                    value=value+" "+str1;
                    return value;
                },
                headerTemplate: function() {
                    return "Updated Date";
                }
            },
            {   headerTemplate: function() {
                    return "Edit";
                },
                itemTemplate: function(_, args) {
                    return $("<a class='uk-icon-edit editicon'>")
                            .on("click", function () {
                        window.location.href="/site/edit/"+args.site_id;
                            });
                },
                align: "center",
                width: 50
            },
            {   type: "control",
                editButton:false 
            }
        ];
            siteindex=1;
            var url1='/site/getdata';
            var url2='/site/delete';
            render(url1,url2,fields1);
 }/*userrole grind ends*/

/*customer grid function*/
function preferencegrid()
 {
    var fields1=[
                
                {   name: "customer_name", 
                    type: "text",
                    headerTemplate: function() {
                        return "Customer Name";
                    },
                    
                },
                {   name: "time_zone",
                    headerTemplate: function() {
                        return "Time Zone";
                    } 
                },
                {   name: "date_format", 
                    headerTemplate: function() {
                        return "Date Format";
                    } 
                },
                {   name: "page_refresh",
                    width: 130,
                    align: "center", 
                    headerTemplate: function() {
                        return "Rows Per Page";
                    } 
                },
                {   name: "landing_page",
                    headerTemplate: function() {
                        return "Landing Page";
                    } 
                },
                {   name: "site_report",
                    width: 110,
                    align: "center",
                    headerTemplate: function() {
                        return "Site Report(Hrs.)";
                    } 
                },
                {   name: "created_date", 
                    type: "text",  
                    width: 150,
                    itemTemplate: function(value) {
                    str1=value.slice(10);
                    str1=str1.slice(1,9); 
                    value=value.slice(0,10);
                    arr2=value.split("-");
                    value=arr2[2]+"/"+arr2[1]+"/"+arr2[0];
                    value=value+""+str1;
                    return value;
                    },
                    headerTemplate: function() {
                        return "Created Date";
                    } 
                },
                {   name: "updated_date", 
                    type: "text", 
                    width: 150 ,
                    itemTemplate: function(value) {
                    str1=value.slice(10);
                    str1=str1.slice(1,9);
                    value=value.slice(0,10);
                    arr2=value.split("-");
                    value=arr2[2]+"/"+arr2[1]+"/"+arr2[0];
                    value=value+" "+str1;
                    return value;
                    },
                    headerTemplate: function() {
                        return "Updated Date";
                    }
                },

                {
                    headerTemplate: function() {
                    return "Edit";
                    },
                    itemTemplate: function(_, args) {
                    return $("<a class='uk-icon-edit editicon'>")
                            .on("click", function () {
                            window.location.href="/preferences/edit/"+args.preference_id;
                        });
                    },
                    align: "center",
                    width: 50
                },
                {   type: "control",
                    editButton:false 
                }
                ];
                preferenceindex=1;
                var url1="/preferences/getdata";
                var url2='/preferences/delete';
                render(url1,url2,fields1);
 }/*userrole grind ends*/

/*customer grid function*/
function pindetailsgrid()
 {
    var fields1=[
                
                {   name: "pin_color", 
                    type: "text", 
                    width: 150,
                    headerTemplate: function(){
                        return "Color";
                    }
                },
                {   name: "pin_desc", 
                    width: 150,
                    headerTemplate: function() {
                        return "Description";
                    } 
                },
                {   name: "pin_name", 
                    width: 150,
                    headerTemplate: function() {
                        return "Priority Name";
                    } 
                },
                { name: "created_date", type: "text", width: 150,
                    itemTemplate: function(value) {
                    str1=value.slice(10);
                    str1=str1.slice(1,9); 
                    value=value.slice(0,10);
                    arr2=value.split("-");
                    value=arr2[2]+"/"+arr2[1]+"/"+arr2[0];
                    value=value+""+str1;
                    return value;
                    },
                    headerTemplate: function(){
                    return "Created Date";
                    } 
                },
                {   name: "updated_date", 
                    type: "text", 
                    width: 150 ,
                    itemTemplate: function(value) {
                    str1=value.slice(10);
                    str1=str1.slice(1,9);
                    value=value.slice(0,10);
                    arr2=value.split("-");
                    value=arr2[2]+"/"+arr2[1]+"/"+arr2[0];
                    value=value+" "+str1;
                    return value;
                    },
                    headerTemplate: function() {
                        return "Updated Date";
                    }
                },

                {
                    headerTemplate: function() {
                    return "Edit";
                    },
                    itemTemplate: function(_, args) {
                    return $("<a class='uk-icon-edit editicon'>")
                            .on("click", function () {
                                console.log("item value"+args.pin_id);
                                window.location.href="/pindetails/edit/"+args.pin_id;
                            });
                    },
                    align: "center",
                    width: 50
                },
                {   type: "control",
                    editButton:false 
                }
            ];
            pindetailsindex=1;
            var url1='/pindetails/getdata';
            var url2= '/pindetails/delete';
            render(url1,url2,fields1);
 }/*userrole grind ends*/


/*userrole grid function starts*/
function userrolegrid()
 {

var fields1=[
                
                { name: "role_name", type: "text", width: 150,headerTemplate: function() {return "Role Name";}},
                { name: "role_desc", width: 150,headerTemplate: function() {return "Role Desc";} },
                { name: "created_date", type: "text", width: 150,
                    itemTemplate: function(value) {
                    str1=value.slice(10);
                    str1=str1.slice(1,9); 
                    value=value.slice(0,10);
                    arr2=value.split("-");
                    value=arr2[2]+"/"+arr2[1]+"/"+arr2[0];
                    value=value+""+str1;
                    return value;
                    },

                    headerTemplate: function() {return "Created Date";} 
                },
                {   name: "updated_date", 
                    type: "text", 
                    width: 150 ,
                    itemTemplate: function(value) {
                    str1=value.slice(10);
                    str1=str1.slice(1,9);
                    value=value.slice(0,10);
                    arr2=value.split("-");
                    value=arr2[2]+"/"+arr2[1]+"/"+arr2[0];
                    value=value+" "+str1;
                    return value;
                    },
                    headerTemplate: function() {return "Updated Date";}
                },

                {

                   headerTemplate: function() {
                    return "Edit";
                    },
                    itemTemplate: function(_, args) {

                   return $("<a class='uk-icon-edit editicon'>")
                            .on("click", function () {
                                console.log("item value"+args.role_id);
                                window.location.href="/userrole/edit/"+args.role_id;
                            });
                },
                    align: "center",
                    width: 50},
                { type: "control",editButton:false, }
                ]
                roleindex=1;
                var url1="/userrole/getdata";
                var url2='/userrole/delete';
                render(url1,url2,fields1);
 }/*userrole grid ends*/



/*customer grid function*/
function customergrid()
 {
    console.log("gfhjkl;");

        var fields1=[
        
            {   name: "customer_name", 
                type: "text",
                headerTemplate: function() {return "Customer Name";},
                sorting:true
            },
            {   name: "display_name", 
                type: "text",
                headerTemplate: function() {
                    return "Display Name";
                },
                filtering:false
            },
            {   name: "user_status",
                width:50,
                itemTemplate: function(value){
                    if(value == '0'){
                        return 'Enable';
                    }else{
                        return 'Disable';
                    }
                },
                headerTemplate: function() {return "Status";} 
            },
            { name: "logo_name", width:50,
                itemTemplate: function(value){
                    var imgval = 'noimage.png'
                    if(value == '' || typeof value === undefined){
                        imgval = 'uploads/'+imgval;
                    }else{
                        imgval = 'uploads/'+value;
                    }
                    return $("<img src='"+imgval+"' width='50px' height='50px'></img>");
                },
                headerTemplate: function() {
                    return "Logo";
                } 
            },
            { name: "created_date", type: "text",  width: 150,
                itemTemplate: function(value) {
                    str1=value.slice(10);
                    str1=str1.slice(1,9); 
                    value=value.slice(0,10);
                    arr2=value.split("-");
                    value=arr2[2]+"/"+arr2[1]+"/"+arr2[0];
                    value=value+""+str1;
                    return value;
                },
                headerTemplate: function() {return "Created Date";} 
            },
            { name: "updated_date", type: "text", width: 150 ,
                itemTemplate: function(value) {
                    str1=value.slice(10);
                    str1=str1.slice(1,9);
                    value=value.slice(0,10);
                    arr2=value.split("-");
                    value=arr2[2]+"/"+arr2[1]+"/"+arr2[0];
                    value=value+" "+str1;
                    return value;
                },headerTemplate: function() {return "Updated Date";}
            },
            {
                headerTemplate: function() {
                    return "Edit";
                },
                itemTemplate: function(_, args) {
                    return $("<a class='uk-icon-edit editicon'>")
                        .on("click", function () {
                            console.log("item value"+args.role_id);
                            window.location.href="/customer/edit/"+args.user_id;
                        });
                },
                align: "center",
                width: 50
            },
            {   type: "control",
                editButton:false 
            }
        ];
        customerindex=1;
        var url1='/customer/getdata';
        var url2='/customer/delete';
        render(url1,url2,fields1);
 }/*userrole grind ends*/

 function render(url1,url2,fields1)
 {

    deleteurl=url2;
    $("#tabledata").jsGrid({
        width: "100%",
        filtering: true,
        editing: false,
        sorting: true,
        paging: true,
        pageSize: 10,
        pageButtonCount: 5,
        pagerContainer: "#externalPager",
        pagerFormat: "&nbsp;&nbsp; {first} {prev} {pages} {next} {last} &nbsp;&nbsp; Total Pages: {pageIndex} / {pageCount}",
        pagePrevText: "<",
        pageNextText: ">",
        pageFirstText: "<<",
        pageLastText: ">>",
        pageNavigatorNextText: "&#8230;",
        pageNavigatorPrevText: "&#8230;",
        autoload: true,
        
       

        controller: {
            loadData: function(filter) {
                var d = $.Deferred();
                console.log("Filter :"+JSON.stringify(filter));
                $.ajax({
                    url: url1,
                    type: "GET",
                    dataType: "json",
                    data:filter

                }).done(function(response) {
                    console.log(response);
                    d.resolve(response.datas);
                });
 
                return d.promise();
            },
            deleteItem: function(item) {
                if(pindetailsindex==1){
                    var val={ recordids: item.pin_id }; 
                    var url3='/pindetails';  
                }
                if(roleindex==1){
                    var val={ recordids: item.role_id };
                    var url3='/userrole';
                }
                if(customerindex==1){
                    var val={ recordids: item.customer_id };
                    var url3='/customer';
                }
                if(preferenceindex==1){
                    var val={ recordids: item.preference_id };  
                    var url3='/preferences';
                }
                if(siteindex==1){
                    var val={ recordids: item.site_id };  
                    console.log("siteid value"+item.site_id);
                    var url3='/site';
                }
                if(vendorindex==1){
                    var val={ recordids: item.msp_id };  
                    console.log("siteid value"+item.site_id);
                    var url3='/vendor';
                }
                if(usersindex==1){
                    var val={ recordids: item.user_id };  
                    console.log("siteid value"+item.user_id);
                    var url3='/users';
                }
                
                $.ajax({
                    url: url2,
                    type: 'POST',
                    cache: false, 
                    data: val, 
                    success: function(data){
                        alert('Success!');
                    }
                    ,error: function(jqXHR, textStatus, err){
                        alert('text status '+textStatus+', err '+err);
                    }
                });
                window.location.href=url3;
            }
        },
     
        fields: fields1
       
    });
}
     
    
    
    
