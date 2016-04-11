var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt-nodejs');
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


module.exports = function(passport,dbconnection) {
  	/* GET users listing. */
    router.get('/', isAuthenticated, function(req, res){
        var query;
        var results;
        var suname =req.session.uname;
        var suid =req.session.uid;
        var scid =req.session.cid;
        var srid=req.session.rid;
        var qry="";
        //console.log("SCID :"+scid);
        if(srid == '1'){
          qry = "AND SUBQ.role_id <> '1'";
        }else if(srid == '2' && scid != null){
          qry = "AND SUBQ.role_id <> '1' and SUBQ.customer_id='"+scid+"'";
        }
        
        sql = "SELECT SUBQ.*,c.role_name FROM (SELECT a.user_id, a.user_name, a.pass_word,a.user_status, a.role_id, "+
              "a.created_date, a.updated_date, a.customer_id, b.customer_name, b.logo_name, "+
              "b.display_name FROM tbl_user a "+
              "LEFT JOIN tbl_customer b ON a.user_id = b.user_id) SUBQ,tbl_role c WHERE SUBQ.role_id=c.role_id "+qry;  
        
        getSQLData(sql, function(dbresultsets){
            results = dbresultsets;
            res.render('users/index',{title:"UserList", sess_name: suname, sess_id: srid,sess_uid: suid,sess_cid: scid, datas: results});
        });
    });   

    /* GET userrole listing */
    router.get('/userroles', isAuthenticated, function(req,res){
        var sql = "SELECT role_id,role_name from tbl_role where role_id <> '1'";
        getSQLData(sql, function(resultsets){
           results = resultsets;
           res.send({roledata:results});
        })
    });

    /* GET LandingPage listing */
    router.get('/landingpage', isAuthenticated, function(req,res){
        var sql = "SELECT id,landing_name from tbl_landing_master";
        getSQLData(sql, function(resultsets){
           results = resultsets;
           res.send({landingdata:results});
        })
    });

    /* back to main screen */
    router.get('/cancelAdd', function(req, res, next) {
        res.redirect('/');
    });

    router.get('/getdata', function(req, res, next) {
        var query;
        var results;
        var suname =req.session.uname;
        var suid =req.session.uid;
        var scid =req.session.cid;
        var srid=req.session.rid;
        var qry="";
        var queryStr="";
        var updatedate=req.query.updated_date;
        var createddate=req.query.created_date;
        var queryStr = "";
        var cdate;
        //console.log("Customer :"+req.query.customer_name);
        if(updatedate.match("-")){
            updatedate = moment(req.query.updated_date,'DD-MM-YYYY').format("YYYY-MM-DD");
            
        }
        if(updatedate.match("/")){
            updatedate = moment(req.query.updated_date,'DD/MM/YYYY').format("YYYY-MM-DD");
        }

        if(createddate.match("/")){
            createddate = moment(req.query.created_date,'DD/MM/YYYY').format("YYYY-MM-DD");
        }

        if(createddate.match("-")){
            createddate = moment(req.query.created_date,'DD-MM-YYYY').format("YYYY-MM-DD");
        }

        if(req.query.user_name != ''){
            if(queryStr == ''){
              queryStr = " WHERE a.user_name ='"+req.query.user_name+"'";
            }
        }     
        if(req.query.updated_date != ''){
            if(queryStr != ''){
              queryStr += " AND date_format(a.updated_date,'%Y-%m-%d')='"+updatedate+"'";
            }else{
              queryStr = " WHERE date_format(a.updated_date,'%Y-%m-%d')='"+updatedate+"'";
            }
        } 
           
        if(req.query.created_date != ''){
            if(queryStr != ''){
              queryStr += " AND date_format(a.created_date,'%Y-%m-%d')='"+createddate+"'";
            }else{
              queryStr = " WHERE date_format(a.created_date,'%Y-%m-%d')='"+createddate+"'";
            }
        } 

        //console.log("SCID :"+scid);
        if(srid == '1'){
          qry = "WHERE role_id <> '1'";
        }else if(srid == '2' && scid != null){
          qry = "WHERE role_id <> '1' and customer_id='"+scid+"'";
        }
        sql = "SELECT * FROM (SELECT a.user_id, a.user_name, a.pass_word,a.user_status, a.role_id, "+
              "a.created_date, a.updated_date, a.customer_id, b.customer_name, b.logo_name, "+
              "b.display_name FROM tbl_user a "+
              "LEFT JOIN tbl_customer b ON a.user_id = b.user_id"+queryStr+") SUBQ "+qry;  
        getSQLData(sql, function(dbresultsets){
            results = dbresultsets;
            res.send({datas: results});
        });
    });


    /* new users */
    router.get('/adduser',isAuthenticated,function(req,res){
        var suname =req.session.uname;
        var suid =req.session.uid;
        var scid =req.session.cid;
        var srid=req.session.rid;
        res.render('users/newuser',{title:"User", sess_name: suname, sess_id: srid,sess_uid: suid,sess_cid: scid});
    });  

    router.post('/delete',isAuthenticated,function(req,res){
        var suname =req.session.uname;
        var srid=req.session.rid;
        var sql = "DELETE FROM tbl_user WHERE user_id in ("+req.body.recordids+")";
        getSQLData(sql, function(dbresultsets){
            if(dbresultsets.length > 0){
              msg = "Deleted Successfully";
            }
        });
        res.redirect('/');
    });  

    router.get('/edit/:id',isAuthenticated,function(req, res){
        var suname =req.session.uname;
        var suid =req.session.uid;
        var scid =req.session.cid;
        var srid=req.session.rid;
        var id = req.params.id;
        var sql = "SELECT a.*,b.time_zone,b.date_format,b.page_refresh,b.landing_page,b.site_report FROM tbl_user a,tbl_preferences b WHERE a.user_id=b.user_id and a.user_id = '"+id+"'";
        getSQLData(sql, function(dbresultsets){
            results = dbresultsets;
            res.render('users/edit-user',{title:"EditUser", sess_name: suname, sess_id: srid,sess_uid: suid, sess_cid: scid, data:results});
        });
    });  
      
    router.post('/update',isAuthenticated,function(req, res){
        var msg = "";

        var uname = req.body.username;
        var pword = req.body.password;
        var uid = req.body.userid;
        var rid = req.body.user_type;
        timezone = req.body.timezone;
        dateformat=req.body.dateformat;
        pagerefresh=req.body.pagerefresh;
        landingpage=req.body.landingpage;
        var now = moment().format("YYYY-MM-DD HH:mm:ss");
        
        var sqls = "UPDATE tbl_user SET user_name='"+uname+"',pass_word='"+pword+"',role_id='"+rid+"',updated_date='"+now+"' WHERE user_id = '"+uid+"'";
        console.log("SQLs :"+sqls);
        getSQLData(sqls, function(dbresultsets){
            //if(dbresultsets.changedRows > 0){
                sql = "UPDATE tbl_preferences SET time_zone='"+timezone+"',date_format='"+dateformat+"',page_refresh='"+pagerefresh+"',landing_page='"+landingpage+"' WHERE user_id = '"+uid+"'";
                console.log("SQL :"+sql);
                getSQLData(sql,function(resultset){
                    msg = "User Successfully";      
                });
                console.log(msg);
            //}
        });
        res.redirect('/users');
    });  

   
    
     /* save user1 */
    router.post('/saveuser',isAuthenticated,function(req,res){
        var suid =req.session.uid;
        var scid =req.session.cid;
        var srid=req.session.rid;
        
        var user = req.body;
        var username = user.username;
        var password = user.password;
        var usertype = user.user_type;
        var customerid = user.customer_id;
        timezone = req.body.timezone;
        dateformat=req.body.dateformat;
        pagerefresh=req.body.pagerefresh;
        landingpage=req.body.landingpage;
        var msg="";
        sql = "SELECT user_name "+
                  "FROM tbl_user WHERE user_name ='"+username+"'";
        dbconnection.getConnection(function(err, connection) {
            connection.query(sql, function(err, resultsets){          
                if(Object.keys(resultsets).length == 0){
                    var now = moment().format("YYYY-MM-DD HH:mm:ss");
                    sqls = "INSERT INTO tbl_user (user_name,pass_word,customer_id,role_id,user_status,created_date,updated_date) "+
                            " VALUES('"+username+"','"+password+"','"+customerid+"','"+usertype+"','0','"+now+"','"+now+"')";
                    console.log("SQLs :"+sqls);
                    connection.query(sqls, function(err, results){          
                        msg = "User Successfully Added";
                        newId = results.insertId;
                        sql = "INSERT INTO tbl_preferences (user_id,time_zone,date_format,page_refresh,landing_page) "+
                                " VALUES('"+newId+"','"+timezone+"','"+dateformat+"','"+pagerefresh+"','"+landingpage+"')";
                        console.log("SQL :"+sql);
                        connection.query(sql, function(err, results){          
                            msg = "User Successfully Added";
                        });      
                    });
                }else{
                    msg = "User Already Exists";
                }     
                res.redirect('/users');
            });//end of call getData function
            connection.release();
        });             
    }); //end of save user1 function  


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