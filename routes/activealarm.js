var express = require('express');
var router = express.Router();
var moment = require('moment');


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
      //console.log("New Active Alarm Index Triggered");
      res.render('activealarm/index',{title:"AlarmLists", sess_name: req.session.uname, sess_id: req.session.rid, minRange: 10, maxRange: 50, stepRange: 5});
  });

  router.post('/searchURL', isAuthenticated, function(req, res){
      console.log("get url triggered");
      /*
      sqls = "select IP from rawdata where siteid='"+req.query.siteid+"'";
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

  router.post('/getvideo', isAuthenticated, function(req, res){
    res.send("Video");
  });
  

  router.post('/getdata', function(req, res){
          console.log("Active Alarm getdata Triggered");
          
          var objData = {
            cid: req.session.cid,
            sms: req.session.smsstatus,
            video: req.session.videostatus,
            customerid: req.body.custid
          }

          var pageData = {
            numberofrecords: 100,
            nextPageValue: req.body.nextval,
            statusValue: req.body.statusvalue,
            rowsperpageval: req.body.rowsperpageval,
            limitStartVal:'',
            startPosition: 1,
            endPosition:'',
            lastRecordPosition: '',
            nextbuttonstatus:1,
            nextval: ''
          }
          
          if(pageData.statusvalue==2 && typeof pageData.statusvalue!='undefined'){
              //console.log("nextpageval if triggerd........"+pageData.rowsperpageval+"numberofrecords"+pageData.numberofrecords);
              pageData.nextPageValue=pageData.numberofrecords*(pageData.rowsperpageval/10);
          }
          if(typeof pageData.rowsperpageval == 'undefined'){
              pageData.rowsperpageval=10;
          }
          if(typeof pageData.nextPageValue== 'undefined' || pageData.nextPageValue == ''){
              //console.log("nextpageval if triggerd..&&&&&&"+rowsperpageval+"numberofrecords"+numberofrecords);
              pageData.limitStartVal=0;
              pageData.nextPageValue=pageData.numberofrecords*(pageData.rowsperpageval/10);
              pageData.statusValue=0;
          }
          pageData.numberofrecords = pageData.numberofrecords*(pageData.rowsperpageval/10);
          records_to_subtract= pageData.numberofrecords;
          pageData.numberofrecords+=1;
        
          if(((typeof pageData.nextPageValue!= 'undefined' || pageData.nextPageValue != '') && pageData.statusValue==0) || ((typeof pageData.nextPageValue!= 'undefined' || pageData.nextPageValue != '') && pageData.statusValue==2)){
              //console.log("next entered..........");
              pageData.limitStartVal= pageData.nextPageValue - records_to_subtract;
              //console.log("STEP-3");        
              pageData.nextval= pageData.nextPageValue;
              pageData.startPosition=pageData.nextPageValue-(pageData.numberofrecords-1);
              pageData.startPosition=pageData.startPosition/pageData.rowsperpageval;
              pageData.startPosition+=1;
              if(pageData.startPosition==0){
                pageData.startPosition=1;
              }
              pageData.endPosition=pageData.nextPageValue/pageData.rowsperpageval;
              pageData.lastRecordPosition=pageData.endPosition+1;
          }
          if(typeof pageData.nextPageValue!= 'undefined' && pageData.statusValue==1){
              //console.log("STEP-5***********");
              //console.log("previous entered.........."+nextPageValue);
              pageData.limitStartVal=pageData.nextPageValue-((pageData.numberofrecords-1)*2);
              //console.log("limitStartVal in previous"+limitStartVal);
              if(pageData.limitStartVal<0){
                pageData.limitStartVal=0;
              }
              pageData.startPosition=pageData.nextPageValue-((pageData.numberofrecords-1)*2);
              pageData.startPosition=pageData.startPosition/pageData.rowsperpageval;
              pageData.startPosition+=1;
              if(pageData.startPosition==0){
                pageData.startPosition=1;
              }
              pageData.nextval=pageData.nextPageValue-(pageData.numberofrecords-1);
              pageData.endPosition=(pageData.nextval)/pageData.rowsperpageval;
              pageData.lastRecordPosition=pageData.endPosition+1;
          }
          
          //console.log("Role ID :"+srid);
          if(req.session.rid == 1 || req.session.rid == 2){
              if(objData.customerid==undefined || objData.customerid==''){
                sql="SELECT SUBQ.*, tbl_user.user_name, tbl_alarmpin.alarmpin_name,tbl_alarmpin.alarmpin_priority,tbl_alarmpin.alarmpin_tt "+ 
                  " FROM  tbl_alarmpin, ( SELECT a. * , b.site_name,c.customer_name,c.customer_id,b.site_address, b.site_videolink FROM alarmdata a,tbl_site b,tbl_customer c WHERE a.Siteid = b.site_code AND b.customer_id=c.customer_id ORDER BY a.Opentime DESC)SUBQ "+ 
                  " LEFT JOIN tbl_user ON SUBQ.ackby=tbl_user.user_id "+"WHERE SUBQ.alarmpin = tbl_alarmpin.alarmpin_id limit "+pageData.limitStartVal+","+pageData.numberofrecords+""; 
              }
              else if(objData.customerid!=undefined || objData.customerid!=''){
                sql="SELECT SUBQ.*, tbl_user.user_name, tbl_alarmpin.alarmpin_name,tbl_alarmpin.alarmpin_priority, tbl_alarmpin.alarmpin_tt "+ 
                  " FROM tbl_alarmpin,(SELECT a. * , b.site_name,c.customer_name,c.customer_id, b.site_address, b.site_videolink FROM alarmdata a,tbl_site b,tbl_customer c WHERE a.Siteid = b.site_code AND b.customer_id=c.customer_id  ORDER BY a.Opentime DESC)SUBQ "+ 
                  " LEFT JOIN tbl_user ON SUBQ.ackby=tbl_user.user_id "+"WHERE SUBQ.alarmpin = tbl_alarmpin.alarmpin_id AND SUBQ.alarmpin = tbl_alarmpin.alarmpin_id AND SUBQ.customer_id='"+objData.customerid+"'"+" limit "+pageData.limitStartVal+","+pageData.numberofrecords+"";
              }
          }else{
                sql="SELECT SUBQ.*, tbl_user.user_name, tbl_alarmpin.alarmpin_name,tbl_alarmpin.alarmpin_priority, tbl_alarmpin.alarmpin_tt "+ 
                  " FROM tbl_alarmpin, ( SELECT a. * , b.site_name,c.customer_name,c.customer_id,b.site_address, b.site_videolink,d.alarmpin_name,d.alarmpin_priority, d.alarmpin_tt "+
                  " FROM alarmdata a,tbl_site b,tbl_customer c "+
                  " WHERE a.Siteid = b.site_code AND b.customer_id=c.customer_id AND b.customer_id='"+objData.cid+"' ORDER BY a.Opentime DESC)SUBQ "+ 
                  " LEFT JOIN tbl_user ON SUBQ.ackby=tbl_user.user_id "+" WHERE SUBQ.alarmpin = tbl_alarmpin.alarmpin_id limit "+pageData.limitStartVal+","+pageData.numberofrecords+"";
          }
          console.log("getdata sql ============="+sql);
          getSQLData(sql, function(dbresultsets){
            
            outageDatas= dbresultsets;
            var resultslength=outageDatas.length;
            if(outageDatas.length==undefined){
              outageDatas=[];
            }else if(outageDatas.length<=(pageData.numberofrecords-1)){
              pagesCount=Math.ceil(outageDatas.length/pageData.rowsperpageval,0);
              //console.log("pagesCount"+pagesCount+"startPosition"+startPosition);
              pageData.endPosition=pageData.startPosition+(pagesCount-1);
              pageData.lastRecordPosition=pageData.endPosition;
              pageData.nextbuttonstatus=0;
              //console.log("endPosition......"+endPosition);
            }else if(outageDatas.length>(pageData.numberofrecords-1)){
              console.log("outageDataslength"+outageDatas.length);
              pageData.nextbuttonstatus=1;
              outageDatas.pop();
              //console.log("outageDataslength"+outageDatas.length);
            }
            //console.log("currentposition................."+startPosition+"endposition"+endPosition+"nextbuttonstatus"+nextbuttonstatus);
            res.send({datas:outageDatas,
                dataslength:resultslength,
                custid:objData.customerid,
                nextpagevalue:pageData.nextval,
                currentposition:pageData.startPosition,
                endposition:pageData.endPosition,
                lastposition:pageData.lastRecordPosition,
                nextbuttonstatus:pageData.nextbuttonstatus,
                sms:objData.sms,
                video:objData.video,
                nextpagevalue:pageData.nextval
            });
        });
  });	



  router.post('/get-compliant', isAuthenticated, function(req, res){
      id = req.body.sno;
      sqls = "SELECT SUBQ.*, tbl_compliant_child.no_attempt, tbl_compliant_child.call_status_id "+
              "FROM (SELECT a.* FROM tbl_compliant a, tbl_site b "+
              "WHERE a.site_id = b.site_id and b.site_code='"+req.body.siteid+"')SUBQ "+
              "LEFT JOIN tbl_compliant_child ON SUBQ.compliant_id = tbl_compliant_child.compliant_id";
      getSQLData(sqls, function(resultsets){
           results = resultsets;
           res.send({custdata:results});
      })
  });    

  router.post('/getTT', isAuthenticated, function(req, res){
      console.log("getTT Triggered");
      sqls = "select a.ticket_id,b.id,a.ticket_desc,a.ticket_state,b.ticket_remark FROM tbl_tt_master a,tbl_tt_child b WHERE a.ticket_id=b.ticket_id and a.alarmid='"+req.body.sno+"' and a.site_id='"+req.body.siteid+"'";
      //console.log('getTT-POST :'+sqls);
      getSQLData(sqls, function(resultsets){
          results = resultsets;
          res.send({custdata:results});
      })

  }); 
  router.post('/get-ack', isAuthenticated, function(req, res){
      sqls = "SELECT a.acktime,a.ackby,b.user_name FROM alarmdata a,tbl_user b "+
             "WHERE a.ackby = b.user_id and a.siteid='"+req.body.siteid+"' and a.id='"+req.body.sno+"' "+
             "and a.ackflag='1'";
      getSQLData(sqls, function(resultsets){       
          results = resultsets;
          res.send(results);
      });
  });  
  router.post('/update-ack', isAuthenticated, function(req, res){
      msg="Error";
      now = moment().format("YYYY-MM-DD HH:mm:ss");
      sqls = "update alarmdata set ackby='"+req.session.uid+"', ackflag='1', acktime='"+now+"' WHERE Siteid='"+req.body.siteid+"' and id='"+req.body.sno+"' and ackflag='0'";
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
      var now = moment().format("YYYY-MM-DD HH:mm:ss");
      /*if(alarmtt == '1'){
          alarmdesc = "";
          sql = "select ticket_id,ticket_desc,ticket_state FROM tbl_tt_master WHERE alarmid='"+req.body.sno+"' and site_id='"+req.body.siteid+"'";
          connection.query(sql, function(err, res1){
              if(res1.length <= 0){
                  sqls= "insert into tbl_tt_master (alarmid, site_id,ticket_desc,reported_by,ticket_state,ticket_priority,created_date,closed_date) "+
                        " values ('"+req.body.sno+"','"+req.body.siteid+"','"+alarmdesc+"','"+req.session.uid+"','New','Normal','"+now+"','"+now+"')";
                  connection.query(sqls, function(err,resultsets){
                      newticketid= resultsets.insertId;
                      sqls= "insert into tbl_tt_child (ticket_id, ticket_remark,recorded_date) "+
                            " values ('"+newticketid+"','"+alarmdesc+"','"+now+"')";
                      connection.query(sqls, function(err,resultsets){
                          res.send('Success');
                      });
                  });         
              }else{
                res.send('Success');
              }
          });  
      }else{*/
      
        console.log("ticket creation triggered");
          var tid = req.body.tid;
          sqls="insert into tbl_tt_master (alarmid,site_id,ticket_desc,reported_by,ticket_state,ticket_priority,created_date) "+
               " values ('"+req.body.sno+"','"+req.body.siteid+"','"+req.body.tdesc+"','"+req.session.uid+"','New','"+req.body.tpriority+"','"+now+"')";
          connection.query(sqls, function(err,resultsets){
              newticketid= resultsets.insertId;
              sqls="insert into tbl_tt_child (ticket_id, ticket_remark,recorded_date) "+
                        " values ('"+newticketid+"','"+alarmdesc+"','"+now+"')";
              connection.query(sqls, function(err,resultsets){
                res.send("success");
              });  
          });      
     /* }*/
  });

  router.post('/update-call-status', isAuthenticated, function(req, res){
      //console.log("update call staus triggered");
      var objData = {
          suid :req.session.uid,
          srid :req.session.rid,
          siteid : req.body.siteid,
          id : req.body.sno,
          compid : req.body.comp_no,
          callstatus : req.body.call_status,
          callcnt : req.body.call_cnt,
          now : moment().format("YYYY-MM-DD HH:mm:ss")
      }
      //console.log("siteid"+siteid+"id"+id+"compid"+compid+"callstatus"+callstatus+"callcnt"+callcnt+"date"+now);
      sql = "select * from tbl_compliant_child where compliant_id='"+objData.compid+"' and site_id='"+objData.siteid+"' and alarm_tbl_id='"+objData.id+"'";
      connection.query(sql, function(err, result){
          if(result.length >0){
            sqls = "UPDATE tbl_compliant_child SET call_status_id='"+objData.callstatus+"',no_attempt='"+objData.callcnt+"',created_date='"+now+"' WHERE compliant_id='"+objData.compid+"' and site_id='"+objData.siteid+"' and alarm_tbl_id='"+objData.id+"'";
          }else{
            sqls = "insert into tbl_compliant_child (compliant_id,site_id,alarm_tbl_id,call_status_id,no_attempt,created_date) values "+
               "('"+objData.compid+"','"+objData.siteid+"','"+objData.id+"','"+objData.callstatus+"','"+objData.callcnt+"','"+objData.now+"')";
          }
          connection.query(sqls, function(err, result){
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
        sql = "SELECT customer_id,customer_name from tbl_customer";
        getSQLData(sql, function(resultsets){
           results = resultsets;
           res.send({custdata:results});
        })
  });

  function getSQLData(sqls, cb) { 
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
