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
    //console.log("Live Page Get Method ");
    res.render('control/index',{sess_name:req.session.uname,sess_id:req.session.rid,minRange:minRange,maxRange:maxRange,stepRange:stepRange});
  });    

 
    
  router.post('/getdata', function(req, res){
      //console.log("Live Page POST Method ");
      var suname =req.session.uname;
      var suid =req.session.uid;
      var srid=req.session.rid;
      var cid = req.session.cid;
      var customer_id=req.body.custid;
      
      var siteid =req.body.site_id;
      var pushdata = [];
      var outageDatas = [];
      var fields1 = [];
      if(typeof customer_id === 'undefined' || customer_id == ""){  
          var sql = "SELECT alarmpin_no,alarmpin_sc,alarmpin_name from tbl_alarmpin WHERE alarmpin_status = '0' and user_id='"+suid+"'";
      }else{
          var sql = "SELECT alarmpin_no,alarmpin_sc,alarmpin_name from tbl_alarmpin WHERE alarmpin_status = '0' and customer_id='"+customer_id+"'";
      }

      //console.log("FirstSQL :"+sql);
      connection.query(sql)
          .on('result', function(data){
            pushdata.push(data);
      })  

      .on('end', function(){
          //console.log(pushdata);
          strdata= "";
         // console.log("pushdata:"+JSON.stringify(pushdata));
          for(i=0;i<pushdata.length;i++){
           
            if((pushdata[i].alarmpin_no).match(/Do[0-9]/)){
               strdata += "a."+pushdata[i].alarmpin_no+" "+pushdata[i].alarmpin_sc+",";
               fields1.push(pushdata[i].alarmpin_sc);
            }   
          }
         
          orgstr = strdata.substr(0,strdata.length-1);
          console.log("StrData :"+orgstr);
          var query="";
          var  sql =  "SELECT a.RecordingTimeStamp,a.Siteid,a.IP, "+orgstr+" FROM lastknown a WHERE a.Siteid='"+siteid+"' ORDER BY a.RecordingTimeStamp DESC";
          console.log("Live triggered************:"+sql)
       
       
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
              
             
              res.send({title:"AlarmLists", 
                fieldnames : pushdata,
                siteid:req.query.siteid,
                datas:outageDatas,
                dataslength: resultslength,
                custid: customer_id
                
              });
          })
          //console.log("NewSQL :"+newsql);
      })
      
  });

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


/* callback function */
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
