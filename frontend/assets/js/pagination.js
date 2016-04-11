//pagination function start
    function pagination(){
        console.log("pagination entered");
            document.getElementById("navigation").innerHTML="";
            var rownumber=document.getElementById("rowsperpageval").value;
            var rowsShown = rownumber;
            rowsShown=parseInt(rowsShown);
            numberofrecords=100*(rowsShown/10);
            //console.log("rowsShown"+rowsShown);
            currentposition=parseInt(currentposition);
            var rowsTotal = $('#alarm-tbl tbody tr').length;
            //console.log("datas are:::"+rowsTotal)
            if(((currentposition*rowsShown)>numberofrecords) ){
                    $('#navigation').append('<li><a onclick="previousrecords()" style="display:block" id="previousid" ><span>Prev</span></a></li>');
                }
                if((currentposition*rowsShown)<=numberofrecords){
                    $('#navigation').append('<li ><a onclick="previousrecords()" style="display:none" id="previousid" ><span>Prev</span></a></li>');
                }
             if(endposition>1){
                for(currentposition;currentposition<=endposition;currentposition++) {
                        //console.log("appending");
                        var pagenum=currentposition-1;
                        $('#navigation').append('<li><a href="#" rel="'+pagenum+'">'+currentposition+'</a><li> ');
                }
            }
             
            if((endposition<lastposition)|| nextbuttonstatus==1){
             $('#navigation').append(' <li><a onclick="nextrecords()" style="display:block"><span>Next</span></a></li>');
            }
            if((endposition==lastposition) || nextbuttonstatus==0){
             $('#navigation').append(' <li><a onclick="nextrecords()" style="display:none"><span>Next</span></a></li>');
            }
                $('#alarm-tbl tr').hide();
                $('#alarm-tbl tr').slice(0, rowsShown).show();
                $('#navigation a:first').addClass('active');
                $('#navigation a').bind('click', function(){
                $('#navigation a').removeClass('active');
                $(this).addClass('active');
                var currPage = $(this).attr('rel');
                //console.log("currentpagepos"+currPage);
                    if(currPage>10){
                        var divval=Math.floor(currPage/10,0);
                        //console.log("divval"+divval);
                        var num=currPage%(10*divval);
                        //console.log("remainder vvalue"+num);
                        currPage=num;
                        if(num==0){
                            currPage=10;
                        }
                        //console.log("currPage"+currPage);
                    }
                    if(currPage==10){
                        currPage=0;
                    }

                    var startItem = currPage * rowsShown;
                    var endItem = startItem + rowsShown;
                //console.log("startItem"+startItem+"endItem"+endItem);
                $('#alarm-tbl tr').css('opacity','0.0').hide().slice(startItem, endItem).
                                    css('display','table-row').animate({opacity:1}, 300);
                });
    }
    //pagination function end

    $("#customer_id").change(function(){
        statuschange();
        tabledata();
    });


    $("#searchbtn1").click(function(){
        statuschange();
        tabledata();    
    })

     $("#rowsperpageval").change(function(){
        statuschange();
        tabledata();
    })

    function previousrecords(){
        document.getElementById("statusvalue").value=1;
        tabledata();
    }
    
    function nextrecords(){
        var nextval=document.getElementById("nextval").value;
        var nextvalue=parseInt(nextval);
        document.getElementById("nextval").value=nextvalue+numberofrecords;
        document.getElementById("statusvalue").value=0;
        tabledata();
    }

    function statuschange(){
        //document.getElementById("nextval").value=numberofrecords*(rowsperpageval/10);
        document.getElementById("statusvalue").value=2;
    }