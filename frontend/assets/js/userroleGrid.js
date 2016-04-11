

$("#tab_customers").jsGrid({
        


         width: "100%",
        height: "400px",
        
        filtering: true,
        editing: false,
        sorting: true,
        paging: true,
        pageSize: 5,
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
                    url: "/userrole/getdata",
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
            url: '/userrole/delete',
            type: 'POST',
            cache: false, 
            data: { recordids: item.role_id }, 
                success: function(data){
                    alert('Success!');
                }
                ,error: function(jqXHR, textStatus, err){
                    alert('text status '+textStatus+', err '+err);
                }
        });
        window.location.href='/userrole';
                
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
                                window.location.href="/userrole/edit/"+args.role_id;
                            });
                },



            
                align: "center",
                width: 50},
                

            { type: "control",editButton:false, }
        ]
       
    });
   var selectedItems = [];
 
    var selectItem = function(item) {
        console.log(item.role_id);
        selectedItems.push(item.role_id);
    };
 
    var unselectItem = function(item) {
        selectedItems = $.grep(selectedItems, function(i) {
            return i !== item.role_id;
        });
    };
 
    

    function deleteRoles()
    {
        console.log("delete entered");
        var deletevalues = selectedItems;
        if(deletevalues != ""){
    
        deletevalues = deletevalues.join(',');
        $.ajax({
            url: '/userrole/delete',
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
        window.location.href='/userrole';
    }else{
        alert("Select Any One Role");
    }   
    }