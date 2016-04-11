var express = require('express');
var router = express.Router();
var moment = require('moment');

var minRange=10;
var maxRange=50;
var stepRange=10;

var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    req.session.uname = req.user.user_name;
    req.session.rid = req.user.role_id;
    req.session.uid = req.user.user_id;
    req.session.cid = req.user.customer_id;
    req.session.perrows = req.user.page_refresh;
    req.session.smsstatus = req.user.sms_status;
    req.session.videostatus = req.user.video_status;
    req.session.reports_info = req.user.reports_info;
    return next();
  
  res.redirect('/');
}


module.exports = function(passport,connection) {
  /* GET geography listing. */
  router.get('/', isAuthenticated, function(req, res){
    console.log("Live Page Get Method ");
    res.render('live/index',{sess_name:req.session.uname,sess_id:req.session.rid,minRange:minRange,maxRange:maxRange,stepRange:stepRange});
  });    

  router.post('/getdata', function(req, res){
      console.log("Live Page POST Method ");
      var suname =req.session.uname;
      var suid =req.session.uid;
      var srid=req.session.rid;
      var cid = req.session.cid;
      var customer_id=req.body.custid;
      
      var numberofrecords=100;
      var nextPageValue=req.body.nextval;
     // console.log("next val=="+nextPageValue);
      var statusValue=req.body.statusvalue;
      var rowsperpageval=req.body.rowsperpageval;
      var limitStartVal;
      var startPosition=1;
      var endPosition;
      var lastRecordPosition;
      var nextval;
      var nextbuttonstatus=1;
      var perpage = req.session.perrows;
      var pushdata = [];
      var outageDatas = [];
      var fields1 = [];
     
      
      //var fromdate = moment(req.body.fromdate).format('YYYY-MM-DD HH:mm:ss');
      //var todate= moment(req.body.todate).format('YYYY-MM-DD HH:mm:ss');
      var siteid =req.body.siteid;
      var sitestatus=req.body.sitestatus;
      //for pagination
      var numberofrecords=100;
      if(req.body.statusvalue==2 && typeof req.body.statusvalue!='undefined'){
         // console.log("nextpageval if triggerd........"+rowsperpageval+"numberofrecords"+numberofrecords);
          nextPageValue=numberofrecords*(rowsperpageval/10);
      }
      if(typeof rowsperpageval === 'undefined'){
        rowsperpageval=10;
      }
      if(typeof nextPageValue== 'undefined' || nextPageValue == ''){
        //console.log("nextpageval if triggerd"+rowsperpageval+"numberofrecords"+numberofrecords);
        limitStartVal=0;
        nextPageValue=numberofrecords*(rowsperpageval/10);
        statusValue=0;
      }
      numberofrecords=numberofrecords*(rowsperpageval/10);
      records_to_subtract=numberofrecords;
      numberofrecords+=1;
      //console.log("numberofrecords"+numberofrecords);
      //console.log("STEP-2 :"+nextPageValue+" Status:"+statusValue);
      if(((typeof nextPageValue!= 'undefined' || nextPageValue != '') && statusValue==0) || ((typeof nextPageValue!= 'undefined' || nextPageValue != '') && statusValue==2)){
        limitStartVal=nextPageValue-records_to_subtract;       
        nextval=nextPageValue;
        startPosition=nextPageValue-(numberofrecords-1);
        startPosition=startPosition/rowsperpageval;
        startPosition+=1;
        if(startPosition==0){
          startPosition=1;
        }
        endPosition=nextPageValue/rowsperpageval;
        lastRecordPosition=endPosition+1;
      }
      if(typeof nextPageValue!= 'undefined' && statusValue==1){
        limitStartVal=nextPageValue-((numberofrecords-1)*2);
        //console.log("limitStartVal in previous"+limitStartVal);
        if(limitStartVal<0){
          limitStartVal=0;
        }
        startPosition=nextPageValue-((numberofrecords-1)*2);
        startPosition=startPosition/rowsperpageval;
        startPosition+=1;
        if(startPosition==0){
          startPosition=1;
        }
        nextval=nextPageValue-(numberofrecords-1);
        endPosition=(nextval)/rowsperpageval;
        lastRecordPosition=endPosition+1;
      }
     // console.log("srid::"+srid);
      if(typeof customer_id === 'undefined' || customer_id === ''){  
          var sql = "SELECT alarmpin_no,alarmpin_sc,alarmpin_name from tbl_alarmpin WHERE alarmpin_status = '0' and customer_id='0'";
      }else{
          var sql = "SELECT alarmpin_no,alarmpin_sc,alarmpin_name from tbl_alarmpin WHERE alarmpin_status = '0' and customer_id='"+customer_id+"'";
      }

      console.log("FirstSQL :"+sql);
      connection.query(sql)
          .on('result', function(data){
            pushdata.push(data);
      })  

      .on('end', function(){
        console.log("pushdata::"+pushdata);
          //console.log(pushdata);
          strdata= "";
          //console.log("pushdata:"+JSON.stringify(pushdata));
          for(i=0;i<pushdata.length;i++){
           /* if(pushdata[i].alarmpin_no == 'Da41'){
              pushdata[i].alarmpin_no = 'Da1';
            }else if(pushdata[i].alarmpin_no == 'Da42'){
              pushdata[i].alarmpin_no = 'Da2';
            }else if(pushdata[i].alarmpin_no == 'Da43'){
              pushdata[i].alarmpin_no = 'Da3';
            }else if(pushdata[i].alarmpin_no == 'Da44'){
              pushdata[i].alarmpin_no = 'Da4';
            }else if(pushdata[i].alarmpin_no == 'Da45'){
              pushdata[i].alarmpin_no = 'Da5';
            }else if(pushdata[i].alarmpin_no == 'Da46'){
              pushdata[i].alarmpin_no = 'Da6';
            }else if(pushdata[i].alarmpin_no == 'Da47'){
              pushdata[i].alarmpin_no = 'Da7';
            }else if(pushdata[i].alarmpin_no == 'Da48'){
              pushdata[i].alarmpin_no = 'Da8';
            }else if(pushdata[i].alarmpin_no == 'Da49'){
              pushdata[i].alarmpin_no = 'Da9';
            }else if(pushdata[i].alarmpin_no == 'Da50'){
              pushdata[i].alarmpin_no = 'Da10';
            } */
            if((pushdata[i].alarmpin_no).match(/Da[41-49]/)){
                pushdata[i].alarmpin_no = (pushdata[i].alarmpin_no).replace('4','') ;
               // console.log("data are::"+pushdata[i].alarmpin_no);
            }else if(pushdata[i].alarmpin_no == 'Da50'){
              pushdata[i].alarmpin_no = 'Da10';
            } 
            strdata += "a."+pushdata[i].alarmpin_no+" "+pushdata[i].alarmpin_sc+",";
            fields1.push(pushdata[i].alarmpin_sc);
          }
         
          orgstr = strdata.substr(0,strdata.length-1);

          //console.log("StrData :"+orgstr);
          var query="";
          var sql="";
          if ((req.body && typeof siteid === 'undefined' && typeof customer_id === 'undefined'  && typeof sitestatus==='undefined' ) || (siteid === '' && customer_id === '' && sitestatus === '')){
            sql =  "SELECT a.RecordingTimeStamp,a.Siteid,b.site_name,c.customer_name,a.IP, "+orgstr+" FROM lastknown a,tbl_site b,tbl_customer c WHERE a.Siteid=b.site_code and b.customer_id=c.customer_id ORDER BY a.RecordingTimeStamp DESC";
          }else{ 
            console.log("Else Triggered*************");
            /*  if(fromdate != ""){
              query = query + " AND date_format(a.RecordingTimeStamp,'%Y-%m-%d')>='"+fromdate+"'";
            }  

            if(todate != ""){
              query = query + " AND date_format(a.RecordingTimeStamp,'%Y-%m-%d')<='"+todate+"'";
            } */
            if(siteid != "" && typeof siteid != 'undefined'){
              var s=siteid.toString().split(",");
              var finalsiteid="";
              for(var i=0;i<s.length;i++){
                finalsiteid=finalsiteid+"'"+s[i]+"',";
              }
              siteid = finalsiteid.substr(0,finalsiteid.length-1);
              query = query + " AND a.Siteid IN ("+siteid+")";
            } 

            if(srid!=6){
              if(customer_id != "" && typeof customer_id != 'undefined') {
                query = query+ " AND b.customer_id = '"+ customer_id +"'";
              }
            }else{
              query = query+ " AND b.customer_id = '"+ cid +"'";
            }  
         
            if(query != ""){
              queryStr = query;
            }
            console.log("Site-Status :"+req.body.sitestatus);
            if(req.body.sitestatus == '0'){ 
              sql = "SELECT a.RecordingTimeStamp,a.Siteid,b.site_name,c.customer_name,a.IP, "+orgstr+" FROM lastknown a,tbl_site b,tbl_customer c WHERE b.site_status='0' AND a.Siteid=b.site_code and b.customer_id=c.customer_id "+query+" ORDER BY a.RecordingTimeStamp DESC"+" limit "+limitStartVal+","+numberofrecords+"" ;
            }else if(req.body.sitestatus== '1'){
              sql = "SELECT a.RecordingTimeStamp,a.Siteid,b.site_name,c.customer_name,a.IP, "+orgstr+" FROM lastknown a,tbl_site b,tbl_customer c WHERE b.site_status='1'  AND a.Siteid=b.site_code and b.customer_id=c.customer_id "+query+" ORDER BY a.RecordingTimeStamp DESC"+" limit "+limitStartVal+","+numberofrecords+"" ;         
            }else if(req.body.sitestatus== '2'){ 
              sql = "SELECT a.RecordingTimeStamp,a.Siteid,b.site_name,c.customer_name,a.IP, "+orgstr+" FROM lastknown a,tbl_site b,tbl_customer c WHERE TIMESTAMPDIFF(hour,a.RecordingTimeStamp,'"+moment().format('YYYY-MM-DD HH:mm:ss')+"')>=1 AND a.Siteid=b.site_code and b.customer_id=c.customer_id "+query+" ORDER BY a.RecordingTimeStamp DESC"+" limit "+limitStartVal+","+numberofrecords+"" ;   
            }else{
              sql = "SELECT a.RecordingTimeStamp,a.Siteid,b.site_name,b.site_address,c.customer_name,a.IP, "+orgstr+" FROM lastknown a,tbl_site b,tbl_customer c WHERE a.Siteid=b.site_code and b.customer_id=c.customer_id "+query+" ORDER BY a.RecordingTimeStamp DESC"+" limit "+limitStartVal+","+numberofrecords+"" ;   
            }   

        }//else end
        console.log("Live triggered:"+sql)
        connection.query(sql)
          .on('result', function(data){
            // Push results onto the notes array
              res.header("Access-Control-Allow-Origin","*");
              res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");;
              outageDatas.push(data);
            //outageDatas.push(data);
          }) 
          
          .on('end', function(){
              var resultslength = outageDatas.length;
             // console.log("total records::"+totalDatas);
             if(resultslength==undefined){
                outageDatas=[];
             }
              if(outageDatas.length<=(numberofrecords-1))
              {
                var pagesCount=Math.ceil(outageDatas.length/rowsperpageval,0);
                endPosition=startPosition+(pagesCount-1);
                lastRecordPosition=endPosition;
                nextbuttonstatus=0;
              }
              if(outageDatas.length>(numberofrecords-1)){
                console.log("outageDataslength"+outageDatas.length);
                nextbuttonstatus=1;
                outageDatas.pop();
              }
              console.log("uname :"+suname+"Role:"+srid);
              res.send({title:"AlarmLists", 
                fieldnames : pushdata,
                siteid:req.body.siteid,
               // fromdate:fromdate,
                //todate:todate,
                datas:outageDatas,
                dataslength: resultslength,
                custid: customer_id,
                nextpagevalue:nextval,
                currentposition:startPosition,
                endposition:endPosition,
                lastposition:lastRecordPosition,
                nextbuttonstatus:nextbuttonstatus
              });
          })
          //console.log("NewSQL :"+newsql);
      })
      
  });

  return router;
}
