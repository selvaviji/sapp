$("#k1").jsGrid({
        


         width: "100%",
        height: "400px",
         
        filtering: true,
        editing: false,
        sorting: true,
        paging: true,
        pageSize: 10,
        pageButtonCount: 3,
        pagerContainer: "#externalPager",
        pagerFormat: "current page: {pageIndex} &nbsp;&nbsp; {first} {prev} {pages} {next} {last} &nbsp;&nbsp; total pages: {pageCount}",
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
                    url: "/preferences/getdata",
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

                $.ajax({
            url: '/preferences/delete',
            type: 'POST',
            cache: false, 
            data: { recordids: item.preference_id }, 
                success: function(data){
                    alert('Success!');
                }
                ,error: function(jqXHR, textStatus, err){
                    alert('text status '+textStatus+', err '+err);
                }
        });
        window.location.href='/preferences';
                
            }
        },
     
        fields: [

             {headerTemplate: function() {
                    return $("<input>").attr("type", "checkbox")
                            .on("change", function () {
                               
                            });
                }, itemTemplate: function(_, item) {
                    return $("<input>").attr("type", "checkbox")
                            .on("change", function () {
                               
                                $(this).is(":checked") ? selectItem(item) : unselectItem(item);
                            });
                },
                align: "center",
                width: 50,sorting:false},
           
            { name: "customer_name", type: "text",headerTemplate: function() {return "Customer Name";},filtering:false},
            { name: "time_zone",headerTemplate: function() {return "Time Zone";} },
            { name: "date_format", headerTemplate: function() {return "Date Format";} },
            { name: "page_refresh", headerTemplate: function() {return "Page Refresh";} },
            { name: "landing_page",headerTemplate: function() {return "Landing Page";} },
            { name: "site_report ", headerTemplate: function() {return "Site Report";} },
            { name: "created_date", type: "text",  width: 150,
            itemTemplate: function(value) {
                     
                     str1=value.slice(10);
                      str1=str1.slice(1,9); 
                    value=value.slice(0,10);
                    arr2=value.split("-");
                  value=arr2[2]+"/"+arr2[1]+"/"+arr2[0];
                   value=value+""+str1;
                    return value;
                },headerTemplate: function() {return "Created Date";} },
            { name: "updated_date", type: "text", width: 150 ,itemTemplate: function(value) {
                     
                      str1=value.slice(10);
                      str1=str1.slice(1,9);
                    value=value.slice(0,10);
                    arr2=value.split("-");
                  value=arr2[2]+"/"+arr2[1]+"/"+arr2[0];
                  value=value+" "+str1;
                    return value;
                },headerTemplate: function() {return "Updated Date";}},

                {

                   headerTemplate: function() {
                    return "Edit";
                    },
                    itemTemplate: function(_, args) {

                  return $("<a class='uk-icon-edit editicon'>")
                            .on("click", function () {
                                console.log("item value"+args.role_id);
                                window.location.href="/preferences/edit/"+args.preference_id;
                            });
                },



            
                align: "center",
                width: 50},
                

            { type: "control",editButton:false }
        ]
       
    });
   var selectedItems = [];
 
    var selectItem = function(item) {
        console.log(item.prefernce_id);
        selectedItems.push(item.preference_id);
    };
 
    var unselectItem = function(item) {
        selectedItems = $.grep(selectedItems, function(i) {
            return i !== item.preference_id;
        });
    };
 
    

    function deletepreferences()
    {
        console.log("delete entered");
        var deletevalues = selectedItems;
        if(deletevalues != ""){
    
        deletevalues = deletevalues.join(',');
        $.ajax({
            url: '/preferences/delete',
            type: 'POST',
            cache: false, 
            data: { recordids: deletevalues }, 
                success: function(data){
                    alert('Success!');
                }
                ,error: function(jqXHR, textStatus, err){
                    alert('text status '+textStatus+', err '+err);
                }
        });
        window.location.href='/preferences';
    }else{
        alert("Select Any One Role");
    }   
    }
