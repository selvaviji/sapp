var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt-nodejs');
var moment = require('moment');
var isAuthenticated = function (req, res, next) {
    // if msp is authenticated in the session, call the next() to call the next request handler 
    // Passport adds this method to request object. A middleware is allowed to add properties to
    // request and response objects
    if (req.isAuthenticated())
      return next();
    // if the msp is not authenticated then redirect him to the login page
    res.redirect('/');
}


module.exports = function(passport,dbconnection) {
  	//console.log("pindetails triggered");
    

    /* GET msps listing. */
    router.get('/', isAuthenticated, function(req, res){
        var query;
        var results;
        var suname =req.session.uname;
        var suid =req.session.uid;
        var srid=req.session.rid;
        sql = "SELECT a.id, a.pin_name, a.pin_scode,a.pin_desc,"+
              "a.updated_date FROM tbl_pinmaster a ";
          
        //console.log("index page triggered :"+sql);
        getSQLData(sql, function(dbresultsets){
            results = dbresultsets;
            res.render('pinmaster/index',{title:"PinMaster List", sess_name: suname, sess_id: srid, datas: results});
        });
    });   

    /* back to main screen */
    router.get('/cancelAdd', function(req, res, next) {
        res.redirect('/');
    });


    /* new pins */
    router.get('/add',isAuthenticated,function(req,res){
        var suname =req.session.uname;
        var srid=req.session.rid;
        res.render('pinmaster/new',{title:"Pin Details", sess_name: suname, sess_id: srid,});
        //res.render('msps/create-msp',{title:"msp"});
    });  

    router.post('/delete',isAuthenticated,function(req,res){
        var suname =req.session.uname;
        var srid=req.session.rid;
        //console.log("Delete pin :"+req.body.recordids);
        var sql = "DELETE FROM tbl_pinmaster WHERE id in ("+req.body.recordids+")";
        //console.log("Delete SQL :"+sql);
        getSQLData(sql, function(dbresultsets){
          msg = "Deleted Successfully";
        });
        res.redirect('/pinmaster');
    });  

    router.get('/delete/:id',isAuthenticated,function(req,res){
        var suname =req.session.uname;
        var srid=req.session.rid;
        //console.log("Delete pin :"+req.body.recordids);
        var sql = "DELETE FROM tbl_pinmaster WHERE id in ("+req.params.id+")";
        //console.log("Delete SQL :"+sql);
        getSQLData(sql, function(dbresultsets){
          msg = "Deleted Successfully";
        });
        res.redirect('/pinmaster');
    });  


    router.get('/edit/:id',isAuthenticated,function(req, res){
        var suname =req.session.uname;
        var srid=req.session.rid;
        var id = req.params.id;
        
        var sql = "SELECT * FROM tbl_pinmaster WHERE id = '"+id+"'";
        getSQLData(sql, function(dbresultsets){
            results = dbresultsets;
            res.render('pinmaster/edit',{title:"Edit Pin Details", sess_name: suname, sess_id: srid, data:results});
        });
     
    });  
      
    router.post('/update',isAuthenticated,function(req, res){
        //var input = JSON.stringify(req.body);
        //console.log("Update Triggered :"+input);
        var msg = "";
        if(req.body.pinname != ""){
            var pname = req.body.pinname;
            var pscode = req.body.pinscode;
            var pdesc = req.body.pindesc;
            var pid = req.body.pid;
            var now = moment().format("YYYY-MM-DD HH:mm:ss");
            
            var sqls = "UPDATE tbl_pinmaster SET pin_name='"+pname+"',pin_scode='"+pscode+"',pin_desc='"+pdesc+"',updated_date='"+now+"' WHERE id = '"+pid+"'";
            getSQLData(sqls, function(resultsets){
                msg = "Pin Successfully Added";
            }); 
        }    
        res.redirect('/pinmaster');
    });  

    
     /* save msp1 */
    router.post('/save',isAuthenticated,function(req,res){
        //console.log("server side savemsp triggered");
       
        var pinname = req.body.pinname;
        var pscode = req.body.pinscode;
        var pindesc = req.body.pindesc;
        

        var msg="";
        if(pinname != ""){
          sql = "SELECT pin_name FROM tbl_pinmaster WHERE pin_name ='"+pinname+"'";
            getSQLData(sql, function(resultsets){
                if(Object.keys(resultsets).length == 0){
                    var now = moment().format("YYYY-MM-DD HH:mm:ss");
                    sqls = "INSERT INTO tbl_pinmaster (pin_name,pin_scode,pin_desc,created_date,updated_date) "+
                    " values('"+pinname+"','"+pscode+"','"+pindesc+"','"+now+"','"+now+"')";
                    //console.log("SQL :"+sqls);
                    dbconnection.getConnection(function(err, connection) {
                        connection.query(sqls, function(err, res){
                            if (err) {
                              return connection.rollback(function() {
                                throw err;
                              });
                            }  
                            connection.commit(function(err) {
                              if (err) {
                                return connection.rollback(function() {
                                  throw err;
                                });
                              }
                              msg = "Pin Successfully Added";
                            });
                        });
                        connection.release();    
                    });//end of insert query  
                }else{
                  msg = "Pin Already Exists";
                }     
            
            });//end of call getData function  
        }
        res.redirect('/pinmaster');         
    }); //end of save function    
    
     /* callback function */
    function getSQLData(sqls, cb) { 
        //console.log("sqls :"+sqls);
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
 