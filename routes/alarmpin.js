var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt-nodejs');
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
        if(srid == '1' || srid == '2'){
            sql = "SELECT a.alarmpin_id, b.customer_id, b.customer_name, a.alarmpin_no, a.alarmpin_name, a.alarmpin_sc, a.alarmpin_status, a.alarmpin_priority,a.alarmpin_tt,"+
              "a.created_date, a.updated_date, a.curl_cmd FROM tbl_alarmpin a "+ 
              "LEFT JOIN tbl_customer b ON a.customer_id=b.customer_id WHERE a.user_id='1'";
        }else{
            sql = "SELECT a.alarmpin_id, b.customer_id, b.customer_name, a.alarmpin_no, a.alarmpin_name, a.alarmpin_sc, a.alarmpin_status, a.alarmpin_priority,a.alarmpin_tt,"+
              "a.created_date, a.updated_date, a.curl_cmd FROM tbl_alarmpin a,tbl_customer b "+
              "WHERE a.customer_id=b.customer_id and a.user_id='"+suid+"'";
        }      
        console.log("SQL :"+sql);
        getSQLData(sql, function(dbresultsets){
            results = dbresultsets;
            res.render('alarmpin/index',{title:"AlarmPin", sess_name: suname, sess_id: srid, datas: results,customerid: custid});
        });
    });   

    /* SEARCH */
    router.post('/search', isAuthenticated, function(req,res){
        var query;
        var results;
        var suname =req.session.uname;
        var suid =req.session.uid;
        var srid=req.session.rid;
        var custid = req.body.customer_id;
        var querystr = "";
        var custstr = "";
        

        if(custid != 'undefined' && custid != '0' && custid != ''){
            querystr = " AND b.customer_id='"+custid+"'";
            custstr = " WHERE b.customer_id='"+custid+"'";
        }else if(custid == '0'){
            custstr = " WHERE a.user_id = '1'";
        }

        if(srid == '1' || srid == '2'){
            sql = "SELECT a.alarmpin_id, b.customer_id, b.customer_name, a.alarmpin_no, a.alarmpin_name, a.alarmpin_sc, a.alarmpin_status, a.alarmpin_priority,a.alarmpin_tt,"+
              "a.created_date, a.updated_date, a.curl_cmd FROM tbl_alarmpin a "+ 
              "LEFT JOIN tbl_customer b ON a.customer_id=b.customer_id "+custstr;
        }else{
            sql = "SELECT a.alarmpin_id, b.customer_id, b.customer_name, a.alarmpin_no, a.alarmpin_name, a.alarmpin_sc, a.alarmpin_status, a.alarmpin_priority,a.alarmpin_tt,"+
              "a.created_date, a.updated_date, a.curl_cmd FROM tbl_alarmpin a,tbl_customer b "+
              "WHERE a.customer_id=b.customer_id and a.user_id='"+suid+"'"+querystr;
        }      
        console.log("search triggered :"+sql);
        getSQLData(sql, function(dbresultsets){
            results = dbresultsets;
            res.render('alarmpin/index',{title:"AlarmPin", sess_name: suname, sess_id: srid, datas: results,customerid: custid});
        });
    });    
    /* GET priorities listing */
    router.get('/priorities', isAuthenticated, function(req,res){
        var sql = "SELECT pin_id,pin_name from tbl_pindetails";
        getSQLData(sql, function(resultsets){
           results = resultsets;
           res.send({custdata:results});
        });
    });


    /* back to main screen */
    router.get('/cancelAdd', function(req, res, next) {
        res.redirect('/');
    });


    /* new pins */
    router.get('/addalarmpin',isAuthenticated,function(req,res){
        var suname =req.session.uname;
        var srid=req.session.rid;
        res.render('alarmpin/newalarmpin',{title:"New AlarmPin", sess_name: suname, sess_id: srid,});
    });  

    router.post('/delete',isAuthenticated,function(req,res){
        var suname =req.session.uname;
        var srid=req.session.rid;
        if(req.body.recordids != ''){
            var sql = "DELETE FROM tbl_alarmpin WHERE alarmpin_id in ("+req.body.recordids+")";
            //console.log("Delete SQL :"+sql);
            getSQLData(sql, function(dbresultsets){
                msg = "Deleted Successfully";
            });
        }    
        res.redirect('/');
    });  

    router.get('/edit/:id',isAuthenticated,function(req, res){
        var suname =req.session.uname;
        var srid=req.session.rid;
        var id = req.params.id;
        var sql = "SELECT * FROM tbl_alarmpin WHERE alarmpin_id = '"+id+"'";
        getSQLData(sql, function(dbresultsets){
            results = dbresultsets;
            res.render('alarmpin/editalarmpin',{title:"Edit AlarmPin Details", sess_name: suname, sess_id: srid, data:results});
        });
     
    });  
      
    router.post('/update',isAuthenticated,function(req, res){
        var msg = "";
        if(req.body.alarmpinname != ""){
            var alarmpinno = req.body.alarmpinno;
            var alarmpinname = req.body.alarmpinname;
            var alarmpinsc = req.body.alarmpinsc;//short code
            var alarmpinstatus = req.body.alarmpinstatus;//visible or disabel
            var alarmpinpriority = req.body.alarmpinpriority;//alarmpin priority
            var alarmpintt = req.body.alarmpintt;//trouble ticke
            var pid = req.body.alarmpinid;
            var now = moment().format("YYYY-MM-DD HH:mm:ss");
            var curl = req.body.curl;
            var sqls = "UPDATE tbl_alarmpin SET alarmpin_no='"+alarmpinno+"',alarmpin_name='"+alarmpinname+"',alarmpin_sc='"+alarmpinsc+"',alarmpin_status='"+alarmpinstatus+"',alarmpin_priority='"+alarmpinpriority+"',alarmpin_tt='"+alarmpintt+"',updated_date='"+now+"',curl_cmd='"+curl+"' WHERE alarmpin_id = '"+pid+"'";
            getSQLData(sqls, function(resultsets){
                res.send('Saved Successfully');
            })    
        }    
        
    });  

       
     /* save msp1 */
    router.post('/savealarmpin',isAuthenticated,function(req,res){
        var suid =req.session.uid;
        var alarmpinno = req.body.alarmpinno;
        var alarmpinname = req.body.alarmpinname;
        var alarmpinsc = req.body.alarmpinsc;//short code
        var alarmpinstatus = req.body.alarmpinstatus;//visible or disabel
        var alarmpinpriority = req.body.alarmpinpriority;//alarmpin priority
        var alarmpintt = req.body.alarmpintt;//trouble ticke
        var now = moment().format("YYYY-MM-DD HH:mm:ss");

        var msg="";
        if(alarmpinno != "" && alarmpinname != ""){
          sql = "SELECT alarmpin_name "+
                    "FROM tbl_alarmpin WHERE alarmpin_name ='"+alarmpinname+"'";
          getSQLData(sql, function(resultsets){
            if(Object.keys(resultsets).length == 0){
                var now = moment().format("YYYY-MM-DD HH:mm:ss");
                sqls = "INSERT INTO tbl_alarmpin (user_id,alarmpin_no,alarmpin_name,alarmpin_sc,alarmpin_status,alarmpin_priority,alarmpin_tt,created_date,updated_date) "+
                " values('"+suid+"','"+alarmpinno+"','"+alarmpinname+"','"+alarmpinsc+"','"+alarmpinstatus+"','"+alarmpinpriority+"','"+alarmpintt+"','"+now+"','"+now+"')";
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
                          msg = "AlarmPin Successfully Added";
                        });
                    });
                    connection.release();
                }); //end of insert query     
            }else{
              msg = "AlarmPin Already Exists";
            }     
            
          });//end of call getData function  
        }
        res.redirect('/alarmpin');         
    }); //end of save function    
    
     
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
 