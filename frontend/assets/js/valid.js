if($("#form").hasClass('new')){
  console.log("if triggered");
    var areaStatus=0;
    var customerstatus=0;
    var sitestatus=0;
    var namestatus=0;
    var pinstatus=0;
    var alarmpinnostatus=0;
    var alarmpinnamestatus=0;
    var usernamestatus=0;
    var passwordstatus=0;
    var customernamestatus=0;
    var mspnamestatus=0;
    var pinstatus=0;
    var pincodestatus = 0;
    var pinnamestatus=0;
    var pinscodestatus = 0;
    var timezonestatus=0;
    var dateformatstatus=0;
    var pagerefreshstatus=0;
    var landingpagestatus=0;
    var sitereportstatus=0;
    var rolenamestatus=0;
    var customeridstatus=0;
    var usertypestatus=0;
    var sitenumberstatus=0;
    var alarmpinstatus=0;
    var alarmpinprioritystatus=0;
    var alarmpinttstatus=0;
    var namestatus=0;
}else if($("#form").hasClass('edit') || $("#preference_id").hasClass('edit')){
    var areaStatus=1;
    var customerstatus=1;
    var sitestatus=1;
    var namestatus=1;
    var pinstatus=1;
   
    var alarmpinnostatus=1;
    var alarmpinnamestatus=1;
    var usernamestatus=1;
    var passwordstatus=1;
    var customernamestatus=1;
    var mspnamestatus=1;
    var pinnamestatus=1;
    var pinscodestatus=1;
    var timezonestatus=1;
    var dateformatstatus=1;
    var pagerefreshstatus=1;
    var landingpagestatus=1;
    var sitereportstatus=1;
    var rolenamestatus=1;
    var customeridstatus=1;
    var sitenumberstatus=1;
    var alarmpinstatus=1;
    var alarmpinprioritystatus=1;
    var alarmpinttstatus=1;
    var namestatus=1;
}
var saverolenamestatus;
var  leng;
var spanid;

function alpha(ids,err1){
  if(ids=="rolename"){
      var role_name = document.getElementById("rolename").value; 
      $.ajax({
          url: '/userrole/verification',
          type: 'post',
          cache: false, 
          data: { rolename: role_name},
          success: function(data){
            if(data=="true"){
              saverolenamestatus=0;
              document.getElementById("err1").innerHTML="rolename already exist";
            }else{
              saverolenamestatus=1;
              document.getElementById("err1").innerHTML=""; 
            }
            console.log(saverolenamestatus);
          }
      });
  }

  if(ids=="pinname"){
      leng=50;
  }else if(ids=="pinscode"){
      leng=50;
  }else if(ids=="customername"){
      leng=25;
  }else if(ids=="site_name"){
      leng=50;
  }else{
      leng=15;
  }

 
  var s1=document.getElementById(ids).value;
  console.log(s1);
  var re = /^[a-zA-Z _]+$/;
  if((re.test(s1))&& (s1.length<=leng)){  
      console.log("First IF");
      document.getElementById(ids).style.borderColor="#e1e1e1";
      if(ids=="site_name"){
        namestatus=1;
      }
      if(ids=="username"){
        usernamestatus=1;
      }

      if(ids=="customername"){
        customernamestatus=1;
      }
      if(ids=="pinname"){
        pinnamestatus=1;
      }
      if(ids=="pinscode"){
        pinscodestatus=1;
      }
      if(ids=="landingpage"){
        landingpagestatus=1;
      }
      if(ids=="rolename"){
        rolenamestatus=1;
      }
  }else{
      console.log("First ELSE");
      if(ids=="rolename"){
        rolenamestatus=0;
      }
      if(ids=="landingpage"){
        landingpagestatus=0;
      }
      if(ids=="site_name"){
        namestatus=0;
      }
      if(ids=="username"){
        usernamestatus=0;
      }
      if(ids=="customername"){
        customernamestatus=0;
      }
      if(ids=="pinname"){
        pinnamestatus=0;
      }
      if(ids=="pinscode"){
        pinscodestatus=1;
      }
      document.getElementById(ids).style.borderColor="#FF0000";
  }
  
}

function drop(ids)
{
    if(ids=="customer_id"){
      console.log("dropdown");
      var dropdownval=document.getElementById("customer_id").value;
      console.log("dropdownval :"+dropdownval)

      if(dropdownval.length!=0){
          document.getElementById("customer_id").style.borderColor="#e1e1e1";
          customerstatus=1;
          customeridstatus=1;
      }else{
          document.getElementById("customer_id").style.borderColor="#FF0000";
          customeridstatus=0;
      }
    }

    if(ids=="user_type"){
        var dropdownval=document.getElementById("user_type").value;
        if(dropdownval.length!=0){
          document.getElementById("user_type").style.borderColor="#e1e1e1";
          usertypestatus=1;
        }
    }
    if(ids=="timezone"){
        var dropdownval=document.getElementById("timezone").value;
        if(dropdownval.length!=0){
          document.getElementById("timezone").style.borderColor="#e1e1e1";
          timezonestatus=1;
        }else{
          timezonestatus=0;
          document.getElementById("timezone").style.borderColor="#FF0000";
        }
    }
    if(ids=="dateformat"){
        var dropdownval=document.getElementById("dateformat").value;
        if(dropdownval.length!=0){
          document.getElementById("dateformat").style.borderColor="#e1e1e1";
          dateformatstatus=1;
        }else{
          dateformatstatus=0;
          document.getElementById("dateformat").style.borderColor="#FF0000";
        }
    }

    if(ids=="alarmpinstatus"){
        var dropdownval=document.getElementById("alarmpinstatus").value;
        if(dropdownval.length!=0){
          document.getElementById("alarmpinstatus").style.borderColor="#e1e1e1";
          alarmpinstatus=1;
        }else{
          alarmpinstatus=0;
          document.getElementById("alarmpinstatus").style.borderColor="#FF0000";
        }
    }

    if(ids=="alarmpinpriority"){
        var dropdownval=document.getElementById("alarmpinpriority").value;
        if(dropdownval.length!=0){
          document.getElementById("alarmpinpriority").style.borderColor="#e1e1e1";
          alarmpinprioritystatus=1;
        }else{
          alarmpinprioritystatus=0;
          document.getElementById("alarmpinpriority").style.borderColor="#FF0000";
        }
    }
    if(ids=="alarmpintt"){
        var dropdownval=document.getElementById("alarmpintt").value;
        if(dropdownval.length!=0){
          document.getElementById("alarmpintt").style.borderColor="#e1e1e1";
          alarmpinttstatus=1;
        }else{
          alarmpinttstatus=0;
          document.getElementById("alarmpintt").style.borderColor="#FF0000";
        }
    }
}


function alpha1(ids){
    console.log("alpha1 triggered :"+ids);
    if(ids=="pinname"){
      leng=50;
    }else if(ids=="pinscode"){
       leng=50;
    }else if(ids=="customername"){
       leng=25;
    }else if(ids=="site_name"){
        leng=50;
    }else{
        leng=15;
    }

    var s1=document.getElementById(ids).value;
    console.log("IDs value :"+s1);
    var re;
  
    re = /^[A-Za-z0-9 _]+$/i;
    if((re.test(s1))&& (s1.length<=leng )){  
        document.getElementById(ids).style.borderColor="#e1e1e1";
        if(ids=="site_code"){
          sitestatus=1;
        }
        if(ids=="alarmpinno"){
          alarmpinnostatus=1;
        }
        if(ids=="timezone"){
          timezonestatus=1;
        }
        if(ids=="name"){
          namestatus=1;
        }
        if(ids=="pinname"){
          pinnamestatus=1;
        }
        if(ids=="pinscode"){
          pinscodestatus=1;
        }
        if(ids=="mspname"){
          mspnamestatus=1;
        }
        if(ids=="alarmpinname"){
          alarmpinnamestatus=1;
        }
        if(ids=="password"){
          passwordstatus=1;
        }
    }else{
        if(ids=="name"){
          namestatus=0;
        }
    
        if(ids=="alarmpinname"){
          alarmpinnamestatus=0;
        }
        if(ids=="password"){
          passwordstatus=0;
        }
        if(ids=="mspname"){
          mspnamestatus=0;
        }
        if(ids=="site_code"){
          sitestatus=0;
        }
        if(ids=="pinname"){
          pinnamestatus=0;
        }
        if(ids=="pinscode"){
          pinscodestatus=0;
        }
        if(ids=="timezone"){
          timezonestatus=0;
        }
        document.getElementById(ids).style.borderColor="#FF0000";
    }

    if(ids=="area_name"){
        var spanvalue=$(".ui-helper-hidden-accessible").text();
        console.log("Span :"+spanvalue);
        if(spanvalue=="No search results."){
          areaStatus=0;
          console.log("span Success");
          document.getElementById(ids).style.borderColor="#FF0000";
        }else{
          areaStatus=1;
        }
    }
}


function num(ids){
  
    var s1=document.getElementById(ids).value;
    console.log(s1);
    var re = /^[0-9]+$/;
    if((re.test(s1))){  
        document.getElementById(ids).style.borderColor="#e1e1e1";
        if(ids=="site_pincode"){
          pinstatus=1;
        }
        if(ids=="pagerefresh"){
          pagerefreshstatus=1;
        }
        if(ids=="sitereport"){
          sitereportstatus=1;
        } 
        if(ids=="sitenumber"){
          sitenumberstatus=1;
        } 
    }else{
        document.getElementById(ids).style.borderColor="#FF0000";
        if(ids=="site_pincode"){
          pinstatus=0;
        }
        if(ids=="pagerefresh"){
          pagerefreshstatus=0;
        }
        if(ids=="sitereport"){
          sitereportstatus=0;
        }
        if(ids=="sitenumber"){
          sitenumberstatus=0;
        } 
        numericStatus=0;
    }
}

//customer module validate
function customervalidate(){
    if(passwordstatus==0){
      document.getElementById("password").style.borderColor="#FF0000";
    }
    if(customernamestatus==0){
      document.getElementById("customername").style.borderColor="#FF0000";
    }
    if( passwordstatus==0 || customernamestatus==0){
      return false;
    }else if( usernamestatus==1 && passwordstatus==1 && customernamestatus==1){
      return true;
    }
}

//user module validate
function uservalidate(){
    console.log("trigger");
    console.log("usenamest"+usernamestatus+"passwordstatus"+passwordstatus+"usertypestatus"+usertypestatus);
    if(document.getElementById("user_type").value == ""){
      usertypestatus = 0;
    }
    if(usernamestatus==0){
      document.getElementById("username").style.borderColor="#FF0000";
    }
    if(usertypestatus==0){
      document.getElementById("user_type").style.borderColor="#FF0000";
    }
    if(customeridstatus==0){
      document.getElementById("customer_id").style.borderColor="#FF0000";
    }
    if(passwordstatus==0){
      document.getElementById("password").style.borderColor="#FF0000";
    }
    if(usernamestatus==0 || passwordstatus==0 || usertypestatus==0 || customeridstatus==0){
      return false;
    }
    if( usernamestatus==1 && passwordstatus==1 && usertypestatus==1 && customeridstatus==1){
        console.log("sucess");
        return true;
    }
}

//preference module validate
function preferencevalidate(){
    console.log("cs"+customernamestatus);
    var dropdownval=document.getElementById("timezone").value;
    if(dropdownval.length!=0){
      document.getElementById("timezone").style.borderColor="#e1e1e1";
      timezonestatus=1;
    }else{
      document.getElementById("timezone").style.borderColor="#FF0000";
      timezonestatus=0;
    }

    var dropdownval=document.getElementById("dateformat").value;
    if(dropdownval.length!=0){
      document.getElementById("dateformat").style.borderColor="#e1e1e1";
      dateformatstatus=1;
    }else{
      document.getElementById("dateformat").style.borderColor="#FF0000";
      dateformatstatus=0;
    }

    if(dateformatstatus==0){
      document.getElementById("dateformat").style.borderColor="#FF0000";
    }
    if(sitenumberstatus==0){
      document.getElementById("sitenumber").style.borderColor="#FF0000";
    }
    if(pagerefreshstatus==0){
      document.getElementById("pagerefresh").style.borderColor="#FF0000";
    }
  
    if(sitereportstatus==0){
      document.getElementById("sitereport").style.borderColor="#FF0000";
    }
  
    if(landingpagestatus==0){
      document.getElementById("landingpage").style.borderColor="#FF0000";
    }

    console.log("timezone status"+timezonestatus);
    if(sitenumberstatus==0  ||timezonestatus==0 || dateformatstatus==0 || pagerefreshstatus==0 || sitereportstatus==0 || landingpagestatus==0){
      return false;
    }else if( timezonestatus==1 &&dateformatstatus==1 && pagerefreshstatus==1 && sitereportstatus==1 && landingpagestatus==1 && sitenumberstatus==1){
      return true;
    }
}

//site module validate
function sitevalidate(){
    console.log("sitevalidate triggered :"+sid);
    //console.log(alphanumericStatus+"alph"+alphaStatus+"numeric");
    if(sid != '1'){
      customerstatus = 1;
    }

    var dropdownval=document.getElementById("customer_id").value;
    console.log("dropdownval :"+dropdownval)

    if(dropdownval.length!=0){
      document.getElementById("customer_id").style.borderColor="#e1e1e1";
      customerstatus=1;
      customeridstatus=1;
    }else{
      document.getElementById("customer_id").style.borderColor="#FF0000";
      customerstatus=0;
    }
    
    if(areaStatus==0){
      document.getElementById("area_name").style.borderColor="#FF0000";
    }
  
    if(sitestatus==0){
      document.getElementById("site_code").style.borderColor="#FF0000";
    }

    if(namestatus==0){
      document.getElementById("site_name").style.borderColor="#FF0000";
    }

    if(pinstatus==0){
      document.getElementById("site_pincode").style.borderColor="#FF0000";
    }
    


    if(customerstatus==0 || areaStatus==0 || sitestatus==0 || namestatus==0 || pinstatus==0 ){
      //console.log("alphaN :"+alphanumericStatus+"alpha :"+alphaStatus+"numeric :"+numericStatus);
      return false;
    }else if(customerstatus==1 && areaStatus==1 && sitestatus==1 && namestatus==1 && pinstatus==1){
      //console.log(alphanumericStatus+"alph"+alphaStatus+"numeric");
      return true;
    }
}

//userrole module validate
function rolevalidate(err1){

    console.log(err1);
    
    if(rolenamestatus==0){
     document.getElementById("rolename").style.borderColor="#FF0000"; 
    }
    if(saverolenamestatus==0){
       document.getElementById("err1").innerHTML="rolename already exist";
    }
    
    if(rolenamestatus==0 || saverolenamestatus==0){
      return false;
    } else if(rolenamestatus==1 && saverolenamestatus==1){
      return true;
    }
}

//pin module validate
function pinvalidate(){
    if(pinnamestatus==0){
      document.getElementById("pinname").style.borderColor="#FF0000";
    }
    if(pinnamestatus==0){
      return false;
    } else if(pinnamestatus==1){
        return true;
    }
}

//pinmaster module validate
function pintextvalidate(){
    if(pinnamestatus==0){
      document.getElementById("pinname").style.borderColor="#FF0000";
    }
    if(pinscodestatus==0){
      document.getElementById("pinscode").style.borderColor="#FF0000";
    }
    
    if(pinnamestatus==0 || pinscodestatus==0){
      return false;
    } else{
      return true;
    }
}

//msp module validate
function mspvalidate(){
    if(mspnamestatus==0){
      document.getElementById("mspname").style.borderColor="#FF0000";
    }
    if(mspnamestatus==0){
      return false;
    }else if(mspnamestatus==1){
      return true;
    }
}

//alarm module validate
function alarmvalidate(){
    if(alarmpinstatus==0){
      document.getElementById("alarmpinstatus").style.borderColor="#FF0000";
    }
    if(alarmpinttstatus==0){
      document.getElementById("alarmpintt").style.borderColor="#FF0000";
    }
  
    if(alarmpinprioritystatus==0){
      document.getElementById("alarmpinpriority").style.borderColor="#FF0000";
    }
  
    if(alarmpinnostatus==0){
      document.getElementById("alarmpinno").style.borderColor="#FF0000";
    }
    
    if(alarmpinnamestatus==0){
      document.getElementById("alarmpinname").style.borderColor="#FF0000";
    }
  
    if(alarmpinnostatus==0 || alarmpinnamestatus==0 || alarmpinstatus==0 || alarmpinttstatus==0 || alarmpinprioritystatus==0){
      return false;
    } else if(alarmpinnamestatus==1 && alarmpinnostatus==1 && alarmpinstatus==1 && alarmpinttstatus==1 && alarmpinprioritystatus==1){
      return true;
    }
}

function geographyvalidate(){
    if(namestatus==0){
       document.getElementById("name").style.borderColor="#FF0000";
       return false;
    }
    if(namestatus==1){
      return true;
    }
}

function validate(){
    console.log("validate triggered :"+retvalue1);
    if(retvalue1 == false){
      $(".mustdata").css("border", "1px solid #ff0000");
      console.log("alpha triggered");
      return false;
    }
    return true;
}

 
