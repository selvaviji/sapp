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
        var sql = "SELECT a.customer_id, a.customer_name,a.no_of_students,a.display_name,a.logo_name,a.customer_status,b.user_id,b.user_name,b.pass_word,b.user_status,b.created_date,b.updated_date "+
              "FROM tbl_customer a,tbl_user b WHERE a.customer_id = b.customer_id"; 
        getSQLData(sql, function(dbresultsets){
            results = dbresultsets;
            //console.log("results :"+results);
            res.render('customer/index',{title:"CustomerList", sess_name: req.session.uname, sess_id: req.session.rid, datas: results});
        });
    });   

    /* back to main screen */
    router.get('/cancelAdd', function(req, res, next) {
        res.redirect('/');
    });

    /* delete a customer */
    router.post('/delete',isAuthenticated,function(req,res){
        var sql = "DELETE FROM tbl_user WHERE customer_id in ('"+req.body.recordids+"')";
        dbconnection.getConnection(function(err, connection) {  
            connection.query(sql, function(err, dbresultsets){
              if(dbresultsets.affectedRows > 0){ 
                  sqls = "DELETE FROM tbl_customer WHERE customer_id in ('"+req.body.recordids+"')";
                  connection.query(sqls, function(err, dbresultsets){
                      if(dbresultsets.affectedRows > 0){ 
                          sqls = "DELETE FROM tbl_preferences WHERE customer_id in ('"+req.body.recordids+"')";
                          connection.query(sqls, function(err, dbresultsets){
                              if(dbresultsets.affectedRows > 0){
                                 msg = "Deleted Successfully";
                              }
                          });
                      }  
                  });
              }    
            });
            connection.release();
        });
        res.redirect('/');
    });  

    /* delete a customer */
    router.get('/delete/:id',isAuthenticated,function(req,res){
        var suname =req.session.uname;
        var srid=req.session.rid;
        var sql = "DELETE FROM tbl_user WHERE customer_id in ('"+req.params.id+"')";

        dbconnection.getConnection(function(err, connection) {  
            connection.query(sql, function(err, dbresultsets){
              if(dbresultsets.affectedRows > 0){ 
                  sqls = "DELETE FROM tbl_customer WHERE customer_id in ('"+req.params.id+"')";
                  connection.query(sqls, function(err, dbresultsets){
                      if(dbresultsets.affectedRows > 0){ 
                          sqls = "DELETE FROM tbl_preferences WHERE customer_id in ('"+req.params.id+"')";
                          connection.query(sqls, function(err, dbresultsets){
                              if(dbresultsets.affectedRows > 0){
                                  msg = "Deleted Successfully";
                              
                              }
                          });
                      }  
                  });
              }    
            });
            connection.release();
        });
        res.redirect('/');
    });  

   
    /* new customer */
    router.get('/addcustomer',isAuthenticated,function(req,res){
        res.render('customer/newcustomer',{title:"Customer",sess_name: req.session.uname, sess_id: req.session.rid});
    });  

    router.get('/edit/:id',isAuthenticated,function(req, res){
        var sql = "SELECT a.customer_id,a.customer_name,a.customer_status,a.display_name,a.no_of_students,a.logo_name,b.user_id,b.user_name,b.pass_word,b.user_status,b.created_date,b.updated_date "+
                  "FROM tbl_customer a,tbl_user b WHERE a.user_id=b.user_id and a.user_id = '"+req.params.id+"'";
        getSQLData(sql, function(dbresultsets){
            results = dbresultsets;
            res.render('customer/editcustomer',{title:"EditCustomer",sess_name: req.session.uname, sess_id: req.session.rid,data:results});
        });
    });  
      
    router.post('/update',isAuthenticated,[ multer({ dest: './frontend/assets/uploads'}),function(req, res){
          var now = moment().format("YYYY-MM-DD HH:mm:ss");
          var myObject = req.files;
          var count = Object.keys(myObject).length;

          sql = "UPDATE tbl_user SET user_name='"+req.body.username+"',pass_word='"+req.body.password+"',updated_date='"+now+"' WHERE user_id = '"+req.body.userid+"'";
          getSQLData(sql, function(resultsets){
              if(count > 0){
                logoname = req.files.imgInp.name;
                sqls = "UPDATE tbl_customer SET customer_status='"+req.body.customerstatus+"',no_of_students='"+req.body.noofstudents+"',display_name='"+req.body.displayname+"',customer_name='"+req.body.username+"',logo_name = '"+logoname+"',updated_date='"+now+"' WHERE user_id = '"+req.body.userid+"'";
              }else{
                sqls = "UPDATE tbl_customer SET customer_status='"+req.body.customerstatus+"',no_of_students='"+req.body.noofstudents+"',display_name='"+req.body.displayname+"',customer_name='"+req.body.username+"',updated_date='"+now+"' WHERE user_id = '"+req.body.userid+"'";
              }
              getSQLData(sqls, function(dbresultsets){
                  if(dbresultsets.length > 0){
                    msg = "Updated Successfully";
                  }
              });
              res.redirect('/customer');  
          });
    }]);  

    
    
     /* save user1 */
    router.post('/savecustomer',isAuthenticated,[ multer({ dest: './frontend/assets/uploads'}),function(req,res){
        var msg="";
        var logoname = "";

        var user = req.body;
        var username = user.customername;
        var password = user.password;
        var displayname = user.displayname;
        var noofstudents = user.noofstudents;
        var newuserid="";
        var newcustomerid="";
        if(username != "" && password != ""){
            var myObject = req.files;
            var count = Object.keys(myObject).length
            //console.log("Count :"+count);
            if(count > 0){
               logoname = req.files.imgInp.name;
            }
            //console.log("LogoName :"+logoname);
       
            var usertype = "2";
          
            sql = "SELECT user_name "+
                    "FROM tbl_user WHERE user_name ='"+req.body.username+"'";
            console.log("SQL :"+sql);        
            getSQLData(sql, function(resultsets){
                if(Object.keys(resultsets).length == 0){
                    var now = moment().format("YYYY-MM-DD HH:mm:ss");
                    sqls = "INSERT INTO tbl_user (user_name,pass_word,role_id,user_status,created_date,updated_date) "+
                    " values('"+username+"','"+password+"','"+usertype+"','0','"+now+"','"+now+"')";
                    console.log("SQL :"+sqls);
                    
                    dbconnection.getConnection(function(err, connection) {  
                      connection.query(sqls, function(err, dbresultsets){
                        newuserid = dbresultsets.insertId;
                        sqls = "INSERT INTO tbl_customer (customer_name,user_id,no_of_students,display_name,logo_name,created_date,updated_date) "+
                               " values('"+username+"','"+newuserid+"','"+noofstudents+"','"+displayname+"','"+logoname+"','"+now+"','"+now+"')";
                        dbconnection.getConnection(function(err, connection) {
                          connection.query(sqls, function(err, res1){
                              newcustomerid = res1.insertId;
                              sqls = "INSERT INTO tbl_preferences (customer_id,user_id,time_zone,date_format,page_refresh,landing_page,site_report,created_date,updated_date) "+
                                      "(select '"+newcustomerid+"','"+newuserid+"',time_zone,date_format,page_refresh,landing_page,site_report,'"+now+"','"+now+"' from tbl_preferences where preference_id='1')";
                              connection.query(sqls, function(err, res1){  
                                  sqls = "UPDATE tbl_user SET customer_id = '"+newcustomerid+"' WHERE user_id='"+newuserid+"'";
                                  console.log("SQL1 :"+sqls);
                                  connection.query(sqls, function(err, res1){
                                    sqls = "INSERT INTO tbl_institute (customer_id,institute_name,created_date,updated_date) values "+
                                            "('"+newcustomerid+"','"+displayname+"','"+now+"','"+now+"')";
                                    console.log("institute SQL:"+sqls);
                                    connection.query(sqls, function(err, res1){
                                    });
                                  });
                              });
                          });            
                        });//end of insert query  
                      });
                    });
                }else{
                    msg = "User Already Exists";
                }     
            });//end of call getData function
        }//if validate username and password    
        else{
            msg = "Please fill username and password";
        } 
        res.redirect('/customer');  
    }]); //end of save user1 function 


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
