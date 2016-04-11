function setActive() {
aObj = document.getElementById('cssmenu').getElementsByTagName('a');
  var k;
  var element;
  var starus=0;
  console.log(aObj.length);
  for(i=0;i<aObj.length;i++) { 
    
    if(document.location.href.indexOf(aObj[i].href)>=0) {
           aObj[i].className='actives';
      k=i;
      console.log("indexvalue"+i+"value:"+aObj[i]);
    }
  }

var els = document.getElementsByTagName("a");
 console.log(els.length);
    if(k>=1 && k<=6)
    {
      var el = els[9];
      var x=el.parentElement;
      var y=x.parentElement;
      console.log(y);
      y.className="disp";
   }

   if(k>=8 && k<=11)
   {
      var el = els[15];
      var x=el.parentElement;
      var y=x.parentElement;
      console.log(y);
      y.className="disp";

   }

   if(k==13 || k==14)
   {
      var el = els[20];
      var x=el.parentElement;
      var y=x.parentElement;
      console.log(y);
      y.className="disp";

   }

    if(k==17|| k==16)
   {
      var el = els[24];
      var x=el.parentElement;
      var y=x.parentElement;
      console.log(y);
      y.className="disp";

   }

   if(k>=20 && k<=27)
   {
      var el = els[30];
      var x=el.parentElement;
      var y=x.parentElement;
      console.log(y);
      y.className="disp";

   }
   
}


window.onload = setActive;


/* function setActive() {
  aObj = document.getElementById('cssmenu').getElementsByTagName('a');
  for(i=0;i<aObj.length;i++) { 
    if(document.location.href.indexOf(aObj[i].href)>=0) {
      aObj[i].className='actives';
      console.log("step1="+aObj[i]);
    }
  }

}

window.onload = setActive;*/
/* here's the code if u want to use plain javascript

function setActive() {
  aObj = document.getElementById('menuactive').getElementsByTagName('a');
  for(i=0;i<aObj.length;i++) { 
    if(document.location.href.indexOf(aObj[i].href)>=0) {
      aObj[i].className='actives';
    }
  }
}

window.onload = setActive;

*/

/*function setActive() {
  aObj = document.getElementById('cssmenu').getElementsByTagName('a');
  for(i=0;i<aObj.length;i++) { 
    if(document.location.href.indexOf(aObj[i].href)>=0) {
      aObj[i].className='actives';
      console.log("step1="+aObj[i]);
    }
  }
}

window.onload = setActive;*/