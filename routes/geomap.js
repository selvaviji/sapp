var express = require('express');
var router = express.Router();
var moment = require('moment');
var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated())
      return next();
    
    res.redirect('/');
}


module.exports = function(passport,dbconnection) {
  	/* GET msps listing. */
    router.get('/', isAuthenticated, function(req, res){
        var query;
        var results;
        var suname =req.session.uname;
        var suid =req.session.uid;
        var srid=req.session.rid;
        var custid= "";
        var cid = req.session.cid;
        if(cid != "0"){
            customer_id = cid;
            sql = "SELECT site_latitude,site_longitude,site_address,site_name FROM tbl_site a,tbl_customer b "+
                    "WHERE a.customer_id=b.customer_id AND a.customer_id="+ customer_id;
        }else{
           sql = "SELECT site_latitude,site_longitude,site_address,site_name  FROM tbl_site a,tbl_customer b "+
                    "WHERE a.customer_id=b.customer_id ";
        }            
        
        //console.log("Geo SQL :"+sql);
        var results = [];
        getSQLData(sql, function(dbresultsets){
            console.log("Length :"+dbresultsets.length);
            console.log("result :"+JSON.stringify(dbresultsets));
            results = dbresultsets;
            console.log(results);
            res.render('geomap/index',{title:"Level", sess_name: suname, sess_id: srid, datas: results,customerid: cid});
        });
    });
    router.post('/geo', isAuthenticated, function(req, res){
        var cid = req.session.cid;
        if(req.body.customerid != "" && req.body.customerid != null && typeof req.body.customerid != undefined){
            cid = req.body.customerid;
        }
        
        
        if(cid != "0"){
            customer_id = cid;
            sql = "SELECT site_latitude,site_longitude,site_address,site_name  FROM tbl_site a,tbl_customer b "+
                    "WHERE a.customer_id=b.customer_id AND a.customer_id='"+ customer_id + "'";
        }else{
           sql = "SELECT site_latitude,site_longitude,site_address,site_name  FROM tbl_site a,tbl_customer b "+
                    "WHERE a.customer_id=b.customer_id ";
        }            
        
        //console.log("Geo SQL :"+sql);
        var results = [];
        getSQLData(sql, function(dbresultsets){
            results = dbresultsets;
            res.send({datas: results});
        });
    });   
    router.post('/getcustInfo', isAuthenticated, function(req, res){
        var cid = req.session.cid;
        if(cid != "0"){
            customer_id = cid;
            sql = "SELECT site_code,site_pincode FROM tbl_site a,tbl_customer b "+
                    "WHERE a.customer_id=b.customer_id AND a.customer_id="+ customer_id;
        }else{
           sql = "SELECT site_code,site_pincode FROM tbl_site a,tbl_customer b "+
                    "WHERE a.customer_id=b.customer_id ";
        }            
        var results = [];
        getSQLData(sql, function(resultsets){
           results = resultsets;
           res.send({custdata:results});
        })
     });
    
     /* callback function */
    function getSQLData(sqls, cb) { 
        var resultsets;
        dbconnection.getConnection(function(err, connection) {
          connection.query(sqls, function(err, res1){
              connection.release();  
              if(res1.length >0){
                resultsets=res1;
              }else{
                resultsets={};
              }
              cb(resultsets); //callback if all queries are processed
          });
        });  
        
    };

    return router;
}
 