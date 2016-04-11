(function($){
	$(document).ready(function(){

		$('#cssmenu li.active').addClass('open').children('ul').show();
			$('#cssmenu li.has-sub>a').on('click', function(){
				$(this).removeAttr('href');
				var element = $(this).parent('li');
				if (element.hasClass('open')) {
					element.removeClass('open');
					element.find('li').removeClass('open');
					element.find('ul').slideUp(200);
				}else{
					element.addClass('open');
					element.children('ul').slideDown(200);
					element.siblings('li').children('ul').slideUp(200);
					element.siblings('li').removeClass('open');
					element.siblings('li').find('li').removeClass('open');
					element.siblings('li').find('ul').slideUp(200);
				}
			});

	});
})(jQuery);

function setActive() {
	aObj = document.getElementById('cssmenu').getElementsByTagName('a');
	var k;
	var element;
	var starus=0;
	//console.log(aObj.length);
  	for(i=0;i<aObj.length;i++) { 
    	if(document.location.href.indexOf(aObj[i].href)>=0) {
           aObj[i].className='actives';
      		k=i;
      		//console.log("PArent :"+aObj[i].parent());
      		//console.log("indexvalue"+i+"value:"+aObj[i]);
    	}
  	}
    //var els1 = document.getElementsByTagName("li");
    //console.log("li length"+els1.length);
	var els = document.getElementById('cssmenu').getElementsByTagName('a');
 		for(i=0;i<els.length;i++)
 		{
 			if(i==k)
 			{
 				var x=els[i].parentElement;
 				var y=x.parentElement;
 				y.className="disp";
 			}
 		}
}
window.onload = setActive;
