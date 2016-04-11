
/*  function for userrole,customer,user,site html page validation */
var text=0;
var text1=0;
var pwd=0;
var pcode=0;
var leng;
var errmsg="";
var chkNumber=0;

function alpha(ids,spanid){
    if(ids == "customername"){
      leng=25;
    }else{
      leng=15;
    }
    var x=document.getElementById(ids);
  	var t1=x.getAttribute("type");
  	console.log(t1);
  	if(t1=="text"){
        var s1=document.getElementById(ids).value;
        console.log(s1);
        var re = /^[A-Za-z/]/i;
        if((re.test(s1))&& (s1.length<=leng )){   
           	errmsg="";
            text=1;  //1 
        }else{
            errmsg="Invalid  Name";
            text=0;
        }
        var sid=document.getElementById(spanid);
        //console.log("AlphaError :"+errmsg);
        document.getElementById(spanid).innerHTML=errmsg;
    }


    if(t1=="password"){
      	var s2=document.getElementById(ids).value;
      	var re1= /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
      	if(re1.test(s2)){
      		 errmsg="Valid Password";
      	}else{
      		 errmsg="Invalid Password";
      	}
        document.getElementById(spanid).innerHTML=errmsg;
    }
} /*ends*/

/* function for msp,pin details html pages validation*/
function alphaNumeric(ids,spanid){
    if(ids=="site_name"){
      leng=50;
    }else{
      leng=15;
    }
    var x=document.getElementById(ids);
  	var t1=x.getAttribute("type");
  	console.log(t1);
  	if(t1=="text"){
        var s1=document.getElementById(ids).value;
        console.log(s1);
        var re = /^[A-Za-z0-9]/i;
        if((re.test(s1)) && (s1.length<=leng)){ 
           	errmsg="";
            text1=1;
        }else{
           	errmsg="Invalid Name";
            text1=0;
        }
        var sid=document.getElementById(spanid);
        //console.log("Error :"+errmsg);
        document.getElementById(spanid).innerHTML=errmsg;
    }
 } /*ends*/

 /* function for msp,pin details html pages validation*/
function Numeric(ids,spanid){
    var s1=document.getElementById(ids).value;
    console.log(s1);
    var re = /^[0-9]/i;
    if((re.test(s1))){ 
      errmsg="";
      chkNumber=1;
    }else{
      errmsg="Invalid Data";
      chkNumber=0;
    }
    var sid=document.getElementById(spanid);
    document.getElementById(spanid).innerHTML=errmsg;
    //document.getElementById("errNo").innerHTML=errmsg;
 
 } /*ends*/

/*function for pincode validation*/
function pincode(id){   
  var s5=document.getElementById(id).value;
  var re=/[0-9]/
  if(s5.length==6 && re.test(s5)){
    errmsg="";
    pcode=1;
  }else{
    errmsg="Invalid Pincode";
    pcode=0;
  }
   document.getElementById("err3").innerHTML=errmsg;

}/*ends*/



/*validatio function for user page*/

function userrole(){
  if(text==0){
     document.getElementById("err1").innerHTML="Invalid  Name";
     return false;
  } 
  return true;
} //ends


function userValidate(){
  if(text==0){
      //document.getElementById("err1").innerHTML="Invalid  Name";
      return false;
  } 
  if(pwd==0){
      //document.getElementById("err2").innerHTML="Invalid Password";
      return false;
  }
  return true;
} //ends

/*validation function for customer page */
function customerValidate(){
  if(text1==0){
      //document.getElementById("err1").innerHTML="Invalid  Name";
      return false;
  } 
  if(pwd==0){
      //document.getElementById("err2").innerHTML="Invalid Password";
      return false;
  }
  return true;
}//ends



/*validation for msp pyage save button*/
function mspsave(){
   if(text1==0){
      document.getElementById("err1").innerHTML="Invalid  Name";
      return false;
    } 
    return true
}//ends



/*validation for pindetails page save button*/
function priorityValidate(){
  if(text1==0){
     document.getElementById("err1").innerHTML="Invalid  Name";
     return false;
  } 
  return true;
}//ends

/*validation for pindetails page save button*/
function geographyValidate(){
  var name = document.getElementById("name").value;
  var cname = document.getElementById("bcrumb").innerText;
  if(name == ""){ 
     document.getElementById("geoerror").innerHTML="Invalid  Name";
     return false;
  } 
  if(cname ==""){
    document.getElementById("breaderror").innerHTML = "Invalid Geography Name";
    return false;
  }
  return true;
}//ends


/*validation for sitesave validation button*/
function sitesave(){
  if(text==0){
    document.getElementById("err1").innerHTML="Invalid  Name";
    return false;
  }
  if(pcode==0){
    document.getElementById("err3").innerHTML="Invalid Pincode";
    return false;
  }
  return true;
}//ends

/*validation for preference validation button*/
function prefValidate(){
  if(text==0){
    //document.getElementById("err1").innerHTML="Invalid  Name";
    return false;
  }
  if(chkNumber==0){
    //document.getElementById("errNo").innerHTML="Invalid Data";
    return false;
  }
  return true;
}//ends