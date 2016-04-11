var express = require('express');
var router = express.Router();
var moment = require('moment');
var exec = require('child_process').exec;
var connection_pool=require("../config/pool").pool;

module.exports = function(passport) {

//customer combo
router.post('/getcustInfo',function(req, res){
     //var sql = "SELECT customer_id,customer_name from tbl_customer";
      sql = "SELECT a.customer_id,a.customer_name from tbl_customer a LEFT JOIN tbl_site b ON a.customer_id=b.customer_id Group By a.customer_id";  
        getSQLData(sql, function(resultsets){
           results = resultsets;
           res.send({custdata:results});
        })
 });
router.post('/alarmpin', function(req, res){
    sql = "select alarmpin_name, alarmpin_sc,curl_cmd from tbl_alarmpin where customer_id='"+req.body.customer_id+"' and alarmpin_status='0' AND (alarmpin_no like 'Do%')";  
    console.log("Alarmpin-SQL :"+sql);
      getSQLData(sql, function(resultsets){
           results = resultsets;
           //console.log("SiteID Results :"+results.length);
           res.send({custdata:results});
      })
});  
//site combo
 router.get('/getsiteinfo',function(req, res){
    srid = req.session.rid;
    
    
    if(srid !='6'){
      custid=req.query.custid;  
    }else{
      custid = req.session.cid;
    }
    if(custid == "0" || custid == "" || typeof custid === "undefined"){
       sql = "select a.site_code,a.site_name from tbl_site a,tbl_customer b where a.customer_id=b.customer_id Group By a.site_code";
    }else{
      sql = "select a.site_code,a.site_name from tbl_site a,tbl_customer b where a.customer_id=b.customer_id AND a.customer_id ='"+custid+"' Group By a.site_code";
    }
     //console.log("SQL :"+sql);
      getSQLData(sql, function(resultsets){
           results = resultsets;
           //console.log("SiteID Results :"+results.length);
           res.send({custdata:results});
      })
  });

 //pin combo
 router.get('/getpinInfo',function(req, res){
       var custid=req.query.custid;
       //console.log("custid=="+custid);
       if(custid == "0" || custid == "" || typeof custid === "undefined"){
        var sql = "SELECT pin_id,alarmpin_name from tbl_alarmpin where customer_id='0' ";
        }else{
         //var sql = "SELECT alarmpin_id,alarmpin_name from tbl_alarmpin";
         var sql = "SELECT pin_id,alarmpin_name from tbl_alarmpin where customer_id='"+custid+"' ";
        }
        //console.log("Customer SQL :"+sql);
          getSQLData(sql, function(resultsets){
             results = resultsets;
             res.send({custdata:results});
          })
  });
 
  //hootere
  router.post('/hooter',function(req, res){
      siteid=req.body.site_id;
      hstatus=req.body.hooter_status;
      ip=req.body.ip_address;
      
      var command1 = "*,"+siteid+","+hstatus+",atm,^";
      var command2 = "curl --data "+"'"+command1+"'"+' -v http://'+ip+':5000';
      console.log("Hooter:"+command2);
      child = exec(command2,function(error,stdout,stderr){
        if(error != null){
          console.log("exec error :"+error);
        }
        console.log("stdErr :"+stderr);
        console.log("result :"+stdout);
        res.send(stdout); 
      })
  });
  
  function getSQLData(sqls, cb) { 
        console.log("SQL :"+sqls);
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