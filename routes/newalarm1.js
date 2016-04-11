var express = require('express');
var router = express.Router();
var moment = require('moment');
var connection_pool=require("../config/pool").pool;
var minRange = 10;
var maxRange = 50;
var stepRange = 10;

var isAuthenticated = function (req, res, next) {
  // if user is authenticated in the session, call the next() to call the next request handler 
  // Passport adds this method to request object. A middleware is allowed to add properties to
  // request and response objects
  if (req.isAuthenticated())
    return next();
  // if the user is not authenticated then redirect him to the login page
  res.redirect('/');
}


module.exports = function(passport) {
  /* GET geography listing. */
  router.get('/', isAuthenticated, function(req, res){
      console.log("Active Alarm Index Triggered");
      res.render('newalarm1/index',{title:"AlarmLists", sess_name: req.session.uname, sess_id: req.session.rid, minRange: minRange, maxRange: maxRange, stepRange: stepRange});
  });

  router.post('/searchURL', function(req, res){
      console.log("get url triggered");
      res.send("Success");
  });

  router.post('/getvideo', function(req, res){
      res.send("Video");
  });
  

  router.post('/getdata', function(req, res){
          console.log("Active Alarm getdata Triggered");
          
          var srid=req.session.rid;
          var cid=req.session.cid;
          var sms=req.session.smsstatus;
          var video=req.session.videostatus;
          var customerid=req.body.custid;
          
          //for pegination
          var numberofrecords=100;
          //var records_to_subtract;
          var nextPageValue=req.body.nextval;
          
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
         // console.log("STEP-2 :"+nextPageValue+" Status:"+statusValue);
          if(((typeof nextPageValue!= 'undefined' || nextPageValue != '') && statusValue==0) || ((typeof nextPageValue!= 'undefined' || nextPageValue != '') && statusValue==2)){
              console.log("next entered..........");
              limitStartVal=nextPageValue-records_to_subtract;
              console.log("STEP-3");        
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
          query="";
          if(typeof req.body.siteid != undefined && req.body.siteid != ''){
            query = query + " AND b.Siteid = '"+req.body.siteid+"'";
          }
          if(typeof req.body.pinid != undefined && req.body.pinid != ''){
            query = query + " AND a.pin_id = '"+req.body.pinid+"'";
          }
          
          if(typeof customerid === undefined || customerid === ''){
            sql = "SELECT a.pin_id, a.alarmpin_name, a.alarmpin_priority, b.*"+ 
                      " FROM tbl_alarmpin a, alarmdata b"+
                      " WHERE a.pin_id = b.alarmpin"+
                      " AND a.alarmpin_status='0' AND b.ackby='0' AND a.customer_id='0'"+query+" ORDER BY b.Opentime DESC "+"limit "+limitStartVal+","+numberofrecords+""; 
          }else{
            /*sql = "SELECT a.pin_id, a.alarmpin_name, a.alarmpin_priority, b.*"+ 
                      " FROM tbl_alarmpin a, alarmdata b,tbl_site c"+
                      " WHERE c.customer_id = a.customer_id and a.pin_id = b.alarmpin AND b.Siteid=c.site_code"+
                      " AND a.alarmpin_status='0' AND b.ackby='0' AND c.customer_id='"+customerid+"'"+query+" ORDER BY b.Opentime DESC "+"limit "+limitStartVal+","+numberofrecords+""; */
            sql = "SELECT a.pin_id, a.customer_id, a.alarmpin_name, a.alarmpin_priority, b.*,c.site_name,c.site_address"+ 
                      " FROM tbl_alarmpin a, alarmdata b,tbl_site c"+
                      " WHERE a.pin_id = b.alarmpin AND c.site_code = b.Siteid AND a.customer_id=c.customer_id"+
                      " AND a.alarmpin_status='0' AND b.ackby='0' AND a.customer_id='"+customerid+"'"+query+" ORDER BY b.Opentime DESC "+"limit "+limitStartVal+","+numberofrecords+"";           
          }
          console.log("AlarmList Triggered::::::::"+sql);
          //consol.log("sms"+sms+"video_status"+video);

          connection_pool.getConnection(function(err, connection) {
              connection.query(sql, function(err, res1){
                dbresultsets=res1;
                // console.log("getdata sql"+sql);
                outageDatas= dbresultsets;
                resultslength=outageDatas.length;
                //console.log("REcord Length===================== :"+resultslength);
                if(outageDatas.length==undefined){
                  outageDatas=[];
                }
                if(outageDatas.length<=(numberofrecords-1)){
                    var pagesCount=Math.ceil(outageDatas.length/rowsperpageval,0);
                    //console.log("pagesCount"+pagesCount+"startPosition"+startPosition);
                    endPosition=startPosition+(pagesCount-1);
                    lastRecordPosition=endPosition;
                    nextbuttonstatus=0;
                    //console.log("endPosition......"+endPosition);
                }
                if(outageDatas.length>(numberofrecords-1)){
                    //console.log("outageDataslength"+outageDatas.length);
                    nextbuttonstatus=1;
                    outageDatas.pop();
                    //console.log("outageDataslength"+outageDatas.length);
                }
                //console.log("currentposition................."+startPosition+"endposition"+endPosition+"nextbuttonstatus"+nextbuttonstatus);
                connection.release();
                res.send({datas:outageDatas,dataslength:resultslength,custid:customerid,
                      nextpagevalue:nextval,
                      currentposition:startPosition,
                      endposition:endPosition,
                      lastposition:lastRecordPosition,
                      nextbuttonstatus:nextbuttonstatus,
                      sms:sms,
                      video:video,
                      nextpagevalue:nextval
                });
              });
          });
  });	


  

  
  router.post('/get-ack', isAuthenticated, function(req, res){
      sqls = "SELECT a.acktime,a.ackby,b.user_name FROM alarmdata a,tbl_user b "+
             "WHERE a.ackby = b.user_id and a.siteid='"+req.body.siteid+"' and a.id='"+req.body.sno+"' "+
             "and a.ackflag='1'";
      getSQLData(sqls, function(result){
            console.log("get ack sql"+sqls)
            if(result.length >0){
              resultsets=result;
            }else{
              resultsets={};
            }
            res.send(resultsets);
      });
     
  });  
  
  router.post('/update-ack', isAuthenticated, function(req, res){
      msg="Error";
      now = moment().format("YYYY-MM-DD HH:mm:ss");
      sqls = "update alarmdata set ackby='"+req.session.uid+"', ackflag='1', acktime='"+now+"' WHERE Siteid='"+req.body.siteid+"' and id='"+req.body.sno+"' and ackflag='0'";
      console.log("SQL :"+sqls);
      getSQLData(sqls, function(result){
          msg = "User Successfully Added";
          res.send(msg);
      });
     
  });  

 
   

  router.post('/getcustInfo', isAuthenticated, function(req, res){
        sql = "SELECT customer_id,customer_name from tbl_customer";
        getSQLData(sql, function(resultsets){
           results = resultsets;
           res.send({custdata:results});
        })
 });

  router.post('/getIP', isAuthenticated, function(req, res){
        sql = "SELECT IP from lastknown WHERE Siteid='"+req.body.siteid+"' limit 1";
        console.log("IPSQL :"+sql);
        getSQLData(sql, function(resultsets){
           results = resultsets;
           console.log("REsult :"+results);
           res.send(results);
        })
 });

  router.post('/getSiteInfo', function(req, res){
      
      sql = "select b.customer_id,b.customer_name,a.site_code,a.site_name,a.site_address from tbl_site a,tbl_customer b where a.customer_id=b.customer_id and a.site_status='0'";
      //console.log("sql1 :"+sql);
      getSQLData(sql,function(resultsets){
           results = resultsets;
           res.send(results);
      });  
  });  
  
  function getSQLData(sqls, cb) { 
        //console.log("SQL :"+sqls);
        connection_pool.getConnection(function(err, connection) {
          connection.query(sqls, function(err, res1){
            if(res1.length >0){
              resultsets=res1;
            }else{
              resultsets={};
            }
            connection.release();
            cb(resultsets); //callback if all queries are processed
          });
        });  
  };
  return router;
}