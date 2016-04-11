
/*********************** Common Module ***********************************/
var values = [];
function menuCall(url){
	$.ajax({ 
		url: url,
		cache: false, 
		success: function(data){
			$("#contentArea").innerHTML = data;
		}
		,error: function(jqXHR, textStatus, err){
			alert('text status '+textStatus+', err '+err);
		}
	});
}

function setCheckboxValues(form){
        var chk_arr =  document.getElementsByName("chkuser[]");
        var chklength = chk_arr.length;             
        for(k=0;k< chklength;k++){
            if(document.getElementById("chkall").checked == true){
                chk_arr[k].checked = true;
            }else{
                chk_arr[k].checked = false;
            }    
        } 
}


function getCheckboxValues(form){
        var chk_arr =  document.getElementsByName("chkuser[]");
        var chklength = chk_arr.length;             
        
        for(k=0;k< chklength;k++){
            if (chk_arr[k].checked) {
              values.push("'"+chk_arr[k].value+"'");
            }
        }
        return values;
       
}    
/*********************** End Common Module ********************************/

/*********************** Geography Module *********************************/

/*function addGeography(){
    window.location.href = '/geography/add';
}*/

function cancelAdd(){
    window.location.href = '/geography';
}
/****************************End Geography Module*******************************/

/*************************** User Module ****************************************/
//Start User Module
function addUser(){
	window.location.href = '/users/adduser';
}

function cancelUser(){
	window.location.href = '/users';
}	

function saveUser1(){
	console.log("saveuser Triggered");
	var user_name = document.getElementById("username").value;
	var user_pass = document.getElementById("password").value;
	var user_type = document.getElementById("user_type").value;
	$.ajax({ 
		url: '/users/saveuser1',
		type: 'POST',
		cache: false, 
		data: { username: user_name, password: user_pass, usertype: user_type}, 
			success: function(data){
				alert('Success!');
			}
			,error: function(jqXHR, textStatus, err){
				alert('text status '+textStatus+', err '+err);
			}
	});
	//window.location.href = '/users';
	window.location.href = '/users';
}	


function saveUser(){
	console.log("saveuser Triggered");
	var user_name = document.getElementById("user_name").value;
	var user_pass = document.getElementById("user_pass").value;
	var confirm_pass = document.getElementById("confirm_pass").value;
	var user_type = document.getElementById("user_type").value;
	var emp_num = document.getElementById("emp_num").value;
	var userdesign = document.getElementById("user_desig").value;
	var imgInp = document.getElementById("imgInp").value;
	var cust_attached = document.getElementById("cust_attached").value;
	var cust_disp = document.getElementById("cust_disp").value;
	var cust_app = document.getElementById("cust_app").value;
	var support_email = document.getElementById("support_email").value;
	var time_zone = document.getElementById("time_zone").value;
	var date_format = document.getElementById("date_format").value;
	var page_refresh = document.getElementById("page_refresh").value;
	var no_records = document.getElementById("no_records").value;
	var landing_page = document.getElementById("landing_page").value;
	var support_hrs = document.getElementById("support_hrs").value;
	var dashboard_opt = document.getElementById("dashboard_opt").value;
	
	$.ajax({ 
		url: '/users/saveuser',
		type: 'POST',
		cache: false, 
		data: { username: user_name, password: user_pass, confirmpass: confirm_pass, 
				usertype : user_type, empnum: emp_num, 
				custattached: cust_attached,custdisp: cust_disp,custapp: cust_app,
				logo: imgInp, supportemail: support_email,timezone: time_zone,dateformat:date_format,
				pagerefresh: page_refresh,norecords: no_records,landingpage: landing_page,
				supporthrs: support_hrs,dashboardopt: dashboard_opt}, 
			success: function(data){
				alert('Success!');
			}
			,error: function(jqXHR, textStatus, err){
				alert('text status '+textStatus+', err '+err);
			}
	});
	window.location.href = '/users';
}

function rearrange(){
	var custid = $("#customer_id").val();
	console.log("customer id:"+custid);

	 $.ajax({
        type: "GET",
        url: "/alarmpin/search",
        data: { customerid: custid},
        cache: false,
        success: function(html){
        }
    });    	
}
function editUser(id){
	/*$.ajax({
		url: '/users/edituser',
		type: 'GET',
		cache: false,
		data: { userid :id}, 
			success: function(data){
				//window.location.href = '/users/edituser';
			}
			,error: function(jqXHR, textStatus, err){
				alert('text status '+textStatus+', err '+err);
			}
	});*/
	window.location.href = '/users/edit/'+id;
}
function updateUser(){
	//window.location.href = '/users/update';
	console.log("update User Triggered");
	var uname = document.getElementById("username").value;
	var pword = document.getElementById("password").value;
	var rid = document.getElementById("user_type").value;
	var uid = document.getElementById("userid").value;
	//console.log("uname :"+uname+":pword :"+pword);					
	$.ajax({ 
		url: '/users/update',
		type: 'POST',
		cache: false, 
		data: { username: uname, password: pword, roleid:rid, userid: uid }, 
			success: function(data){
				alert('Success!');
			}
			,error: function(jqXHR, textStatus, err){
				alert('text status '+textStatus+', err '+err);
			}
	});
	window.location.href='/users';
}

function deleteUser(form){
	var deletevalues = getCheckboxValues(form);
	
	if(deletevalues != ""){
		deletevalues = deletevalues.join(',');
		$.ajax({
			url: '/users/delete',
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
		window.location.href='/users';
	}else{
		alert("Select any one User");
	}	
}
/**********************End User Module ***************************************/

/*************************** Customer Module ****************************************/

function addCustomer(){
	window.location.href = '/customer/addcustomer';
}

function cancelCustomer(){
	window.location.href = '/customer';
}	

function saveCustomer(){
	console.log("saveuser Triggered");
	/*var user_name = document.getElementById("username").value;
	var user_pass = document.getElementById("password").value;
	var user_type = document.getElementById("user_type").value;*/
	$('#uploadForm').ajaxSubmit({ 
		url: '/customer/savecustomer',
		type: 'POST',
		cache: false, 
		data: { username: username, password: password, displayname: displayname},    
        error: function(xhr) {
            status('Error: ' + xhr.status);
        },
            
        success: function(response) {
			try {
                    response = $.parseJSON(response);
                }
                catch(e) {
                    status('Bad response from server');
                    return;
                }

                if(response.error) {
                    status('Oops, something bad happened');
                    return;
                }

                var imageUrlOnServer = response.path;
                
                status('Success, file uploaded to:' + imageUrlOnServer);
                $('<img/>').attr('src', imageUrlOnServer).appendTo($('body'));
        }
	});
	window.location.href = '/customer';
}	

function status(message) {
        $('#status').text(message);
    }

function editCustomer(id){
	window.location.href = '/customer/edit/'+id;
}

function updateCustomer(){
	console.log("update User Triggered");
	var uname = document.getElementById("username").value;
	var pword = document.getElementById("password").value;
	var rid = document.getElementById("user_type").value;
	var uid = document.getElementById("userid").value;
	//console.log("uname :"+uname+":pword :"+pword);					
	$.ajax({ 
		url: '/customer/update',
		type: 'POST',
		cache: false, 
		data: { username: uname, password: pword, roleid:rid, userid: uid }, 
			success: function(data){
				alert('Success!');
			}
			,error: function(jqXHR, textStatus, err){
				alert('text status '+textStatus+', err '+err);
			}
	});
	window.location.href='/customer';
}

function deleteCustomer(form){
	var deletevalues = getCheckboxValues(form);
	if(deletevalues != ""){ 
		deletevalues = deletevalues.join(',');
		console.log("Values :"+deletevalues);  
		$.ajax({
			url: '/customer/delete',
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
		window.location.href='/customer';
	}else{
		alert("Select Any One Customer");
	}	
}
/**********************End Customer Module ***************************************/

/*************************** Site Module ****************************************/
//Start Site Module
function addSite(){
	window.location.href = '/site/addsite';
}

function cancelSite(){
	window.location.href = '/site';
}	
function checkStatus(checkbox)
{
    if (checkbox.checked)
    {
        alert("a");
    }
}

function saveSite(arg){
	//console.log("Triggered");
	var chklink = 0;
	var site_name	= document.getElementById("site_name").value;
	var site_code	= document.getElementById("site_code").value;
	var area_name	= document.getElementById("area_name").value;
	var site_msp	= document.getElementById("site_msp").value;
	var site_address = document.getElementById("site_address").value;
	var site_pincode= document.getElementById("site_pincode").value;
	var site_lng 	= document.getElementById("site_lng").value;
	var site_lat 	= document.getElementById("site_lat").value;
	var site_vid 	= document.getElementById("site_vid").value;
	var customer_id = document.getElementById("customer_id").value;
	
	var qname = $('input[name="qrtname[]"]').map(function() {
        return this.value
    }).get();

    var qno = $('input[name="qrtno[]"]').map(function() {
        return this.value
    }).get();

    var cname = $('input[name="cname[]"]').map(function() {
        return this.value
    }).get();

    var cno = $('input[name="cno[]"]').map(function() {
        return this.value
    }).get();
    
    var pname = $('input[name="pname[]"]').map(function() {
        return this.value
    }).get();

    var pno = $('input[name="pno[]"]').map(function() {
        return this.value
    }).get();

    var fname = $('input[name="fname[]"]').map(function() {
        return this.value
    }).get();

    var fno = $('input[name="fno[]"]').map(function() {
        return this.value
    }).get();


	if(document.getElementById("chklink").checked == true){
		chklink = '0';
	}else{
		chklink = '1';
	}
	//console.log("Check :"+chkstatus);

	$.ajax({ 
			url: '/site/savesite',
			type: 'POST',
			cache: false, 
			data: { customerid: customer_id, areaname: area_name, sitecode: site_code, sitename: site_name, sitemsp: site_msp, siteaddress: site_address,sitepincode: site_pincode,sitelatitude: site_lat,sitelongitude: site_lng,sitevideolink: site_vid,chklink: chklink,qrtname: qname,qrtno: qno,policename: pname,policeno: pno,custname: cname,custno: cno,firename: fname,fireno: fno}, 
			success: function(data){
				alert('Success!');
			}
			,error: function(jqXHR, textStatus, err){
				alert('text status '+textStatus+', err '+err);
			}
	});

	if(arg == ""){
		console.log("saveSite Triggered");
		window.location.href = '/site';
	}else{
		resetSite();
	}	
}	

function resetSite(){
	document.getElementById("site_name").value = "";
	document.getElementById("site_code").value = "";
	document.getElementById("site_address").value = "";
	document.getElementById("site_pincode").value = "";
	document.getElementById("site_lng").value = "";
	document.getElementById("site_lat").value = "";
	document.getElementById("site_vid").value = "";
	for(var i=0;i<3;i++){
		document.getElementById("qrtname["+i+"]").value="";
		document.getElementById("qrtno["+i+"]").value="";
		document.getElementById("cname["+i+"]").value="";
		document.getElementById("cno["+i+"]").value="";
		document.getElementById("pname["+i+"]").value="";
		document.getElementById("pno["+i+"]").value="";
		document.getElementById("fname["+i+"]").value="";
		document.getElementById("fno["+i+"]").value="";
	}
	//document.getElementById("chk_link").value = "";
}

function editSite(id){
	window.location.href = '/site/edit/'+id;
}

function updateSite(){
	console.log("update site Triggered");
	var sid	= document.getElementById("site_id").value;
	var site_name	= document.getElementById("site_name").value;
	var site_code	= document.getElementById("site_code").value;
	var area_name	= document.getElementById("area_name").value;
	var site_msp	= document.getElementById("site_msp").value;
	var site_address = document.getElementById("site_address").value;
	var site_pincode= document.getElementById("site_pincode").value;
	var site_lng 	= document.getElementById("site_lng").value;
	var site_lat 	= document.getElementById("site_lat").value;
	var site_vid 	= document.getElementById("site_vid").value;
	var no_atm 	= document.getElementById("no_atm").value;
	var sitestatus =null;
	var chklink =null;
	if(document.getElementById("chklink").checked == true){
		chklink = '0';
	}else{
		chklink = '1';
	}

	if(document.getElementById("site_status").checked == true){
		sitestatus = '0';
	}else{
		sitestatus = '1';
	}
	
	var qname = $('input[name="qrtname[]"]').map(function() {
        return this.value
    }).get();

    var qno = $('input[name="qrtno[]"]').map(function() {
        return this.value
    }).get();

    var cname = $('input[name="cname[]"]').map(function() {
        return this.value
    }).get();

    var cno = $('input[name="cno[]"]').map(function() {
        return this.value
    }).get();
    
    var pname = $('input[name="pname[]"]').map(function() {
        return this.value
    }).get();

    var pno = $('input[name="pno[]"]').map(function() {
        return this.value
    }).get();

    var fname = $('input[name="fname[]"]').map(function() {
        return this.value
    }).get();

    var fno = $('input[name="fno[]"]').map(function() {
        return this.value
    }).get();

    var qcomplaintno = $('input[name="qcompno[]"]').map(function() {
        return this.value
    }).get();
    
    var pcomplaintno = $('input[name="pcompno[]"]').map(function() {
        return this.value
    }).get();

    var fcomplaintno = $('input[name="fcompno[]"]').map(function() {
        return this.value
    }).get();
    
    var ccomplaintno = $('input[name="ccompno[]"]').map(function() {
        return this.value
    }).get();
	//var customer_id = document.getElementById("customer_id").value;
	
	//console.log("uname :"+uname+":pword :"+pword);					
	$.ajax({ 
		url: '/site/update',
		type: 'POST',
		cache: false, 
		data: { sitename: site_name, sitecode: site_code, no_atm: no_atm, sitemsp: site_msp, siteaddress: site_address,sitepincode: site_pincode,sitelng: site_lng,sitelat: site_lat,sitevid: site_vid,chklink: chklink, site_staus: sitestatus, siteid: sid,qrtname: qname,qrtno: qno,policename: pname,policeno: pno,custname: cname,custno: cno,firename: fname,fireno: fno, qcompno: qcomplaintno, fcompno: fcomplaintno, pcompno: pcomplaintno, ccompno: ccomplaintno},  
			success: function(data){
				alert('Success!');
			}
			,error: function(jqXHR, textStatus, err){
				alert('text status '+textStatus+', err '+err);
			}
	});
	window.location.href='/site';
}

function deleteSite(form){
	var deletevalues = getCheckboxValues(form);
	if(deletevalues != ""){
		//console.log("Values :"+deletevalues.join(','));  
		deletevalues = deletevalues.join(',');
		//console.log("Values :"+deletevalues);  
		$.ajax({
			url: '/site/delete',
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
		window.location.href='/site';
	}else{
		alert("Select Any One Site");
	}	
}
/**********************End Site Module ***************************************/


/*************************** MSP Module ****************************************/

function addMSP(){
	window.location.href = '/msp/addmsp';
}

function cancelMSP(){
	window.location.href = '/msp';
}	

function editMSP(id){
	window.location.href = '/msp/edit/'+id;
}

function updateMSP(){
	console.log("update MSP Triggered");
	var uname = document.getElementById("mspname").value;
	var pword = document.getElementById("mspdesc").value;
	var mid = document.getElementById("mspid").value;
	//console.log("uname :"+uname+":pword :"+pword);					
	$.ajax({ 
		url: '/msp/update',
		type: 'POST',
		cache: false, 
		data: { mspname: mname, mspdesc: mdesc,  mspid: mid }, 
			success: function(data){
				alert('Success!');
			}
			,error: function(jqXHR, textStatus, err){
				alert('text status '+textStatus+', err '+err);
			}
	});
	window.location.href='/msp';
}

function deleteMSP(form){
	var deletevalues = getCheckboxValues(form);
	if(deletevalues != ""){
		deletevalues = deletevalues.join(',');
		$.ajax({
			url: '/msp/delete',
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
		window.location.href='/msp';
	}else{
		alert("Select Any One Vendor");
	}	
}
/**********************End MSP Module ***************************************/



/*************************** Role Module ****************************************/

function addRole(){
	window.location.href = '/userrole/addrole';
}

function cancelRole(){
	window.location.href = '/userrole';
}	

function deleteRole(form){
	var deletevalues = getCheckboxValues(form);
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

function searchContent(){
	var value = document.getElementById("search").value;
	console.log("Search Text :"+value);
	$.ajax({
        type: "GET",
        url: "/userrole/search",
        data: {
            'search_keyword' : value
        },
        dataType: "json",
        success: function(msg){
        	updateResult(msg);
        	
        }
    });
}
function parseData(){
	console.log("hi");
}
function updateResult(datas) {

	data = JSON.stringify(datas); 
	console.log("Return Data :"+data);
	console.log("DAta :"+data[0].role_id);
	
}
/**********************End MSP Module ***************************************/



/*************************** PinDetails Module ****************************************/

function addPin(){
	window.location.href = '/pindetails/addpin';
}

function cancelPin(){
	window.location.href = '/pindetails';
}	

function deletePin(form){
	var deletevalues = getCheckboxValues(form);
	if(deletevalues != ""){
		deletevalues = deletevalues.join(',');
		$.ajax({
			url: '/pindetails/delete',
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
		window.location.href='/pindetails';
	}else{
		alert("Select Any One PinDetails");
	}	
}
/**********************End PinDetails Module ***************************************/


/*************************** Preference Module ****************************************/

function addPreference(){
	window.location.href = '/preferences/addpin';
}

function cancelPreference(){
	window.location.href = '/preferences';
}	

function deletePreference(form){
	var deletevalues = getCheckboxValues(form);
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
		alert("Select Any One Preference");
	}	
}
/**********************End PinDetails Module ***************************************/


/*************************** AlarmPin Module ****************************************/


function cancelAlarmPin(){
	window.location.href = '/alarmpin';
}	

function deleteAlarmPin(form){
	var deletevalues = getCheckboxValues(form);
	if(deletevalues != ""){
		deletevalues = deletevalues.join(',');
		$.ajax({
			url: '/alarmpin/delete',
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
		window.location.href='/alarmpin';
	}else{
		alert("Select Any One AlarmPin");
	}	
}
/**********************End PinDetails Module ***************************************/