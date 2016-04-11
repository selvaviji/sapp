
var express = require('express');
var router = express.Router();
var moment = require('moment');

var minRange=10;
var maxRange=50;
var stepRange=10;

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
      var suname =req.session.uname;
      var suid =req.session.uid;
      var srid=req.session.rid;
      var cid = req.session.cid;
      var perpage = req.session.perrows;
      var customer_id; 
      if(cid != "0"){
        customer_id = cid;
      }else{
        customer_id = req.query.customer_id;
      }

      if(customer_id == "0" || customer_id == "" || typeof customer_id === "undefined"){
        customername = "All";
      }else{  
        getCustomerName(customer_id,function(dbresults){
          //console.log("customerdata :"+dbresults);
          customername=dbresults;
        });
      }

      //var urlstring = req.url;
      var results;
      var  outageDatas = [];
      var fromdate = moment(req.query.fromdate).format('YYYY-MM-DD');
      var todate= moment(req.query.todate).format('YYYY-MM-DD');
      var siteid = req.query.siteid;
      var customerresult;
     //for pagination
      var numberofrecords=100;
      var nextPageValue=req.query.nextval;
      var statusValue=req.query.statusvalue;
      var rowsperpageval=req.query.rowsperpageval;
      var limitStartVal;
      var startPosition=1;
      var endPosition;
      var lastRecordPosition;
      var nextval;
      var nextbuttonstatus=1;
      if(req.query.statusvalue==2 && typeof req.query.statusvalue!='undefined'){
          //console.log("nextpageval if triggerd........"+rowsperpageval+"numberofrecords"+numberofrecords);
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
      //console.log("numberofrecords"+numberofrecords);
      //console.log("STEP-2 :"+nextPageValue+" Status:"+statusValue);
      if(((typeof nextPageValue!= 'undefined' || nextPageValue != '') && statusValue==0) || ((typeof nextPageValue!= 'undefined' || nextPageValue != '') && statusValue==2)){
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
      
     
      
      if ((req.query && typeof siteid === 'undefined' && typeof customer_id === 'undefined' && typeof todate === 'undefined' && typeof fromdate === 'undefined') || (siteid === '' && customer_id === '' && fromdate === '' && todate === '')){
        
         sql =  "SELECT a.Siteid, b.site_name, b.site_address, a.Opentime, a.ackflag, c.user_name, a.acktime "+
                 "FROM alarmdata a "+
                 "LEFT JOIN tbl_site b ON a.siteid = b.site_code "+
                 "LEFT JOIN tbl_user c ON a.ackby = c.user_id "+
                 "ORDER BY a.Opentime DESC "  ;
      }else{
         
          var query = "";
          if(siteid != "" && typeof siteid != 'undefined'){
              if(query != ""){
                query = query + " AND a.Siteid='"+siteid+"'";
              }else{
                query = " WHERE a.Siteid='"+siteid+"'";
              }  
          }  


          if(fromdate != ""){
              if(query != ""){
                query = query + " AND date_format(a.Opentime,'%Y-%m-%d')>='"+fromdate+"'";
              }else{
                query = " WHERE date_format(a.Opentime,'%Y-%m-%d')>='"+fromdate+"'";
              }
          }  

          if(todate != ""){
              if(query != ""){
                query = query + " AND date_format(a.Opentime,'%Y-%m-%d')<='"+todate+"'";
              }else{
                query = " WHERE date_format(a.Opentime,'%Y-%m-%d')<='"+todate+"'";
              }
          }    
          if(customer_id != "" && typeof customer_id !='undefined'){
              query = query + " AND b.customer_id='"+customer_id+"'";
          }
          
         sql =  "SELECT a.Siteid, b.site_name, b.site_address,a.Opentime, a.ackflag, c.user_name, a.acktime "+
                 "FROM alarmdata a "+
                 "LEFT JOIN tbl_site b ON a.siteid = b.site_code "+
                 "LEFT JOIN tbl_user c ON a.ackby = c.user_id "+ query +
                 "ORDER BY a.Opentime DESC "+" limit "+limitStartVal+","+numberofrecords+"";
        
          
      }//else
               
      //console.log("AlarmLists sql triggered :"+sql);

      connection.query(sql)
          .on('result', function(data){
              // Push results onto the notes array
              res.header("Access-Control-Allow-Origin","*");
              res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");;
              outageDatas.push(data);
          })  

          .on('end', function(){
              // Only emit notes after query has been completed
              //socket.emit('initial alarm', notes)console.log("Data :"+students.length);
              var totalDatas = outageDatas.length;
              //console.log("total records::"+totalDatas);
              if(outageDatas.length<=(numberofrecords-1))
              {
                var pagesCount=Math.ceil(outageDatas.length/rowsperpageval,0);
                endPosition=startPosition+(pagesCount-1);
                lastRecordPosition=endPosition;
                nextbuttonstatus=0;
              }
              if(outageDatas.length>(numberofrecords-1)){
                //console.log("outageDataslength"+outageDatas.length);
                nextbuttonstatus=1;
                outageDatas.pop();
              }
              

              res.render('alarmlist/index',{title:"AlarmLists", 
                  sess_name: suname, 
                  sess_id: srid,
                  customerresult:customername,
                  custid : customer_id,
                  cid : cid,
                  siteid : req.query.siteid,
                  fromdate : fromdate,
                  todate : todate,
                  outageDatas: outageDatas,
                  sqlquery: sql,
                  totalDatas: totalDatas,
                  nextpagevalue:nextval,
                  currentposition:startPosition,
                  endposition:endPosition,
                  lastposition:lastRecordPosition,
                  nextbuttonstatus:nextbuttonstatus,
                  rowsperpageval:rowsperpageval,
                  numberofrecords:numberofrecords,
                  sess_report:req.session.reports_info,
                  minRange:minRange,
                  maxRange:maxRange,
                  stepRange:stepRange});
          })    
  });


//to get customer name
   function getCustomerName(cid,cb){
    connection.query("select customer_name from tbl_customer where customer_id='"+cid+"'",function(err,res1){
        if(res1.length >0){
          resultsets=res1;
        }else{
          resultsets={};
        }
        cb(resultsets); 
    });
  }
  return router;
}