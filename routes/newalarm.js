var express = require('express');
var router = express.Router();
var moment = require('moment');
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


module.exports = function(passport,connection) {
  /* GET geography listing. */
  router.get('/', isAuthenticated, function(req, res){
      console.log("Active Alarm Index Triggered");
      var suname =req.session.uname;
      var suid =req.session.uid;
      var srid=req.session.rid;
        res.render('newactive/index',{title:"AlarmLists", sess_name: suname, sess_id: srid, minRange: minRange, maxRange: maxRange, stepRange: stepRange});
  });

  router.post('/searchURL', function(req, res){
      console.log("get url triggered");
      /*var suname =req.session.uname;
      var suid =req.session.uid;
      var srid=req.session.rid;
      var siteid = req.query.siteid;
      console.log("siteid"+siteid);
     // var id = req.body.sno;
      sqls = "select IP from rawdata where siteid='"+siteid+"'";
      getSQLData(sqls, function(dbresultsets){
          console.log("get ack sql"+sqls)
          if(dbresultsets.length >0){
            resultsets=dbresultsets;
          }else{
            resultsets={};
          }
          res.send(resultsets);
      });*/
      res.send("Success");
  });

  router.post('/getvideo', function(req, res){
    res.send("Video");
  });
  

  /*router.post('/getdata', function(req, res){
          console.log("Active Alarm getdata Triggered");
          var suname =req.session.uname;
          var suid =req.session.uid;
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
          if(srid==1 || srid==2 || srid==3 || srid==4){

              if(typeof customerid === undefined || customerid === ''){
                sql="SELECT SUBQ.*, tbl_user.user_name"+ 
                  " FROM ( SELECT a.* , b.site_name,c.customer_name,c.customer_id,b.site_address, b.site_videolink,"+
                  " tbl_alarmpin.alarmpin_name, tbl_alarmpin.alarmpin_priority, tbl_alarmpin.alarmpin_tt " +
                  " FROM alarmdata a,tbl_site b,tbl_customer c,tbl_alarmpin WHERE a.Siteid = b.site_code"+
                  " AND b.customer_id=c.customer_id AND a.alarmpin = tbl_alarmpin.pin_id"+
                  " AND a.Closetime is null ORDER BY a.Opentime DESC)SUBQ"+ 
                  " LEFT JOIN tbl_user ON SUBQ.ackby=tbl_user.user_id "+"limit "+limitStartVal+","+numberofrecords+""; 
              }
              else if(typeof customerid !== undefined || customerid != ''){
                sql="SELECT SUBQ.*, tbl_user.user_name FROM (SELECT alarmdata.*, tbl_alarmpin.alarmpin_priority, tbl_alarmpin.alarmpin_name, tbl_alarmpin.alarmpin_tt,tbl_site.site_name,tbl_site.site_address,tbl_customer.customer_name,tbl_customer.customer_id "+ 
                  " FROM tbl_alarmpin,tbl_site, tbl_customer,alarmdata WHERE alarmdata.Siteid = tbl_site.site_code AND tbl_site.customer_id = tbl_alarmpin.customer_id "+
                  " AND tbl_site.customer_id = tbl_customer.customer_id AND tbl_customer.customer_id='"+customerid+"' and alarmdata.alarmpin = tbl_alarmpin.pin_id AND alarmdata.Closetime is null ORDER BY alarmdata.Opentime DESC)SUBQ "+ 
                  " LEFT JOIN tbl_user ON SUBQ.ackby=tbl_user.user_id "+"limit "+limitStartVal+","+numberofrecords+"";
              }
          }else{
              sql="SELECT SUBQ.*, tbl_user.user_name FROM (SELECT alarmdata.*, tbl_alarmpin.alarmpin_name, tbl_alarmpin.alarmpin_priority,tbl_alarmpin.alarmpin_tt,tbl_site.site_name,tbl_site.site_address,tbl_customer.customer_name,tbl_customer.customer_id "+ 
                  " FROM tbl_alarmpin,tbl_site, tbl_customer,alarmdata WHERE alarmdata.Siteid = tbl_site.site_code AND tbl_site.customer_id = tbl_alarmpin.customer_id "+
                  " AND tbl_site.customer_id = tbl_customer.customer_id AND tbl_customer.customer_id='"+cid+"' and alarmdata.alarmpin = tbl_alarmpin.pin_id AND alarmdata.Closetime is null ORDER BY alarmdata.Opentime DESC)SUBQ "+ 
                  " LEFT JOIN tbl_user ON SUBQ.ackby=tbl_user.user_id "+"limit "+limitStartVal+","+numberofrecords+"";
          }*/


          /*if(srid==1 || srid==2 || srid==3 || srid==4){
              if(typeof customerid === undefined || customerid === ''){
                sql = "SELECT a.pin_id, a.alarmpin_name, a.alarmpin_priority, a.alarmpin_tt, c.customer_name, c.customer_id, d.site_name,d.site_address, d.site_videolink, tbl_user.user_name, b.*"+ 
                      " FROM tbl_alarmpin a, tbl_customer c, tbl_site d, alarmdata b"+
                      " LEFT JOIN tbl_user ON b.ackby = tbl_user.user_id"+
                      " WHERE a.pin_id = b.alarmpin AND c.customer_id = a.customer_id"+
                      " AND c.customer_id = d.customer_id AND d.site_code = b.Siteid "+
                      " AND a.alarmpin_status =  '0'"+query+" ORDER BY b.Opentime DESC "+"limit "+limitStartVal+","+numberofrecords+""; 
              }else if(typeof customerid !== undefined || customerid != ''){
                sql = "SELECT a.pin_id, a.alarmpin_name, a.alarmpin_priority, a.alarmpin_tt, c.customer_name, c.customer_id, d.site_name,d.site_address, d.site_videolink, tbl_user.user_name, b.*"+ 
                      " FROM tbl_alarmpin a, tbl_customer c, tbl_site d, alarmdata b"+
                      " LEFT JOIN tbl_user ON b.ackby = tbl_user.user_id"+
                      " WHERE a.pin_id = b.alarmpin AND c.customer_id = a.customer_id"+
                      " AND c.customer_id = d.customer_id AND d.site_code = b.Siteid AND a.customer_id = '"+customerid+"' "+
                      " AND a.alarmpin_status =  '0'"+query+" ORDER BY b.Opentime DESC "+"limit "+limitStartVal+","+numberofrecords+""; 
              }
          }else{
              sql = "SELECT a.pin_id, a.alarmpin_name, a.alarmpin_priority, a.alarmpin_tt, c.customer_name, c.customer_id, d.site_name,d.site_address, d.site_videolink, tbl_user.user_name, b.*"+ 
                      " FROM tbl_alarmpin a, tbl_customer c, tbl_site d, alarmdata b"+
                      " LEFT JOIN tbl_user ON b.ackby = tbl_user.user_id"+
                      " WHERE a.pin_id = b.alarmpin AND c.customer_id = a.customer_id"+
                      " AND c.customer_id = d.customer_id AND d.site_code = b.Siteid AND a.customer_id = '"+cid+"' "+
                      " AND a.alarmpin_status =  '0'"+query+" ORDER BY b.Opentime DESC "+"limit "+limitStartVal+","+numberofrecords+""; 
              
          }
      
      
      console.log("AlarmList Triggered::::::::"+sql);
      //consol.log("sms"+sms+"video_status"+video);
      getSQLData(sql, function(dbresultsets){
             // console.log("getdata sql"+sql);
              outageDatas= dbresultsets;
              resultslength=outageDatas.length;
              console.log("REcord Length :"+resultslength);
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
                  console.log("endPosition......"+endPosition);
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
                    sms:sms,
                    video:video,
                    nextpagevalue:nextval
                  
                });
          });
});*/ 
router.post('/getdata', isAuthenticated, function(req, res){
          console.log("Active Alarm getdata Triggered");
          var suname =req.session.uname;
          var suid =req.session.uid;
          var srid=req.session.rid;
          var cid=req.session.cid;
          var sms=req.session.smsstatus;
          var video=req.session.videostatus;
          var customerid=req.body.custid;
          console.log("sms"+sms+"video_status"+video);
          //for pegination
          var numberofrecords=100;
          //var records_to_subtract;
          var nextPageValue=req.body.nextval;
          console.log("nextPageValue.............."+nextPageValue);
          var statusValue=req.body.statusvalue;
          var rowsperpageval=req.body.rowsperpageval;
          var limitStartVal;
          var startPosition=1;
          var endPosition;
          var lastRecordPosition;
          var nextval;
          var nextbuttonstatus=1;
          if(req.body.statusvalue==2 && typeof req.body.statusvalue!='undefined'){
              console.log("nextpageval if triggerd........"+rowsperpageval+"numberofrecords"+numberofrecords);
              nextPageValue=numberofrecords*(rowsperpageval/10);
          }
          if(typeof rowsperpageval == 'undefined'){
              rowsperpageval=10;
          }
          if(typeof nextPageValue== 'undefined' || nextPageValue == ''){
              console.log("nextpageval if triggerd..&&&&&&"+rowsperpageval+"numberofrecords"+numberofrecords);
              limitStartVal=0;
              nextPageValue=numberofrecords*(rowsperpageval/10);
              statusValue=0;
          }
          numberofrecords=numberofrecords*(rowsperpageval/10);
          records_to_subtract=numberofrecords;
          numberofrecords+=1;
          console.log("numberofrecords"+numberofrecords);
          console.log("STEP-2 :"+nextPageValue+" Status:"+statusValue);
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
              console.log("previous entered.........."+nextPageValue);
              limitStartVal=nextPageValue-((numberofrecords-1)*2);
              console.log("limitStartVal in previous"+limitStartVal);
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
          
          if(srid==1 || srid==2 || srid==3 || srid==4){
              if(typeof customerid === undefined || customerid === ''){
                var sql="SELECT SUBQ.*, tbl_user.user_name, tbl_alarmpin.alarmpin_name, tbl_alarmpin.alarmpin_priority, tbl_alarmpin.alarmpin_tt "+ 
                  " FROM tbl_alarmpin, ( SELECT a. * , b.site_name,c.customer_name,c.customer_id,b.site_address, b.site_videolink FROM alarmdata a,tbl_site b,tbl_customer c WHERE a.Siteid = b.site_code AND b.customer_id=c.customer_id AND a.Closetime is null  ORDER BY a.Opentime DESC)SUBQ "+ 
                  " LEFT JOIN tbl_user ON SUBQ.ackby=tbl_user.user_id "+"WHERE SUBQ.alarmpin = tbl_alarmpin.alarmpin_id limit "+limitStartVal+","+numberofrecords+""; 
              }
              else if(typeof customerid !== undefined || customerid != ''){
                var sql="SELECT SUBQ.*, tbl_user.user_name FROM (SELECT alarmdata.*, tbl_alarmpin.alarmpin_priority, tbl_alarmpin.alarmpin_name, tbl_alarmpin.alarmpin_tt,tbl_site.site_name,tbl_site.site_address,tbl_customer.customer_name,tbl_customer.customer_id "+ 
                  " FROM tbl_alarmpin,tbl_site, tbl_customer,alarmdata WHERE alarmdata.Siteid = tbl_site.site_code AND tbl_site.customer_id = tbl_alarmpin.customer_id "+
                  " AND tbl_site.customer_id = tbl_customer.customer_id AND tbl_customer.customer_id='"+customerid+"' and alarmdata.alarmpin = tbl_alarmpin.pin_id AND alarmdata.Closetime is null  ORDER BY alarmdata.Opentime DESC)SUBQ "+ 
                  " LEFT JOIN tbl_user ON SUBQ.ackby=tbl_user.user_id "+"limit "+limitStartVal+","+numberofrecords+"";
              }
          }else{
              var sql="SELECT SUBQ.*, tbl_user.user_name FROM (SELECT alarmdata.*, tbl_alarmpin.alarmpin_name, tbl_alarmpin.alarmpin_priority,tbl_alarmpin.alarmpin_tt,tbl_site.site_name,tbl_site.site_address,tbl_customer.customer_name,tbl_customer.customer_id "+ 
                  " FROM tbl_alarmpin,tbl_site, tbl_customer,alarmdata WHERE alarmdata.Siteid = tbl_site.site_code AND tbl_site.customer_id = tbl_alarmpin.customer_id "+
                  " AND tbl_site.customer_id = tbl_customer.customer_id AND tbl_customer.customer_id='"+cid+"' and alarmdata.alarmpin = tbl_alarmpin.pin_id AND alarmdata.Closetime is null  ORDER BY alarmdata.Opentime DESC)SUBQ "+ 
                  " LEFT JOIN tbl_user ON SUBQ.ackby=tbl_user.user_id "+"limit "+limitStartVal+","+numberofrecords+"";
          }
      
      
      //console.log("AlarmList Triggered"+sql);
      //consol.log("sms"+sms+"video_status"+video);
      getSQLData(sql, function(dbresultsets){
             // console.log("getdata sql"+sql);
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
                  console.log("endPosition......"+endPosition);
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
                    sms:sms,
                    video:video,
                    nextpagevalue:nextval
                  
                });
          });
}); 
  router.post('/get-compliant', isAuthenticated, function(req, res){
      var suname =req.session.uname;
      var suid =req.session.uid;
      var srid=req.session.rid;
      var siteid = req.body.siteid;
      var id = req.body.sno;
      sqls = "SELECT SUBQ.*, tbl_compliant_child.no_attempt, tbl_compliant_child.call_status_id "+
              "FROM (SELECT a.* FROM tbl_compliant a, tbl_site b "+
              "WHERE a.site_id = b.site_id and b.site_code='"+siteid+"')SUBQ "+
              "LEFT JOIN tbl_compliant_child ON SUBQ.compliant_id = tbl_compliant_child.compliant_id";
      getSQLData(sqls, function(resultsets){
           results = resultsets;
           res.send({custdata:results});
      })
  });    

  router.post('/getTT', isAuthenticated, function(req, res){
      console.log("getTT Triggered");
      var suname =req.session.uname;
      var suid =req.session.uid;
      var srid=req.session.rid;
      var siteid = req.body.siteid;
      var alarmid = req.body.sno;
      sqls = "select a.ticket_id,b.id,a.ticket_desc,a.ticket_state,b.ticket_remark FROM tbl_tt_master a,tbl_tt_child b WHERE a.ticket_id=b.ticket_id and a.alarmid='"+alarmid+"' and a.site_id='"+siteid+"'";
      //console.log('getTT-POST :'+sqls);
      getSQLData(sqls, function(resultsets){
        console.log("getTT"+sqls);
           results = resultsets;
           res.send({custdata:results});
      })

  }); 
  router.post('/get-ack', isAuthenticated, function(req, res){
      var suname =req.session.uname;
      var suid =req.session.uid;
      var srid=req.session.rid;
      var siteid = req.body.siteid;
      var id = req.body.sno;
      var now = moment().format("YYYY-MM-DD HH:mm:ss");
      sqls = "SELECT a.acktime,a.ackby,b.user_name FROM alarmdata a,tbl_user b "+
             "WHERE a.ackby = b.user_id and a.siteid='"+siteid+"' and a.id='"+id+"' "+
             "and a.ackflag='1'";
      connection.query(sqls, function(err, result){
        console.log("get ack sql"+sqls)
            if (err) {
              throw err;
            }  
            if(result.length >0){
              resultsets=result;
            }else{
              resultsets={};
            }
            res.send(resultsets);
      });
     
  });  
router.post('/update-ack', isAuthenticated, function(req, res){
      var suname =req.session.uname;
      var suid =req.session.uid;
      var srid=req.session.rid;
      var siteid = req.body.siteid;
      var id = req.body.sno;
      var msg="Error";
      var now = moment().format("YYYY-MM-DD HH:mm:ss");
      sqls = "update alarmdata set ackby='"+suid+"', ackflag='1', acktime='"+now+"' WHERE Siteid='"+siteid+"' and id='"+id+"' and ackflag='0'";
      console.log("SQL :"+sqls);
      connection.query(sqls, function(err, result){
            if (err) {
              throw err;
            }  

            if(res.changedRows > 0){
               msg = "User Successfully Added";
            }
            res.send(msg);
      });
     
  });  

 router.post('/create-tt', isAuthenticated, function(req, res){
      console.log("Server CreateTT Triggered");
      var suname =req.session.uname;
      var suid =req.session.uid;
      var srid=req.session.rid;
      var alarmid = req.body.sno;
      var siteid = req.body.siteid;
      var alarmtt = req.body.alarmtt;
      var now = moment().format("YYYY-MM-DD HH:mm:ss");
      if(alarmtt == '1'){
          alarmdesc = "";
          sql = "select ticket_id,ticket_desc,ticket_state FROM tbl_tt_master WHERE alarmid='"+alarmid+"' and site_id='"+siteid+"'";
          connection.query(sql, function(err, res1){
              if(res1.length <= 0){
                sqls="insert into tbl_tt_master (alarmid, site_id,ticket_desc,reported_by,ticket_state,ticket_priority,created_date,closed_date) "+
                   " values ('"+alarmid+"','"+siteid+"','"+alarmdesc+"','"+suid+"','New','Normal','"+now+"','"+now+"')";
                  connection.query(sqls, function(err,resultsets){
                        newticketid= resultsets.insertId;
                        sqls="insert into tbl_tt_child (ticket_id, ticket_remark,recorded_date) "+
                                " values ('"+newticketid+"','"+alarmdesc+"','"+now+"')";
                        connection.query(sqls, function(err,resultsets){
                         // res.redirect('getTT');
          res.send('Success');
                        });
                  });         
              }else{
                //res.redirect('getTT');
                 res.send('Success');
              }
          });  
      }else{
          var alarmdesc = req.body.tdesc;
          var tid = req.body.tid;
          var tp = req.body.tpriority;
          sqls="insert into tbl_tt_master (alarmid,site_id,ticket_desc,reported_by,ticket_state,ticket_priority,created_date) "+
               " values ('"+alarmid+"','"+siteid+"','"+alarmdesc+"','"+suid+"','New','"+tp+"','"+now+"')";
          connection.query(sqls, function(err,resultsets){
              newticketid= resultsets.insertId;
              sqls="insert into tbl_tt_child (ticket_id, ticket_remark,recorded_date) "+
                        " values ('"+newticketid+"','"+alarmdesc+"','"+now+"')";
              connection.query(sqls, function(err,resultsets){
                res.send("success");
              });  
          });      
      }
  });
router.post('/update-call-status', isAuthenticated, function(req, res){
      //console.log("update call staus triggered");
      var suname =req.session.uname;
      var suid =req.session.uid;
      var srid=req.session.rid;
      var siteid = req.body.siteid;
      var id = req.body.sno;
      var compid = req.body.comp_no;
      var callstatus = req.body.call_status;
      var callcnt = req.body.call_cnt;
      var now = moment().format("YYYY-MM-DD HH:mm:ss");
      //console.log("siteid"+siteid+"id"+id+"compid"+compid+"callstatus"+callstatus+"callcnt"+callcnt+"date"+now);
      
      sql = "select * from tbl_compliant_child where compliant_id='"+compid+"' and site_id='"+siteid+"' and alarm_tbl_id='"+id+"'";
      //console.log("sql1 :"+sql);
      connection.query(sql, function(err, result){
         //console.log("sql"+sql);
          if(result.length >0){
            sqls = "UPDATE tbl_compliant_child SET call_status_id='"+callstatus+"',no_attempt='"+callcnt+"',created_date='"+now+"' WHERE compliant_id='"+compid+"' and site_id='"+siteid+"' and alarm_tbl_id='"+id+"'";
            //console.log("sl"+sqls);
          }else{
            //console.log("eles");
            sqls = "insert into tbl_compliant_child (compliant_id,site_id,alarm_tbl_id,call_status_id,no_attempt,created_date) values "+
               "('"+compid+"','"+siteid+"','"+id+"','"+callstatus+"','"+callcnt+"','"+now+"')";
              //console.log("sl"+sqls);
          }
          connection.query(sqls, function(err, result){
             //console.log("sl"+sqls);
              if (err) {
                throw err;
              }  
              if(result.length >0){
                res.redirect('get-compliant');
              }
          });
      });          
  });  
 router.post('/generate-tt', isAuthenticated, function(req, res){
      var suname =req.session.uname;
      var suid =req.session.uid;
      var srid=req.session.rid;
      sqls = "select count(*) as cnt FROM tbl_tt_master";
      connection.query(sqls, function(err, result){
            if (err) {
              throw err;
            }  
            msg= result;
            msg1 = msg[0].cnt + 1;
            res.send({custdata: msg});
      });
  });  

  router.post('/getcustInfo', isAuthenticated, function(req, res){
     var sql = "SELECT customer_id,customer_name from tbl_customer";
        getSQLData(sql, function(resultsets){
           results = resultsets;
           res.send({custdata:results});
        })
 });

  function getSQLData(sqls, cb) { 
        //console.log("sqls :"+sqls);
        // console.log("eneterd");
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
