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

module.exports = function(passport,connection) {
    console.log("assign ticket triggered triggered");
    router.get('/', isAuthenticated, function(req, res){
    var suname =req.session.uname;
    var suid =req.session.uid;
    var srid=req.session.rid;
    var query;
    var results;
    var fields;
    var fielddata;
    var suname =req.session.uname;
    var srid=req.session.rid;
    var taskval=req.body.taskval;
    console.log("taskvalue"+taskval);
     
    var sql = "SELECT user_name,user_id from tbl_user WHERE role_id='"+2+"'"; 
      console.log("trouble ticket :"+sql);       
      getSQLData(sql, function(dbresultsets){
            fields = dbresultsets;
            console.log("fields"+fields);
        });
      
    var sql = "SELECT ticket_id, alarmid,site_id,ticket_desc,reported_by,ticket_desc,ticket_state,ticket_priority,created_date,closed_date,assign_status,assign_date "+
              "FROM tbl_tt_master where ticket_state='opened'"; 
    
      console.log("trouble ticket :"+sql);       
        getSQLData(sql, function(dbresultsets){
            results = dbresultsets;
                        res.render('assignticket/index',{title:"AlarmLists", sess_name: suname, sess_id: srid,datas:results,fielddata:fields});
      });
    });

  router.post('/assigntickt',isAuthenticated,function(req,res){
    console.log("assign ticket triggered");
        var suname =req.session.uname;
        var srid=req.session.rid;
        console.log("checkbox val :"+req.body.recordids);
        console.log("dropdownid:"+req.body.idval);
        var now = moment().format("YYYY-MM-DD HH:mm:ss");
       
        var sql="update tbl_tt_master set assign_status='"+1+"',assign_date='"+now+"' where ticket_id in ("+req.body.recordids+")";
        console.log("update SQL :"+sql);
        connection.query(sql, function(err, res){
          if (err) {
            throw err;
                  }  
          if(res.affectedRows > 0){
            console.log('success!');
            msg = "updates Successfully";
          }
        });
         var sql="insert into tbl_assign_task(user_id,ticket_id,status,site_id,assign_date) select a.user_id,b.ticket_id,b.assign_status,b.site_id,b.assign_date from tbl_user a,tbl_tt_master b where a.user_id='"+req.body.idval+"' and b.assign_status='"+1+"'";
        console.log("insert into"+sql);
         connection.query(sql, function(err, res){
          if (err) {
            throw err;
          }  
          if(res.affectedRows > 0){
            console.log('success!');
            msg = "updates Successfully";
          }
        });
         var sql="insert into tbl_tt_child(assign_to,ticket_id,recorded_date) select a.user_id,b.ticket_id,b.assign_date from tbl_user a,tbl_tt_master b where a.user_id='"+req.body.idval+"' and b.assign_status='"+1+"'";
        console.log("insert into"+sql);
         connection.query(sql, function(err, res){
          if (err) {
            throw err;
          }  
          if(res.affectedRows > 0){
            console.log('success!');
            msg = "updates Successfully";
          }
        });
        res.redirect('/assignticket/index');
        
    });  

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