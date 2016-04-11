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
      console.log(" Alarmlist Triggered");
      res.render('alarmlist/index',{title:"AlarmLists", sess_name: req.session.uname, sess_id: req.session.rid, minRange: 10, maxRange: 50, stepRange: 10});
  });

  router.post('/getdata', isAuthenticated, function(req, res){
      console.log("alarmlist getdata Triggered :");
      var suname =req.session.uname;
      var suid =req.session.uid;
      var srid=req.session.rid;
      var cid=req.session.cid;
      var pinresults;
      var siteid = req.body.siteid;
      console.log("siteid=="+siteid);

          var fromdate = moment(req.body.fromdate).format('YYYY-MM-DD');
          console.log("fromdate=="+fromdate);
         
          var todate= moment(req.body.todate).format('YYYY-MM-DD');
          console.log("todate=="+todate);
          
          var pin_id=req.body.pin_id;
          console.log("pinid=="+pin_id);

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
          
         if ((req.query && typeof siteid === 'undefined' && typeof pin_id === 'undefined' && typeof customerid === 'undefined' && typeof todate === 'undefined' && typeof fromdate === 'undefined') || (siteid === ''  && pin_id === ''  && customerid === '' && fromdate === '' && todate === '')){
                
                 sql =  "SELECT alarmdata.Siteid, tbl_site.site_name, tbl_site.site_address,alarmdata.Opentime,alarmdata.Closetime,tbl_alarmpin.alarmpin_name, tbl_user.user_name, alarmdata.acktime,(SELECT TIMEDIFF(alarmdata.Closetime,alarmdata.Opentime)) as duration "+
                         " FROM tbl_alarmpin,alarmdata  "+
                         "LEFT JOIN tbl_site  ON alarmdata.siteid = tbl_site.site_code "+
                         "LEFT JOIN tbl_user  ON alarmdata.ackby = tbl_user.user_id "+
                         "WHERE alarmdata.Alarmpin=tbl_alarmpin.pin_id " +
                         "ORDER BY alarmdata.Opentime DESC ";
              }else{
                 
                 var query = "";
                  if(siteid != "" && typeof siteid != 'undefined'){
                    query = query + " AND a.Siteid='"+siteid+"'";
                  }  

                  if(pin_id != "" && typeof pin_id != 'undefined'){
                    query = query + " AND c.pin_id='"+pin_id+"'";
                  }
                  if(fromdate != "" && typeof fromdate!='undefined' ){
                      //query = query + " AND date_format(a.Opentime,'%Y-%m-%d')>='"+fromdate+"'";
                      query=query+" And a.Opentime>='"+fromdate+" 00:00:00'";
                  }  

                  if(todate != "" && typeof todate!='undefined'){
                    //query = query + " AND date_format(a.Closetime,'%Y-%m-%d')<='"+todate+"'";
                    query=query+" And a.Closetime<='"+todate+" 23:59:59'";
                  } 

                  if(customerid != "" && typeof customerid !='undefined'){
                      query = query + " AND b.customer_id='"+customerid+"'";
                  }

               /*  sql =  "SELECT a.Siteid, b.site_name, b.site_address,a.Opentime,a.Closetime,d.alarmpin_name, c.user_name, a.acktime  "+
                         " FROM tbl_alarmpin d,tbl_site b,alarmdata a "+
                         " LEFT JOIN tbl_user c ON a.ackby = c.user_id "+
                         " WHERE a.siteid = b.site_code "+
                         " AND a.Alarmpin=d.pin_id "+
                         " AND d.customer_id=b.customer_id " +query+
                         " ORDER BY a.Opentime DESC "+" limit "+limitStartVal+","+numberofrecords+"";*/
                
                    sql="SELECT a.Alarmpin,a.Siteid, a.Opentime,a.Closetime, a.acktime,a.ackby,b.site_name, b.site_address ,c.alarmpin_name ,c.alarmpin_id,d.user_name "+
                        " FROM tbl_site b ,tbl_alarmpin c,alarmdata a "+
                        " LEFT JOIN tbl_user d ON d.user_id=a.ackby "+
                        " WHERE a.Siteid = b.site_code AND c.pin_id=a.Alarmpin "+query+
                        "  AND b.customer_id=c.customer_id  ORDER BY a.Opentime DESC "+" limit "+limitStartVal+","+numberofrecords+"";
              }
      console.log("AlarmList Triggered"+sql);
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
                    pin_id:pin_id,
                    pinresults:pinresults,
                    todate:todate,
                    nextpagevalue:nextval
                  
                });
          });
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
