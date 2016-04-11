var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt-nodejs');
var moment = require('moment');
var util = require("util"); 
var path = require('path');     //used for file path
var fs = require('fs-extra');       //File System - for file manipulation
var multer  = require('multer');
var bodyParser = require('body-parser');

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })


var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()){
      
      return next();
    }
    res.redirect('/');
}


module.exports = function(passport,dbconnection) {
  	//console.log("customer triggered");
    
    /* GET customer listing. */
    router.get('/', isAuthenticated, function(req, res){
        var sql = "SELECT a.* "+
                  "FROM tbl_institute a,tbl_customer b WHERE a.customer_id = b.customer_id and b.customer_id = '"+req.session.cid+"' and b.customer_status='0'"; 
        getSQLData(sql, function(dbresultsets){
            results = dbresultsets;
            //console.log("results :"+results);
            res.render('institute/index',{title:"InstituteList", sess_name: req.session.uname, sess_id: req.session.rid, datas: results});
        });
    });   

   
    router.get('/edit/:id',isAuthenticated,function(req, res){
        var sql = "SELECT a.* "+
                  "FROM tbl_institute a,tbl_customer b WHERE a.customer_id=b.customer_id and a.id = '"+req.params.id+"'";
        getSQLData(sql, function(dbresultsets){
            results = dbresultsets;
            res.render('institute/edit',{title:"Edit",sess_name: req.session.uname, sess_id: req.session.rid,data:results});
        });
    });  

    router.post('/update',isAuthenticated,function(req, res){
          var now = moment().format("YYYY-MM-DD HH:mm:ss");
       

          sql = "UPDATE tbl_institute SET institute_name = '"+req.body.institutename+"',address = '"+req.body.address+"', pincode = '"+req.body.pincode+"', mode_of_communication = '"+req.body.communication+"', full_name  = '"+req.body.fullname+"', contact_number  = '"+req.body.contact_number+"',contact_mailid = '"+req.body.contact_mailid+"', board_details = '"+req.body.board_details+"', updated_date = '"+now+"' WHERE id = '"+req.body.recid+"'";
          console.log("Edit SQL :"+sql);
          getSQLData(sql, function(resultsets){
              if(resultsets.length > 0){
                    msg = "Updated Successfully";
              }
              res.redirect('/institute');  
          });
    });  

    

    /* callback function */
    function getSQLData(sqls, cb) { 
        var resultsets;
        dbconnection.getConnection(function(err, connection) {
          console.log("SQL :"+sqls);
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
