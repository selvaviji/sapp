var express = require('express');
var router = express.Router();
var moment = require('moment');

var minRange=10;
var maxRange=50;
var stepRange=10;

var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();
  // if the user is not authenticated then redirect him to the login page
  res.redirect('/');
}


module.exports = function(passport,connection) {
    /* GET geography listing. */

router.get('/', isAuthenticated, function(req, res){
     console.log(" rawdatara Triggered");
      var suname =req.session.uname;
      var suid =req.session.uid;
      var srid=req.session.rid;
    res.render('rawdata/index',{title:"AlarmLists", sess_name: suname, sess_id: srid, minRange: minRange, maxRange: maxRange, stepRange: stepRange});
}); 


router.post('/getdata', isAuthenticated, function(req, res){
          console.log("rawdata getdata Triggered :");
          var suname =req.session.uname;
          var suid =req.session.uid;
          var srid=req.session.rid;
          var cid=req.session.cid;
          var siteid = req.body.siteid;
          console.log("siteid=="+siteid);
          var sql='';
          var fromdate = moment(req.body.fromdate).format('YYYY-MM-DD');
          console.log("fromdate=="+fromdate);
         
          var todate= moment(req.body.todate).format('YYYY-MM-DD');
          console.log("todate=="+todate);

          var customerid=req.body.custid;
          console.log("customerid=="+customerid);
         
          
          var query='';
         //for pegination
          var numberofrecords=100;
          //var records_to_subtract;
          var nextPageValue=req.body.nextval;
          //console.log("nextPageValue.............."+nextPageValue);
          var statusValue=req.body.statusvalue;
          var rowsperpageval=req.body.rowsperpageval;
          var limitStartVal;
          var startPosition=1;
          var endPosition;
          var lastRecordPosition;
          var nextval;
          var nextbuttonstatus=1;
          if(req.body.statusvalue==2 && typeof req.body.statusvalue!='undefined'){
              //console.log("nextpageval if triggerd........"+rowsperpageval+"numberofrecords"+numberofrecords);
              nextPageValue=numberofrecords*(rowsperpageval/10);
          }
          if(typeof rowsperpageval == 'undefined'){
              rowsperpageval=10;
          }
          if(typeof nextPageValue== 'undefined' || nextPageValue == ''){
              //console.log("nextpageval if triggerd..&&&&&&"+rowsperpageval+"numberofrecords"+numberofrecords);
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
              console.log("next entered..........");
              limitStartVal=nextPageValue-records_to_subtract;
              //console.log("STEP-3");        
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
              //console.log("previous entered.........."+nextPageValue);
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
          
        if ((req.query && typeof siteid === 'undefined'  && typeof customerid === 'undefined' && typeof todate === 'undefined' && typeof fromdate === 'undefined') || (siteid === ''    && customerid === '' && fromdate === '' && todate === '')){
                
                 sql = "SELECT * FROM rawdata ORDER BY Siteid ASC, RecordingTimeStamp DESC";
              }else{
                 
                
              var query = "";
              if(siteid != "" && typeof siteid != 'undefined'){
                var splitData=siteid.toString().split(",");
                var finalsiteid="";
                for(var i=0;i<splitData.length;i++)
                {
                  finalsiteid=finalsiteid+"'"+splitData[i]+"',";
                }
                siteid = finalsiteid.substr(0,finalsiteid.length-1);
                query = query + " AND rawdata.Siteid IN("+siteid+")";
              }  

              if(fromdate != ""){
                  query = query + " AND rawdata.RecordingTimeStamp>='"+fromdate+" 00:00:00'";
              }  

              if(todate != ""){
                  query = query + " AND rawdata.RecordingTimeStamp<='"+todate+" 23:59:59'";
              }

              if(customerid != "" && typeof customerid != 'undefined') {
                 query = query+ " AND tbl_site.customer_id = '"+ customerid +"'";
              }

              sql= sql =  "SELECT rawdata.* FROM rawdata,tbl_site WHERE rawdata.Siteid=tbl_site.site_code " + query + " ORDER BY Siteid ASC, RecordingTimeStamp DESC"+" limit "+limitStartVal+","+numberofrecords+"";
         }
      console.log("rawdata Triggered"+sql);
      //consol.log("sms"+sms+"video_status"+video);
      getSQLData(sql, function(dbresultsets){
              outageDatas= dbresultsets;
              resultslength=outageDatas.length;
              if(outageDatas.length==undefined){
                outageDatas=[];
              }
              if(outageDatas.length<=(numberofrecords-1))
                {
                  
                  var pagesCount=Math.ceil(outageDatas.length/rowsperpageval,0);
                  console.log("pagesCount"+pagesCount+"startPosition"+startPosition);
                  endPosition=startPosition+(pagesCount-1);
                  lastRecordPosition=endPosition;
                  nextbuttonstatus=0;
                  //console.log("endPosition......"+endPosition);
                }
                if(outageDatas.length>(numberofrecords-1)){
                  console.log("outageDataslength"+outageDatas.length);
                  nextbuttonstatus=1;
                  outageDatas.pop();
                  //console.log("outageDataslength"+outageDatas.length);
                }
                console.log("currentposition................."+startPosition+"endposition"+endPosition+"nextbuttonstatus"+nextbuttonstatus);
                res.send({datas:outageDatas,dataslength:resultslength,custid:customerid,
                    nextpagevalue:nextval,
                    currentposition:startPosition,
                    endposition:endPosition,
                    lastposition:lastRecordPosition,
                    nextbuttonstatus:nextbuttonstatus,
                    siteid:siteid,
                    fromdate:fromdate,
                    todate:todate,
                    sqlquery:sql,
                    nextpagevalue:nextval
                  
                });
          });
});    

function getSQLData(sqls, cb) { 
    //console.log("sqls :"+sqls);
    var resultsets;
    connection.query(sqls, function(err, res1){
      if(res1.length >0){
        resultsets=res1;
      }else{
        resultsets={};
      }
      cb(resultsets); //callback if all queries are processed
    });
  };


return router;
}