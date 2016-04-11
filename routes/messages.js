var express = require('express');
var router = express.Router();
var moment = require('moment');


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
        var sql = "SELECT * FROM tbl_message"; 
        getSQLData(sql, function(dbresultsets){
            results = dbresultsets;
            //console.log("results :"+results);
            res.render('messages/index',{title:"Messages", sess_name: req.session.uname, sess_id: req.session.rid, datas: results});
        });
    });   

    router.get('/compose', isAuthenticated, function(req, res){
        res.render('messages/compose',{title:"Messages", sess_name: req.session.uname, sess_id: req.session.rid});
        
    });
    router.get('/edit/:id',isAuthenticated,function(req, res){
        var sql = "SELECT FROM tbl_message WHERE id = '"+req.params.id+"'";
        getSQLData(sql, function(dbresultsets){
            results = dbresultsets;
            res.render('messages/edit',{title:"Edit",sess_name: req.session.uname, sess_id: req.session.rid,data:results});
        });
    });  

    router.post('/update',isAuthenticated,function(req, res){
          var now = moment().format("YYYY-MM-DD HH:mm:ss");
          

          sql = "UPDATE tbl_message SET msg_subject = '"+req.body.subject+"',msg_content = '"+req.body.content+"', updated_date = '"+now+"' WHERE id = '"+req.body.id+"'";
          console.log("Edit SQL :"+sql);
          getSQLData(sql, function(resultsets){
              if(resultsets.length > 0){
                    msg = "Updated Successfully";
              }
              res.redirect('/institute');  
          });
    });  

    router.get('/getclass',isAuthenticated,function(req, res){
          var now = moment().format("YYYY-MM-DD HH:mm:ss");
          sql = "select id as 'class_id', class_name from tbl_class where class_status='0' and institute_id ='"+req.session.cid+"'";
          console.log("Edit SQL :"+sql);
          getSQLData(sql, function(resultsets){
            results = resultsets;
            res.send('messages/compose',{classdata: results});
          });
    }); 

    router.post('/getclass',isAuthenticated,function(req, res){
          var now = moment().format("YYYY-MM-DD HH:mm:ss");
          //if(req.body.classid=='all'){
            sql = "select id as 'class_id', class_name from tbl_class where class_status='0' and institute_id ='"+req.session.cid+"'";
          //}else{
           // sql = "select id as 'class_id', class_name from tbl_class where class_status='0' and class_id='"+req.body.classid+"' and institute_id ='"+req.session.cid+"'";
          //}
          console.log("Edit SQL :"+sql);
          getSQLData(sql, function(resultsets){
            results = resultsets;
            res.send('messages/compose',{classdata: results});
          });
    });  

    router.post('/composesave',isAuthenticated,function(req, res){
      $from = req.body.msg_from;
      $class = req.body.class_id;
      $student = req.body.student_id;
      $subject = req.body.msg_subject;
      $content = req.body.msg_content;
      sql = "insert into tbl_message_master (institute_id,msg_from,msg_subject,msg_content) values ('"+req.body.cid+"','"+$from+"','"+subject+"','"+$content+"')";
    });
      
    router.post('/getstudent',isAuthenticated,function(req, res){
          var now = moment().format("YYYY-MM-DD HH:mm:ss");
          if(req.body.classid=='all'){
            sql = "select id as 'student_id', student_name from tbl_student where status='0' and institute_id ='"+req.session.cid+"'";
          }else{
            sql = "select id as 'student_id', student_name from tbl_student where status='0' and class_id='"+req.body.classid+"' and institute_id ='"+req.session.cid+"'";  
          }
          
          console.log("Edit SQL :"+sql);
          getSQLData(sql, function(resultsets){
            results = resultsets;
            res.send('messages/compose',{studentdata: results});
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
