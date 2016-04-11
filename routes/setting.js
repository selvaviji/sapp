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

module.exports = function(passport,dbconnection) {
  	/*GET users listing.*/
    router.get('/', isAuthenticated, function(req, res){
        var query;
        var results;
        var suname =req.session.uname;
        var suid =req.session.uid;
        var scid =req.session.cid;
        var srid=req.session.rid;
        var qry="";
        var msg="";
        sql = "SELECT a.user_id, a.pass_word "+
              "FROM tbl_user a "+
              "WHERE a.user_id = '"+suid+"'";  
        getSQLData(sql, function(dbresultsets){
            results = dbresultsets;
            res.render('setting/index',{title:"UserList", sess_name: suname, sess_id: srid,sess_uid: suid,sess_cid: scid, datas: results,message:msg});
        });
    });
      
    router.post('/update',isAuthenticated,function(req, res){
        console.log("Update triggered");
        var msg = "";
        var newpwd = req.body.newpassword;
        //console.log("newPWD :"+newpwd);
        var uid = req.body.userid;
        //console.log("UID :"+uid);
        var now = moment().format("YYYY-MM-DD HH:mm:ss");
        var sqls = "UPDATE tbl_user SET pass_word='"+newpwd+"',updated_date='"+now+"' WHERE user_id = '"+uid+"'";
        console.log("SQLs :"+sqls);
        getSQLData(sqls, function(dbresultsets){
            msg = "Password Successful Changed";
            res.send({'message': 'Password Successfully Changed.'});    
            //res.flash({"message":msg});  
        });
        //console.log("Msg :"+msg);
    });  

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