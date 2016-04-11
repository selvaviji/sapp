if($("#form").hasClass('new')){
	console.log("if triggered");
	var retvalue1 = retvalue2 = retvalue3 = false;
}else{
	console.log("else triggered");
	var retvalue1 = retvalue2 = retvalue3 = true;
}

//var allHaveClass = $('#form input').length == $('#form input.mustdata').length;

console.log(" Count:"+$('#form input.mustdata').length);

$(".mustdata").focus(function(){
	if ($(this).val() == "") {
        $(this).css("border", "1px solid #ff0000");
        //$(this).attr("placeholder", ph);
        retvalue1 = false;
    }else{
    	retvalue1 = true;
        $(this).css("border", "1px solid  #e1e1e1");
        if($(this).hasClass("alpha")){
        	var re = /^[a-zA-Z]+$/;
        	var s1 = $(this).val();
        	if((re.test(s1))){ 
	        	$(this).css("border", "1px solid  #e1e1e1");
	            retvalue1 = true;
	            text1=1;
	        }else{
	           	$(this).css("border", "1px solid #ff0000");
	           	//$(this).attr("placeholder", ph);
	           	retvalue1 = false;
	           	text1=0;
	        }
        }else if($(this).hasClass("alphaNumeric")){
        	var re = /^[A-Za-z0-9]/i;
        	var s1 = $(this).val();
	        if((re.test(s1))){ 
	           	$(this).css("border", "1px solid  #e1e1e1");
	            text1=1;
	            retvalue1 = true;
	        }else{
	           	$(this).css("border", "1px solid #ff0000");
	           	//$(this).attr("placeholder", ph);
	           	retvalue1 = false;
	            text1=0;
	        }
        	
        	console.log("alphaNumeric triggered");
        }else if($(this).hasClass("Numeric")){
        	var s1 = $(this).val();
		    console.log(s1);
		    var re = /^[0-9]/i;
		    if((re.test(s1))){ 
		      $(this).css("border", "1px solid  #e1e1e1");
		      chkNumber=1;
		      retvalue1 = true;
		    }else{
		      $(this).css("border", "1px solid #ff0000");	
		      //$(this).attr("placeholder", ph);
		      retvalue1 = false;
		      chkNumber=0;
		    }
        }else if($(this).hasClass("Hexa")){
        	var s1 = $(this).val();
		    console.log(s1);
		    var re =  /^(#)?([0-9a-fA-F]{3})([0-9a-fA-F]{3})?$/;
		    if((re.test(s1))){ 
		      $(this).css("border", "1px solid  #e1e1e1");
		      chkNumber=1;
		      retvalue1 = true;
		    }else{
		      $(this).css("border", "1px solid #ff0000");	
		      //$(this).attr("placeholder", ph);
		      retvalue1 = false;
		      chkNumber=0;
		    }
        }else{
        	retvalue1 = true;
        }
    }
});
	
$(".mustdata").change(function(){
    
    var arg = "Fill the ";
	/*var ph = $(this).attr("placeholder");
	if(ph.indexOf(arg)){
		ph = "Fill the "+ph;
	}*/
	if ($(this).val() == "") {
        $(this).css("border", "1px solid #ff0000");
        //$(this).attr("placeholder", ph);
        retvalue1 = false;
    }else{
    	retvalue1 = true;
        $(this).css("border", "1px solid  #e1e1e1");
        if($(this).hasClass("alpha")){
        	var re = /^[a-zA-Z]+$/;
        	var s1 = $(this).val();
        	if((re.test(s1))){ 
	        	$(this).css("border", "1px solid  #e1e1e1");
	            retvalue1 = true;
	            text1=1;
	        }else{
	           	$(this).css("border", "1px solid #ff0000");
	           	//$(this).attr("placeholder", ph);
	           	retvalue1 = false;
	           	text1=0;
	        }
        }else if($(this).hasClass("alphaNumeric")){
        	var re = /^[A-Za-z0-9]/i;
        	var s1 = $(this).val();
	        if((re.test(s1))){ 
	           	$(this).css("border", "1px solid  #e1e1e1");
	            text1=1;
	            retvalue1 = true;
	        }else{
	           	$(this).css("border", "1px solid #ff0000");
	           	//$(this).attr("placeholder", ph);
	           	retvalue1 = false;
	            text1=0;
	        }
        	
        	console.log("alphaNumeric triggered");
        }else if($(this).hasClass("Numeric")){
        	var s1 = $(this).val();
		    console.log(s1);
		    var re = /^[0-9]/i;
		    if((re.test(s1))){ 
		      $(this).css("border", "1px solid  #e1e1e1");
		      chkNumber=1;
		      retvalue1 = true;
		    }else{
		      $(this).css("border", "1px solid #ff0000");	
		      //$(this).attr("placeholder", ph);
		      retvalue1 = false;
		      chkNumber=0;
		    }
        }else if($(this).hasClass("Hexa")){
        	var s1 = $(this).val();
		    console.log(s1);
		    var re =  /^(#)?([0-9a-fA-F]{3})([0-9a-fA-F]{3})?$/;
		    if((re.test(s1))){ 
		      $(this).css("border", "1px solid  #e1e1e1");
		      chkNumber=1;
		      retvalue1 = true;
		    }else{
		      $(this).css("border", "1px solid #ff0000");	
		      //$(this).attr("placeholder", ph);
		      retvalue1 = false;
		      chkNumber=0;
		    }
        }else{
        	retvalue1 = true;
        }
    }

});

$(".mustdata").blur(function() {
	var arg = "Fill the ";
	/*var ph = $(this).attr("placeholder");
	if(ph.indexOf(arg)){
		ph = "Fill the "+ph;
	}*/
	if ($(this).val() == "") {
        $(this).css("border", "1px solid #ff0000");
       // $(this).attr("placeholder", ph);
        retvalue1 = false;
    }else{
        $(this).css("border", "1px solid  #e1e1e1");
        if($(this).hasClass("alpha")){
        	var re = /^[a-zA-Z]+$/;
        	var s1 = $(this).val();
        	if((re.test(s1))){ 
	        	$(this).css("border", "1px solid  #e1e1e1");
	            retvalue1 = true;
	            text1=1;
	        }else{
	           	$(this).css("border", "1px solid #ff0000");
	           //	$(this).attr("placeholder", ph);
	           	retvalue1 = false;
	           	text1=0;
	        }
        }else if($(this).hasClass("alphaNumeric")){
        	var re = /^[A-Za-z0-9]/i;
        	var s1 = $(this).val();
	        if((re.test(s1))){ 
	           	$(this).css("border", "1px solid  #e1e1e1");
	            text1=1;
	            retvalue1 = true;
	        }else{
	           	$(this).css("border", "1px solid #ff0000");
	           //	$(this).attr("placeholder", ph);
	           	retvalue1 = false;
	            text1=0;
	        }
        	
        	console.log("alphaNumeric triggered");
        }else if($(this).hasClass("Numeric")){
        	var s1 = $(this).val();
		    console.log(s1);
		    var re = /^[0-9]/i;
		    if((re.test(s1))){ 
		      $(this).css("border", "1px solid  #e1e1e1");
		      chkNumber=1;
		      retvalue1 = true;
		    }else{
		      $(this).css("border", "1px solid #ff0000");	
		      //$(this).attr("placeholder", ph);
		      retvalue1 = false;
		      chkNumber=0;
		    }
        }else if($(this).hasClass("Hexa")){
        	var s1 = $(this).val();
		    console.log(s1);
		    var re =  /^(#)?([0-9a-fA-F]{3})([0-9a-fA-F]{3})?$/;
		    if((re.test(s1))){ 
		      $(this).css("border", "1px solid  #e1e1e1");
		      chkNumber=1;
		      retvalue1 = true;
		    }else{
		      $(this).css("border", "1px solid #ff0000");	
		      //$(this).attr("placeholder", ph);
		      retvalue1 = false;
		      chkNumber=0;
		    }
        }else{
        	retvalue1 = true;
        }
    }
});

$(".mustdata").keyup(function() {
    if ($(this).val() == "") {
        $(this).css("border", "1px solid #ff0000");
        //$(this).attr("placeholder", ph);
        retvalue1 = false;
    }else{
        $(this).css("border", "1px solid  #e1e1e1");
        if($(this).hasClass("alpha")){
        	var re = /^[a-zA-Z]+$/;
        	var s1 = $(this).val();
        	if((re.test(s1))){ 
	        	$(this).css("border", "1px solid  #e1e1e1");
	            retvalue1 = true;
	            text1=1;
	        }else{
	           	$(this).css("border", "1px solid #ff0000");
	           	//$(this).attr("placeholder", ph);
	           	retvalue1 = false;
	           	text1=0;
	        }
        }else if($(this).hasClass("alphaNumeric")){
        	var re = /^[A-Za-z0-9]/i;
        	var s1 = $(this).val();
	        if((re.test(s1))){ 
	           	$(this).css("border", "1px solid  #e1e1e1");
	            text1=1;
	            retvalue1 = true;
	        }else{
	           	$(this).css("border", "1px solid #ff0000");
	           //	$(this).attr("placeholder", ph);
	           	retvalue1 = false;
	            text1=0;
	        }
        	
        	console.log("alphaNumeric triggered");
        }else if($(this).hasClass("Numeric")){
        	var s1 = $(this).val();
		    console.log(s1);
		    var re = /^[0-9]/i;
		    if((re.test(s1))){ 
		      $(this).css("border", "1px solid  #e1e1e1");
		      chkNumber=1;
		      retvalue1 = true;
		    }else{
		      $(this).css("border", "1px solid #ff0000");	
		     // $(this).attr("placeholder", ph);
		      retvalue1 = false;
		      chkNumber=0;
		    }
        }else if($(this).hasClass("Hexa")){
        	var s1 = $(this).val();
		    console.log(s1);
		    var re =  /^(#)?([0-9a-fA-F]{3})([0-9a-fA-F]{3})?$/;
		    if((re.test(s1))){ 
		      $(this).css("border", "1px solid  #e1e1e1");
		      chkNumber=1;
		      retvalue1 = true;
		    }else{
		      $(this).css("border", "1px solid #ff0000");	
		      //$(this).attr("placeholder", ph);
		      retvalue1 = false;
		      chkNumber=0;
		    }
        }else{
        	retvalue1 = true;
        }
    }
});


validate = function(){
	console.log("validate triggered :"+retvalue1);
	if(retvalue1 == false){
		//if($(this).hasClass("mustdata")){
			$(".mustdata").css("border", "1px solid #ff0000");
		//}	
		console.log("alpha triggered");
		return false;
	}
	return true;
}

