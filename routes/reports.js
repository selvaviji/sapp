var express = require('express');
var router = express.Router();
var moment = require('moment');
var connection_pool=require("../config/pool").pool;

var minRange=10;
var maxRange=50;
var stepRange=10;
var order_arr=["site_name","Alarmstatus"];
var sort_arr=["ASC","DESC"];

var isAuthenticated = function (req, res, next) {
  // if user is authenticated in the session, call the next() to call the next request handler 
  // Passport adds this method to request object. A middleware is allowed to add properties to
  // request and response objects
  if (req.isAuthenticated())
    return next();
  // if the user is not authenticated then redirect him to the login page
  res.redirect('/');
}


module.exports = function(passport,connection,db1) {
  /*console.log("users triggered");*/
  /* GET users listing. */
 
 //alarmlist new start
  router.get('/alarmlist', isAuthenticated, function(req, res){
      //console.log("alarmlist Triggered");
      res.render('report/alarmlist',{title:"AlarmLists", sess_name:req.session.uname, sess_id: req.session.rid, minRange: minRange, maxRange: maxRange, stepRange: stepRange});
  });


router.post('/getList',function(req, res){
      //console.log("alarm-panel triggered :");
      var customerid="";
      if(req.session.cid != "0"){
        customer_id = req.session.cid;
      }else{
        customer_id = req.body.custid;
      }
      var pin_id=req.body.pin_id;
      var querydata = {
        //url: 'report/alarm-panel',
        custid: req.session.cid,
        pin_id:pin_id,
        siteid : req.body.siteid,
        fromdate: moment(req.body.fromdate).format('YYYY-MM-DD HH:mm:ss'),
        todate : moment(req.body.todate).format('YYYY-MM-DD HH:mm:ss'),
        customer_id: req.body.custid
      }
      
      //console.log("pin**"+pin_id);
      if ((req.body && typeof querydata.siteid === 'undefined' && typeof querydata.customer_id === 'undefined' && typeof querydata.pin_id==='undefined' && typeof querydata.todate === 'undefined' && typeof querydata.fromdate === 'undefined') || (querydata.siteid === '' && querydata.pin_id==='' && querydata.customer_id === '' && querydata.fromdate === '' && querydata.todate === '')){
          sql ="SELECT a.Alarmpin,a.Siteid, a.Opentime,a.Closetime, a.acktime,a.ackby,b.site_name, b.site_address ,c.alarmpin_name ,c.alarmpin_id,d.user_name "+
              " FROM tbl_site b ,tbl_alarmpin c,alarmdata a "+
              " LEFT JOIN tbl_user d ON d.user_id=a.ackby "+
              " WHERE a.Siteid = b.site_code AND c.pin_id=a.Alarmpin "+
              "  AND b.customer_id=c.customer_id  ORDER BY a.Opentime DESC "; 
      }else{
          
          var query = "  AND a.Opentime>='"+querydata.fromdate+"' AND a.Opentime<='"+querydata.todate+"'";
          if(querydata.siteid != "" && typeof querydata.siteid != 'undefined'){
              //spliting siteid's by comma
              var splitData= (querydata.siteid).split(",");
              
              var finalsiteid="";
              for(var i=0;i<splitData.length;i++){
                finalsiteid=finalsiteid+"'"+splitData[i]+"',";
              }
              
              querydata.siteid = finalsiteid.substr(0,finalsiteid.length-1);
              
              query = query + " AND a.Siteid IN ("+querydata.siteid+")";
             
          }  
          
          if(querydata.pin_id != "" && typeof querydata.pin_id != 'undefined'){
            query = query + " AND c.pin_id='"+querydata.pin_id+"'";
          }           
          if(querydata.customer_id != "" && typeof querydata.customer_id != 'undefined' && querydata.customer_id != "0") {
            query = query+ " AND b.customer_id = '"+ querydata.customer_id +"'";
          }
          
          sql="SELECT a.Alarmpin,a.Siteid, a.Opentime,a.Closetime, a.acktime,a.ackby,b.site_name, b.site_address ,c.alarmpin_name ,c.alarmpin_id,d.user_name "+
              " FROM tbl_site b ,tbl_alarmpin c,alarmdata a "+
              " LEFT JOIN tbl_user d ON d.user_id=a.ackby "+
              " WHERE a.Siteid = b.site_code AND c.pin_id=a.Alarmpin "+query+
              "  AND b.customer_id=c.customer_id  ORDER BY a.Opentime DESC ";
              
      }//else end
      handleReport(sql,querydata,req,res);
  });
 //alarmlist new end

//alarm panel new start
router.get('/alarm-panel', isAuthenticated, function(req, res){
      //console.log(" panel Triggered");
      res.render('report/alarm-panel',{title:"AlarmLists", sess_name: req.session.uname, sess_id:req.session.rid, minRange: minRange, maxRange: maxRange, stepRange: stepRange});
  });

//alarm-panel start
router.post('/getPanel',function(req, res){
      //console.log("alarm-panel triggered :");
      var customerid="";
      if(req.session.cid != "0"){
        customer_id = req.session.cid;
      }else{
        customer_id = req.body.custid;
      }
      var pin_id=req.body.pin_id;
      var querydata = {
        //url: 'report/alarm-panel',
        custid: req.session.cid,
        pin_id:pin_id,
        siteid : req.body.siteid,
        fromdate: moment(req.body.fromdate).format('YYYY-MM-DD HH:mm:ss'),
        todate : moment(req.body.todate).format('YYYY-MM-DD HH:mm:ss'),
        customer_id: req.body.custid
      }
      
      console.log("fromdate"+fromdate);
      if ((req.body && typeof querydata.siteid === 'undefined' && typeof querydata.customer_id === 'undefined' && typeof querydata.pin_id==='undefined' && typeof querydata.todate === 'undefined' && typeof querydata.fromdate === 'undefined') || (querydata.siteid === '' && querydata.pin_id==='' && querydata.customer_id === '' && querydata.fromdate === '' && querydata.todate === '')){
          sql = "SELECT  alarmdata.Alarmtype, alarmdata.Alarmstatus, alarmdata.Siteid, tbl_site.site_name,tbl_site.site_address, alarmdata.Opentime, alarmdata.Closetime ,tbl_alarmpin.alarmpin_name "+
                "FROM tbl_alarmpin, alarmdata "+
                "LEFT JOIN tbl_site ON alarmdata.Siteid = tbl_site.site_code "+
                "WHERE alarmdata.Alarmpin = tbl_alarmpin.pin_id  AND tbl_site.customer_id=tbl_alarmpin.customer_id "+ 
                " ORDER BY alarmdata.Opentime DESC "; 
      }else{
          
          var query = "  AND alarmdata.Opentime>='"+querydata.fromdate+"' AND alarmdata.Opentime<='"+querydata.todate+"'";
          if(querydata.siteid != "" && typeof querydata.siteid != 'undefined'){
              //spliting siteid's by comma
              var splitData= (querydata.siteid).split(",");
              
              var finalsiteid="";
              for(var i=0;i<splitData.length;i++){
                finalsiteid=finalsiteid+"'"+splitData[i]+"',";
              }
              
              querydata.siteid = finalsiteid.substr(0,finalsiteid.length-1);
              
              query = query + " AND alarmdata.Siteid IN ("+querydata.siteid+")";
             
          }  
          
          if(querydata.pin_id != "" && typeof querydata.pin_id != 'undefined'){
            query = query + " AND tbl_alarmpin.pin_id='"+querydata.pin_id+"'";
          }           
          if(querydata.customer_id != "" && typeof querydata.customer_id != 'undefined' && querydata.customer_id != "0") {
            query = query+ " AND tbl_site.customer_id = '"+ querydata.customer_id +"'";
          }
          
          sql="SELECT  alarmdata.Alarmtype, alarmdata.Alarmstatus, alarmdata.Siteid, tbl_site.site_name,tbl_site.site_address, alarmdata.Opentime, alarmdata.Closetime ,tbl_alarmpin.alarmpin_name "+
              "FROM tbl_alarmpin, alarmdata "+
              "LEFT JOIN tbl_site ON alarmdata.Siteid = tbl_site.site_code "+
              "WHERE alarmdata.Alarmpin = tbl_alarmpin.pin_id  AND tbl_site.customer_id=tbl_alarmpin.customer_id "+ query +
              " ORDER BY alarmdata.Opentime DESC ";
      }//else end
      handleReport(sql,querydata,req,res);
  });
  //End AP report  
 

  function handleReport(sql,querydata,req,res){
      var results;
      var outageDatas = [];
      var customerresult;
      //for pagination
      var numberofrecords=100;
      var nextPageValue=req.body.nextval;
      console.log("next val=="+nextPageValue);
      var statusValue=req.body.statusvalue;
      var rowsperpageval=req.body.rowsperpageval;
      console.log("row per::"+rowsperpageval);
      var limitStartVal;
      var startPosition=1;
      var endPosition;
      var lastRecordPosition;
      var nextval;
      var nextbuttonstatus=1;
      if(req.body.statusvalue==2 && typeof req.body.statusvalue!='undefined'){
         // console.log("nextpageval if triggerd........"+rowsperpageval+"numberofrecords"+numberofrecords);
          nextPageValue=numberofrecords*(rowsperpageval/10);
      }
      if(typeof rowsperpageval == 'undefined'){
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
      console.log("numberofrecords"+numberofrecords);
      console.log("STEP-2 :"+nextPageValue+" Status:"+statusValue);
      if(((typeof nextPageValue!= 'undefined' || nextPageValue != '') && statusValue==0) || ((typeof nextPageValue!= 'undefined' || nextPageValue != '') && statusValue==2)){
          limitStartVal=nextPageValue-records_to_subtract;
          console.log("nextval=="+nextPageValue);
           console.log("records_to_subtract:"+records_to_subtract);
          console.log("limit in next=="+limitStartVal);
        console.log("STEP-3");
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
      console.log("minit="+limitStartVal +"  numofrec-="+numberofrecords);
      sql = sql + " limit "+limitStartVal+","+numberofrecords+"";
      console.log("insidetriggered*****:"+sql);
      connection_pool.getConnection(function(err, connection) {
          connection.query(sql)
          .on('result', function(data){    
              res.header("Access-Control-Allow-Origin","*");
              res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
              outageDatas.push(data);
              //console.log("utagedatas.."+outageDatas);
          })  

          .on('end', function(){
             
              connection.release();
              
              var totalDatas = outageDatas.length;
              if(outageDatas.length<=(numberofrecords-1)){
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
            // console.log("rowsper==="+querydata.siteid+"="+querydata.fromdate+"="+querydata.todate);
            // console.log("rowsper==="+outageDatas+"="+sql+"="+totalDatas);
            // console.log("rowsper==="+nextval+"="+"="+startPosition+"="+endPosition+"="+lastRecordPosition);
            // console.log("rowsper==="+nextbuttonstatus+"="+rowsperpageval+"="+numberofrecords+"="+req.session.reports_info+"="+lastRecordPosition);
             //console.log("rowsper==="+minRange+"="+maxRange+"="+stepRange);
            res.send({title:"Alarmlist",
             // res.render(querydata.url,{title:"AlarmLists",
                    datas:outageDatas,totalDatas: totalDatas,custid:querydata.customer_id,
                    nextpagevalue:nextval,
                    currentposition:startPosition,
                    endposition:endPosition,
                    lastposition:lastRecordPosition,
                    nextbuttonstatus:nextbuttonstatus,
                    siteid:querydata.siteid,
                    pin_id:querydata.pin_id,
                    fromdate:querydata.fromdate,
                    todate:querydata.todate,
                    nextpagevalue:nextval
            });
        }) 

    })
  }//end of handle function


//cheque drop box new start

router.get('/chequedropbox', isAuthenticated, function(req, res){
      //console.log("cheque triggered");
      res.render('report/chequedropbox',{title:"AlarmLists", sess_name: req.session.uname, sess_id: req.session.rid, minRange: minRange, maxRange: maxRange, stepRange: stepRange});
  });

router.post('/getChequedrop', function(req, res){
          console.log("chequedropbox Triggered :");
                    var customerid="";
      if(req.session.cid != "0"){
        customer_id = req.session.cid;
      }else{
        customer_id = req.body.custid;
      }
     // console.log("alarm-panel triggered1 :"+cust_id);
      var querydata = {
        //url: 'report/alarm-panel',
        custid: req.session.cid,
        siteid : req.body.siteid,
        fromdate: moment(req.body.fromdate).format('YYYY-MM-DD HH:mm:ss'),
        todate : moment(req.body.todate).format('YYYY-MM-DD HH:mm:ss'),
        customer_id: req.body.custid
      }
      
      
      if ((req.body && typeof querydata.siteid === 'undefined' && typeof querydata.customer_id === 'undefined' && typeof querydata.todate === 'undefined' && typeof querydata.fromdate === 'undefined') || (querydata.siteid === '' && querydata.customer_id === '' && querydata.fromdate === '' && querydata.todate === '')){
          sql = "SELECT alarmdata.Alarmtype , alarmdata.Alarmstatus , alarmdata.Siteid , tbl_site.site_name,tbl_site.site_address, alarmdata.Opentime , alarmdata.Closetime, tbl_alarmpin.alarmpin_name "+
              "FROM tbl_alarmpin, tbl_site,alarmdata "+
              " WHERE alarmdata.siteid = tbl_site.site_code "+
              " AND alarmdata.Alarmpin = tbl_alarmpin.pin_id AND tbl_site.customer_id=tbl_alarmpin.customer_id AND tbl_alarmpin.alarmpin_sc ='CDB' "+ query +
              " ORDER BY alarmdata.Opentime DESC "; 
      }else{
          
          var query = "  AND alarmdata.Opentime>='"+querydata.fromdate+"' AND alarmdata.Opentime<='"+querydata.todate+"' ";
          if(querydata.siteid != "" && typeof querydata.siteid != 'undefined'){
              //spliting siteid's by comma
              var splitData= (querydata.siteid).split(",");
              
              var finalsiteid="";
              for(var i=0;i<splitData.length;i++){
                finalsiteid=finalsiteid+"'"+splitData[i]+"',";
              }
              
              querydata.siteid = finalsiteid.substr(0,finalsiteid.length-1);
              
              query = query + " AND alarmdata.Siteid IN ("+querydata.siteid+")";
             
          }  
          if(querydata.customer_id != "" && typeof querydata.customer_id != 'undefined' && querydata.customer_id != "0") {
            query = query+ " AND tbl_site.customer_id = '"+ querydata.customer_id +"'";
          }
          
          sql="SELECT alarmdata.Alarmtype , alarmdata.Alarmstatus , alarmdata.Siteid , tbl_site.site_name,tbl_site.site_address, alarmdata.Opentime , alarmdata.Closetime, tbl_alarmpin.alarmpin_name "+
              "FROM tbl_alarmpin, tbl_site,alarmdata "+
              " WHERE alarmdata.siteid = tbl_site.site_code "+
              " AND alarmdata.Alarmpin = tbl_alarmpin.pin_id AND tbl_site.customer_id=tbl_alarmpin.customer_id AND tbl_alarmpin.alarmpin_sc ='CDB' "+ query +
              " ORDER BY alarmdata.Opentime DESC ";
      }//else end
      handleReport(sql,querydata,req,res);
});
//cheque drop box new end

//chestdoor new start
router.get('/chest-door', isAuthenticated, function(req, res){
      //console.log("cheque triggered");
        res.render('report/chest-door',{title:"AlarmLists", sess_name:req.session.uname, sess_id: req.session.rid, minRange: minRange, maxRange: maxRange, stepRange: stepRange});
  });

router.post('/getChestdoor', function(req, res){
         // console.log("chequedropbox Triggered :");
      var customerid="";
      if(req.session.cid != "0"){
        customer_id = req.session.cid;
      }else{
        customer_id = req.body.custid;
      }
     // console.log("alarm-panel triggered1 :"+cust_id);
      var querydata = {
        //url: 'report/alarm-panel',
        custid: req.session.cid,
        siteid : req.body.siteid,
        fromdate: moment(req.body.fromdate).format('YYYY-MM-DD HH:mm:ss'),
        todate : moment(req.body.todate).format('YYYY-MM-DD HH:mm:ss'),
        customer_id: req.body.custid
      }
      
      
      if ((req.body && typeof querydata.siteid === 'undefined' && typeof querydata.customer_id === 'undefined' && typeof querydata.todate === 'undefined' && typeof querydata.fromdate === 'undefined') || (querydata.siteid === '' && querydata.customer_id === '' && querydata.fromdate === '' && querydata.todate === '')){
          sql = "SELECT alarmdata.Alarmtype , alarmdata.Alarmstatus , alarmdata.Siteid , tbl_site.site_name,tbl_site.site_address, alarmdata.Opentime , alarmdata.Closetime, tbl_alarmpin.alarmpin_name "+
              "FROM tbl_alarmpin, tbl_site,alarmdata "+
              " WHERE alarmdata.siteid = tbl_site.site_code "+
              " AND alarmdata.Alarmpin = tbl_alarmpin.pin_id AND tbl_site.customer_id=tbl_alarmpin.customer_id AND tbl_alarmpin.alarmpin_sc ='CD' "+ query +
              " ORDER BY alarmdata.Opentime DESC "; 
      }else{
          
          var query = " AND alarmdata.Opentime>='"+querydata.fromdate+"'  AND alarmdata.Opentime<='"+querydata.todate+"' ";
          if(querydata.siteid != "" && typeof querydata.siteid != 'undefined'){
              //spliting siteid's by comma
              var splitData= (querydata.siteid).split(",");
              
              var finalsiteid="";
              for(var i=0;i<splitData.length;i++){
                finalsiteid=finalsiteid+"'"+splitData[i]+"',";
              }
              querydata.siteid = finalsiteid.substr(0,finalsiteid.length-1);
              query = query + " AND alarmdata.Siteid IN ("+querydata.siteid+")";
          }  
                     
          if(querydata.customer_id != "" && typeof querydata.customer_id != 'undefined' && querydata.customer_id != "0") {
            query = query+ " AND tbl_site.customer_id = '"+ querydata.customer_id +"'";
          }
          
          sql="SELECT alarmdata.Alarmstatus ,alarmdata.Siteid,tbl_site.site_name,tbl_zone.zone_name,tbl_state.state_name,tbl_district.district_name, tbl_site.site_address,tbl_site.site_pincode,tbl_alarmpin.alarmpin_name, alarmdata.Opentime , alarmdata.Closetime  "+
              "FROM tbl_zone,tbl_state,tbl_district,tbl_area,tbl_alarmpin, tbl_site,alarmdata "+
              " WHERE alarmdata.siteid = tbl_site.site_code AND tbl_area.area_id=tbl_site.area_id "+
              " AND tbl_area.zone_id=tbl_zone.zone_id AND tbl_area.state_id=tbl_state.state_id AND tbl_area.district_id=tbl_district.district_id "+
              " AND alarmdata.Alarmpin = tbl_alarmpin.pin_id AND tbl_site.customer_id=tbl_alarmpin.customer_id AND tbl_alarmpin.alarmpin_sc ='CD' "+ query +
              " ORDER BY alarmdata.Opentime DESC ";   
      }//else end
      handleReport(sql,querydata,req,res);
});

//chestdoor new end

//shutter new start
  
router.get('/shutter', isAuthenticated, function(req, res){
     // console.log(" shutter Triggered");
      res.render('report/shutter',{title:"AlarmLists", sess_name: req.session.uname, sess_id: req.session.rid, minRange: minRange, maxRange: maxRange, stepRange: stepRange});
  });

router.post('/getdata', function(req, res){
          //console.log("shutter getdata Triggered :");
      var customerid="";
      if(req.session.cid != "0"){
        customer_id = req.session.cid;
      }else{
        customer_id = req.body.custid;
      }
     // console.log("alarm-panel triggered1 :"+cust_id);
      var querydata = {
        //url: 'report/alarm-panel',
        custid: req.session.cid,
        siteid : req.body.siteid,
        fromdate: moment(req.body.fromdate).format('YYYY-MM-DD HH:mm:ss'),
        todate : moment(req.body.todate).format('YYYY-MM-DD HH:mm:ss'),
        customer_id: req.body.custid
      }
      
      
      if ((req.body && typeof querydata.siteid === 'undefined' && typeof querydata.customer_id === 'undefined' && typeof querydata.todate === 'undefined' && typeof querydata.fromdate === 'undefined') || (querydata.siteid === '' && querydata.customer_id === '' && querydata.fromdate === '' && querydata.todate === '')){
          sql = "select b.siteid,a.site_name,c.customer_name,group_concat(b.RecordingTimeStamp order by b.RecordingTimeStamp asc) as timestamp, group_concat(b.Di20 order by b.RecordingTimeStamp asc) as Di20 from tbl_site a,rawdata b,tbl_customer c where b.Siteid=a.site_code and a.customer_id=c.customer_id and b.Di20 IN(2,3)  group by b.siteid order by b.RecordingTimeStamp DESC "; 
      }else{
          
          var query = "  AND b.RecordingTimeStamp>='"+querydata.fromdate+"' AND b.RecordingTimeStamp<='"+querydata.todate+"' ";
          if(querydata.siteid != "" && typeof querydata.siteid != 'undefined'){
              //spliting siteid's by comma
              var splitData= (querydata.siteid).split(",");
              
              var finalsiteid="";
              for(var i=0;i<splitData.length;i++){
                finalsiteid=finalsiteid+"'"+splitData[i]+"',";
              }
              
              querydata.siteid = finalsiteid.substr(0,finalsiteid.length-1);
              
              query = query + " AND b.siteid IN ("+querydata.siteid+")";
             
          }  
                    
          if(querydata.customer_id != "" && typeof querydata.customer_id != 'undefined' && querydata.customer_id != "0") {
            query = query+ " AND a.customer_id = '"+ querydata.customer_id +"'";
          }
          
          sql="select b.siteid,a.site_name,c.customer_name,group_concat(b.RecordingTimeStamp order by b.RecordingTimeStamp asc) as time, group_concat(b.Di20 order by b.RecordingTimeStamp asc) as Di20 from tbl_site a,rawdata b,tbl_customer c where b.Siteid=a.site_code and a.customer_id=c.customer_id and b.Di20 IN(2,3) "+query+" group by b.siteid order by b.RecordingTimeStamp DESC "
      }//else end
      handleReport(sql,querydata,req,res);
});
//shutter end

router.get('/all-tickets', isAuthenticated, function(req, res){
    var suname =req.session.uname;
    var suid =req.session.uid;
    var srid=req.session.rid;
    var urlstring = req.url
      //console.log("urlString :"+urlstring);
      var truncdata = urlstring.indexOf("&page=");
      //console.log("Position :"+truncdata);
      if(truncdata != '-1'){
        var searchdata = "/report"+urlstring.substr(0,truncdata);
      }else{
        var searchdata = "/report"+urlstring;
      }
    var query;
    var outageDatas = [];
    var fromdate = moment(req.query.fromdate).format('YYYY-MM-DD');
    var todate= moment(req.query.todate).format('YYYY-MM-DD');
    var siteid = req.query.siteid;

    var page_size = req.query.page_id;
    var numberofrecords=101;
      var nextPageValue=req.query.nextval;
      var pageValue=20;
      var limitStartVal;
      var startPosition=1;
      var endPosition;
      var lastRecordPosition;
      var nextval;
      var nextbuttonstatus=1;

      if(req.query.statusvalue==2 && typeof req.query.statusvalue!='undefined'){
        if(pageValue==30 || pageValue==40)
        {
          pageValue=20;
        }
        var pageValRemainder=pageValue/10;
        nextPageValue=100;
      }
      if(typeof nextPageValue== 'undefined'){
        limitStartVal=1;
        pageValue=20;
      }
    
      if((typeof nextPageValue!= 'undefined' && req.query.statusvalue==0) || (typeof nextPageValue!= 'undefined' && req.query.statusvalue==2)){
        limitStartVal=nextPageValue-100;
        if(limitStartVal==0){
          limitStartVal=1;
        }
        startPosition=nextPageValue-100;
        nextval=nextPageValue;
        startPosition=startPosition/pageValue;
        startPosition+=1;
        if(startPosition==0){
          startPosition=1;
        }
        numberofrecords=101;
        endPosition=nextPageValue/pageValue;
        lastRecordPosition=endPosition+1;
        }
      if(typeof nextPageValue!= 'undefined' && req.query.statusvalue==1){
        limitStartVal=nextPageValue-200;
        if(limitStartVal==0){
          limitStartVal=1;
        }
        startPosition=nextPageValue-200;
         nextval=nextPageValue-100;
        startPosition=startPosition/pageValue;
        startPosition+=1;
        if(startPosition==0){
          startPosition=1;
        }
        numberofrecords=101;
        endPosition=(nextPageValue-100)/pageValue;
        lastRecordPosition=endPosition+1;
      }
    if(typeof page_size === 'undefined' || page_size == '' || page_size == '0'){
       page_size = req.session.perrows;
    }

    if ((req.query && typeof siteid === 'undefined' && typeof todate === 'undefined' && typeof fromdate === 'undefined') || (siteid === '' && fromdate === '' && todate === '')){
     var sql = "SELECT a.ticket_id,a.assign_to,a.ticket_remark,a.recorded_date,b.site_id FROM tbl_tt_child a,tbl_tt_master b where a.ticket_id=b.ticket_id ORDER BY ticket_id"; 
    }else{
        var query = "";
        if(siteid != "" && typeof siteid != 'undefined'){
            var s=siteid.toString().split(",");
            var finalsiteid="";
            for(var i=0;i<s.length;i++){
                finalsiteid=finalsiteid+"'"+s[i]+"',";
            }
            siteid = finalsiteid.substr(0,finalsiteid.length-1);
            query = query + " AND c.site_id IN ("+siteid+")";
        }  
        if(fromdate != ""){
            query = query + " AND date_format(b.assign_date,'%Y-%m-%d')>='"+fromdate+"'";
        }
        if(todate != ""){
            query = query + " AND date_format(b.assign_date,'%Y-%m-%d')<='"+todate+"'";
        }  
          
        if(query != ""){
            queryStr = query;
        }
        var sql = "SELECT a.ticket_id,a.assign_to,a.ticket_remark,a.recorded_date,b.site_id FROM tbl_tt_child a,tbl_tt_master b where a.ticket_id=b.ticket_id  "+ queryStr +" ORDER BY site_id"+" limit "+limitStartVal+","+numberofrecords+""; 
    }          
    //console.log("trouble ticket :"+sql);   
    connection.query(sql)
        .on('result', function(data){
            res.header("Access-Control-Allow-Origin","*");
            res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");;
            outageDatas.push(data);
        })  
        .on('end', function(){
            var totalDatas = outageDatas.length;
              if(outageDatas.length<100)
              {
                var pagesCount=Math.ceil(outageDatas.length/pageValue,0);
                endPosition=startPosition+(pagesCount-1);
                lastRecordPosition=endPosition;
              }
            
            res.render('report/all-tickets',{title:"All Tickets", 
              sess_name: suname, 
              sess_id: srid,
              searchquery: searchdata,
              siteid : siteid,
              fromdate : fromdate,
              todate : todate,
              page_id: page_size,
              outageDatas: outageDatas,
              sqlquery: sql,
              totalDatas: totalDatas,
              nextpagevalue:nextval,
              currentposition:startPosition,
              endposition:endPosition,
              pagevalue:pageValue,
              lastposition:lastRecordPosition
            });
        })
});


//Trouble Ticket Simulator
router.get('/simulator', isAuthenticated, function(req, res){
      var suname =req.session.uname;
      var suid =req.session.uid;
      var srid=req.session.rid;
      res.render('report/simulator',{title:"simulator", sess_name: suname, sess_id: srid});
});



  router.get('/detterence-ticket', isAuthenticated, function(req, res){
      var suname =req.session.uname;
      var suid =req.session.uid;
      var srid=req.session.rid;
      res.render('report/detterence-ticket',{title:"AlarmLists", sess_name: suname, sess_id: srid});
  });

//custom new start
router.get('/custom', isAuthenticated, function(req, res){
      //console.log(" custom Triggered");
    res.render('report/custom',{title:"AlarmLists", sess_name:req.session.uname, sess_id: req.session.rid, minRange: minRange, maxRange: maxRange, stepRange: stepRange,order_arr:order_arr,sort_arr:sort_arr});
  });

  router.post('/getCustom', function(req, res){
          //console.log(" getcustom Triggered :");
          var customerid="";
      if(req.session.cid != "0"){
        customer_id = req.session.cid;
      }else{
        customer_id = req.body.custid;
      }
     // console.log("alarm-panel triggered1 :"+cust_id);
      var pin_id=req.body.pin_id;
      var order_id=req.body.order_id;
      var sort_id=req.body.sort_id;
      var querydata = {
        //url: 'report/alarm-panel',
        custid: req.session.cid,
        siteid : req.body.siteid,
        pin_id:pin_id,
        fromdate: moment(req.body.fromdate).format('YYYY-MM-DD HH:mm:ss'),
        todate : moment(req.body.todate).format('YYYY-MM-DD HH:mm:ss'),
        customer_id: req.body.custid
      }
      //console.log("pinno.."+pin_id);
      
      if ((req.body && typeof querydata.siteid === 'undefined' && typeof querydata.customer_id === 'undefined' && typeof querydata.todate === 'undefined' && typeof querydata.fromdate === 'undefined') || (querydata.siteid === '' && querydata.customer_id === '' && querydata.fromdate === '' && querydata.todate === '')){
          sql = "SELECT a.Alarmtype, a.Alarmstatus as Alarmstatus, a.Siteid, "+
               " b.site_name as site_name ,b.site_address, "+
               " a.Opentime,a.Closetime, c.alarmpin_name "+
               " FROM tbl_alarmpin c, tbl_site b,alarmdata a "+
               " WHERE b.site_code=a.Siteid  "+
               " AND c.pin_id=a.Alarmpin AND b.customer_id=c.customer_id "; 
      }else{
          
          var query = "  AND a.Opentime>='"+querydata.fromdate+"' AND a.Opentime<='"+querydata.todate+"' ";
          if(querydata.siteid != "" && typeof querydata.siteid != 'undefined'){
              //spliting siteid's by comma
              var splitData= (querydata.siteid).split(",");
              
              var finalsiteid="";
              for(var i=0;i<splitData.length;i++){
                finalsiteid=finalsiteid+"'"+splitData[i]+"',";
              }
              
              querydata.siteid = finalsiteid.substr(0,finalsiteid.length-1);
              
              query = query + " AND a.Siteid IN ("+querydata.siteid+")";
             
          }  
          if(querydata.pin_id != "" && typeof querydata.pin_id != 'undefined'){
            query = query + " AND c.pin_id='"+pin_id+"'";
          }           
          if(querydata.customer_id != "" && typeof querydata.customer_id != 'undefined' && querydata.customer_id != "0") {
            query = query+ " AND b.customer_id = '"+ querydata.customer_id +"'";
          }
          
          sql="SELECT a.Alarmtype, a.Alarmstatus as Alarmstatus, a.Siteid, "+
               " b.site_name as site_name ,b.site_address, "+
               " a.Opentime,a.Closetime, c.alarmpin_name "+
               " FROM tbl_alarmpin c, tbl_site b,alarmdata a "+
               " WHERE b.site_code=a.Siteid  "+
               " AND c.pin_id=a.Alarmpin AND b.customer_id=c.customer_id "+ query+
               " ORDER BY "+order_id+" "+sort_id+"";
      }//else end
      handleReport(sql,querydata,req,res);
  });
//custom new ends

//outage new start
router.get('/outage', isAuthenticated, function(req, res){
      //console.log(" outage Triggered");
      res.render('report/outage',{title:"AlarmLists", sess_name:req.session.uname, sess_id: req.session.rid, minRange: minRange, maxRange: maxRange, stepRange: stepRange});
  });

router.post('/getOutage', function(req, res){
     // console.log("getOutage Triggered :");
      var customerid="";
      if(req.session.cid != "0"){
        customer_id = req.session.cid;
      }else{
        customer_id = req.body.custid;
      }
     // console.log("alarm-panel triggered1 :"+cust_id);
      var querydata = {
        //url: 'report/alarm-panel',
        custid: req.session.cid,
        siteid : req.body.siteid,
        fromdate: moment(req.body.fromdate).format('YYYY-MM-DD HH:mm:ss'),
        todate : moment(req.body.todate).format('YYYY-MM-DD HH:mm:ss'),
        customer_id: req.body.custid
      }
      
      
      if ((req.body && typeof querydata.siteid === 'undefined' && typeof querydata.customer_id === 'undefined' && typeof querydata.todate === 'undefined' && typeof querydata.fromdate === 'undefined') || (querydata.siteid === '' && querydata.customer_id === '' && querydata.fromdate === '' && querydata.todate === '')){
          sql =  "SELECT rawdata.Siteid,tbl_site.site_name,tbl_site.site_address, rawdata.RecordingTimeStamp "+
                   " FROM tbl_site, rawdata "+
                   " WHERE rawdata.Siteid=tbl_site.site_code "+
                   " ORDER BY RecordingTimeStamp DESC ";
      }else{
          
          var query = " AND rawdata.RecordingTimeStamp>='"+querydata.fromdate+"' AND rawdata.RecordingTimeStamp<='"+querydata.todate+"'";
          if(querydata.siteid != "" && typeof querydata.siteid != 'undefined'){
              //spliting siteid's by comma
              var splitData= (querydata.siteid).split(",");
              
              var finalsiteid="";
              for(var i=0;i<splitData.length;i++){
                finalsiteid=finalsiteid+"'"+splitData[i]+"',";
              }
              
              querydata.siteid = finalsiteid.substr(0,finalsiteid.length-1);
              
              query = query + " AND rawdata.siteid IN ("+querydata.siteid+")";
             
          }            
          if(querydata.customer_id != "" && typeof querydata.customer_id != 'undefined' && querydata.customer_id != "0") {
            query = query+ " AND tbl_site.customer_id = '"+ querydata.customer_id +"'";
          }
          
          sql= "SELECT rawdata.Siteid,tbl_site.site_name,tbl_site.site_address, rawdata.RecordingTimeStamp "+
                   " FROM tbl_site, rawdata "+
                   " WHERE rawdata.Siteid=tbl_site.site_code "+ query +
                   " ORDER BY RecordingTimeStamp DESC ";
    }//else end
      handleReport(sql,querydata,req,res);
}); 
//outage new end

//rawdata new start
router.get('/rawdata', isAuthenticated, function(req, res){
     // console.log(" rawdata Triggered");
    res.render('report/rawdata',{title:"AlarmLists", sess_name:req.session.uname, sess_id: req.session.rid, minRange: minRange, maxRange: maxRange, stepRange: stepRange});
  });

router.post('/getRawdata', function(req, res){
     // console.log("getRawdata Triggered :");
      var customerid="";
      if(req.session.cid != "0"){
        customer_id = req.session.cid;
      }else{
        customer_id = req.body.custid;
      }
     // console.log("alarm-panel triggered1 :"+cust_id);
      var querydata = {
        //url: 'report/alarm-panel',
        custid: req.session.cid,
        siteid : req.body.siteid,
        fromdate: moment(req.body.fromdate).format('YYYY-MM-DD HH:mm:ss'),
        todate : moment(req.body.todate).format('YYYY-MM-DD HH:mm:ss'),
        customer_id: req.body.custid
      }
      
      
      if ((req.body && typeof querydata.siteid === 'undefined' && typeof querydata.customer_id === 'undefined' && typeof querydata.todate === 'undefined' && typeof querydata.fromdate === 'undefined') || (querydata.siteid === '' && querydata.customer_id === '' && querydata.fromdate === '' && querydata.todate === '')){
          sql = "SELECT * FROM rawdata ORDER BY Siteid ASC, RecordingTimeStamp DESC";
      }else{
          
          var query = " AND rawdata.RecordingTimeStamp>='"+querydata.fromdate+"' AND rawdata.RecordingTimeStamp<='"+querydata.todate+"'";
          if(querydata.siteid != "" && typeof querydata.siteid != 'undefined'){
              //spliting siteid's by comma
              var splitData= (querydata.siteid).split(",");
              
              var finalsiteid="";
              for(var i=0;i<splitData.length;i++){
                finalsiteid=finalsiteid+"'"+splitData[i]+"',";
              }
              
              querydata.siteid = finalsiteid.substr(0,finalsiteid.length-1);
              
              query = query + " AND rawdata.Siteid IN ("+querydata.siteid+")";
             
          }            
          if(querydata.customer_id != "" && typeof querydata.customer_id != 'undefined' && querydata.customer_id != "0") {
            query = query+ " AND tbl_site.customer_id = '"+ querydata.customer_id +"'";
          }
          
          sql= sql =  "SELECT rawdata.* FROM rawdata,tbl_site WHERE rawdata.Siteid=tbl_site.site_code " + query + " ORDER BY Siteid ASC, RecordingTimeStamp DESC";
    }//else end
      handleReport(sql,querydata,req,res);
}); 
//rawdata new end


//EMApp new start
router.get('/emapp', isAuthenticated, function(req, res){
      //console.log(" Emapp Triggered");
    res.render('report/emapp',{title:"AlarmLists", sess_name: req.session.uname, sess_id:req.session.rid, minRange: minRange, maxRange: maxRange, stepRange: stepRange});
  });

router.post('/getEmapp', function(req, res){
         // console.log("getEmapp Triggered :");
      var customerid="";
      if(req.session.cid != "0"){
        customer_id = req.session.cid;
      }else{
        customer_id = req.body.custid;
      }
     // console.log("alarm-panel triggered1 :"+cust_id);
      var querydata = {
        //url: 'report/alarm-panel',
        custid: req.session.cid,
        siteid : req.body.siteid,
        fromdate: moment(req.body.fromdate).format('YYYY-MM-DD HH:mm:ss'),
        todate : moment(req.body.todate).format('YYYY-MM-DD HH:mm:ss'),
        customer_id: req.body.custid
      }
      
      
      if ((req.body && typeof querydata.siteid === 'undefined' && typeof querydata.customer_id === 'undefined' && typeof querydata.todate === 'undefined' && typeof querydata.fromdate === 'undefined') || (querydata.siteid === '' && querydata.customer_id === '' && querydata.fromdate === '' && querydata.todate === '')){
          sql ="SELECT energydata.Siteid ,tbl_site.site_name,tbl_site.site_address,energydata.TIMESTAMP ,"+
              "energydata.Frequency ,energydata.Kwh ,energydata.VRN , "+
              "energydata.IR , energydata.VYN , energydata.IY , "+
              "energydata.VBN , energydata.IB  "+
              "FROM m2m.tbl_site AS tbl_site,emapp.energydata as energydata "+ 
              "WHERE energydata.Siteid=tbl_site.site_code  ORDER BY energydata.TIMESTAMP DESC";
      ;
      }else{
          
          var query = " AND energydata.TIMESTAMP>='"+querydata.fromdate+"' AND energydata.TIMESTAMP<='"+querydata.todate+"' ";
          if(querydata.siteid != "" && typeof querydata.siteid != 'undefined'){
              //spliting siteid's by comma
              var splitData= (querydata.siteid).split(",");
              
              var finalsiteid="";
              for(var i=0;i<splitData.length;i++){
                finalsiteid=finalsiteid+"'"+splitData[i]+"',";
              }
              
              querydata.siteid = finalsiteid.substr(0,finalsiteid.length-1);
              
              query = query + " AND  energydata.Siteid IN ("+querydata.siteid+")";
             
          }        
          if(querydata.customer_id != "" && typeof querydata.customer_id != 'undefined' && querydata.customer_id != "0") {
            query = query+ " AND tbl_site.customer_id = '"+ querydata.customer_id +"'";
          }
          
          sql= "SELECT energydata.Siteid ,tbl_site.site_name,tbl_site.site_address,energydata.TIMESTAMP ,"+
              "energydata.Frequency ,energydata.Kwh ,energydata.VRN , "+
              "energydata.IR , energydata.VYN , energydata.IY , "+
              "energydata.VBN , energydata.IB  "+
              "FROM m2m.tbl_site AS tbl_site,emapp.energydata as energydata "+ 
              "WHERE energydata.Siteid=tbl_site.site_code " + query + " ORDER BY energydata.TIMESTAMP DESC";
      
    }//else end
      handleReport(sql,querydata,req,res);
}); 
//EMApp new end 

//energy data start
router.get('/energy', isAuthenticated, function(req, res){
    //console.log(" energy Triggered");
    res.render('report/energy',{title:"AlarmLists", sess_name:req.session.uname, sess_id: req.session.rid, minRange: minRange, maxRange: maxRange, stepRange: stepRange});
  });

router.post('/getEnergy', function(req, res){
 console.log("energy Triggered :");
      var customerid="";
      if(req.session.cid != "0"){
        customer_id = req.session.cid;
      }else{
        customer_id = req.body.custid;
      }
     // console.log("alarm-panel triggered1 :"+cust_id);
      var querydata = {
        //url: 'report/alarm-panel',
        custid: req.session.cid,
        siteid : req.body.siteid,
        fromdate: moment(req.body.fromdate).format('YYYY-MM-DD HH:mm:ss'),
        todate : moment(req.body.todate).format('YYYY-MM-DD HH:mm:ss'),
        customer_id: req.body.custid
      }
      
      
      if ((req.body && typeof querydata.siteid === 'undefined' && typeof querydata.customer_id === 'undefined' && typeof querydata.todate === 'undefined' && typeof querydata.fromdate === 'undefined') || (querydata.siteid === '' && querydata.customer_id === '' && querydata.fromdate === '' && querydata.todate === '')){
          sql = "SELECT emlastknown.Siteid,tbl_site.site_name,tbl_site.site_address,emlastknown.TIMESTAMP , emlastknown.Frequency ,"+
                       " emlastknown.Kwh , emlastknown.VRN , emlastknown.IR , emlastknown.VYN , emlastknown.IY , emlastknown.VBN , emlastknown.IB  "+
                       " FROM m2m.tbl_site AS tbl_site,emapp.emlastknown AS emlastknown "+
                       " WHERE emlastknown.Siteid=tbl_site.site_code  " +
                       " ORDER BY emlastknown.TIMESTAMP DESC " 
      }else{
          
          var query = "  And emlastknown.TIMESTAMP>='"+querydata.fromdate+"' And emlastknown.TIMESTAMP<='"+querydata.todate+"' ";
          if(querydata.siteid != "" && typeof querydata.siteid != 'undefined'){
              //spliting siteid's by comma
              var splitData= (querydata.siteid).split(",");
              
              var finalsiteid="";
              for(var i=0;i<splitData.length;i++){
                finalsiteid=finalsiteid+"'"+splitData[i]+"',";
              }
              
              querydata.siteid = finalsiteid.substr(0,finalsiteid.length-1);
              
              query = query + " AND emlastknown.Siteid IN ("+querydata.siteid+")";
             
          }  
          if(querydata.customer_id != "" && typeof querydata.customer_id != 'undefined' && querydata.customer_id != "0") {
            query = query+ " AND tbl_site.customer_id = '"+ querydata.customer_id +"'";
          }
          
          sql="SELECT emlastknown.Siteid,tbl_site.site_name,tbl_site.site_address,emlastknown.TIMESTAMP , emlastknown.Frequency ,"+
                       " emlastknown.Kwh , emlastknown.VRN , emlastknown.IR , emlastknown.VYN , emlastknown.IY , emlastknown.VBN , emlastknown.IB  "+
                       " FROM m2m.tbl_site AS tbl_site,emapp.emlastknown AS emlastknown "+
                       " WHERE emlastknown.Siteid=tbl_site.site_code  " +query+
                       " ORDER BY emlastknown.TIMESTAMP DESC ";
      }//else end
      handleReport(sql,querydata,req,res);
});
//energydata end


  return router;
}
