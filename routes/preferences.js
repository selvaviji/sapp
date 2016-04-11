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
  	/* GET msps listing. */
    router.get('/', isAuthenticated, function(req, res){
        var query;
        var results;
        var suname =req.session.uname;
        var suid =req.session.uid;
        var srid=req.session.rid;
        var scid = req.session.cid;
        console.log("SCID :"+scid);
        console.log("SRID :"+srid);
        if(scid == '0'){
            sql = "SELECT a.preference_id, b.customer_name,a.time_zone,a.date_format,a.page_refresh,a.landing_page,a.site_report,"+
              "a.created_date, a.updated_date,a.sms_status,a.video_status FROM tbl_preferences a "+ 
              "LEFT JOIN tbl_customer b ON a.customer_id=b.customer_id";
        }else{
            sql = "SELECT a.preference_id, b.customer_name,a.time_zone,a.date_format,a.page_refresh,a.landing_page,a.site_report,"+
              "a.created_date, a.updated_date,a.sms_status,a.video_status FROM tbl_preferences a,tbl_customer b "+ 
              "WHERE a.customer_id=b.customer_id and b.customer_id='"+scid+"'";
        }      
        console.log("SQL :"+sql);
        getSQLData(sql, function(dbresultsets){
            results = dbresultsets;
            res.render('preferences/index',{title:"Preferences List", sess_name: suname, sess_id: srid, datas: results});
        });
    });   

    /* Get Data */
    router.get('/getdata',isAuthenticated,function(req,res){
        var query;
        var results;
        var suname =req.session.uname;
        var suid =req.session.uid;
        var srid=req.session.rid;
        var scid = req.session.cid;
        var queryStr="";
        var updatedate=req.query.updated_date;
        var createddate=req.query.created_date;
        var queryStr = "";
        var cdate;
        if(updatedate.match("-")){
            cdate = moment(req.query.updated_date,'DD-MM-YYYY').format("YYYY-MM-DD");
            updatedate=cdate;
        }
        if(updatedate.match("/")){
            cdate = moment(req.query.updated_date,'DD/MM/YYYY').format("YYYY-MM-DD");
            updatedate=cdate;
        }
        if(createddate.match("/")){
            cdate = moment(req.query.created_date,'DD/MM/YYYY').format("YYYY-MM-DD");
            createddate=cdate;
        }
        if(createddate.match("-")){
            cdate = moment(req.query.created_date,'DD-MM-YYYY').format("YYYY-MM-DD");
            createddate=cdate;
        }
        
        if(req.query.customer_name != '' && req.query.customer_name != 'undefined' && req.query.customer_name != null){
            if(queryStr == ''){
                queryStr += " WHERE b.customer_name='"+req.query.customer_name+"'";
            }
        } 

        if(req.query.updated_date != ''){
            if(queryStr != ''){
                queryStr += " AND date_format(a.updated_date,'%Y-%m-%d')='"+updatedate+"'";
            }else{
                queryStr += " WHERE date_format(a.updated_date,'%Y-%m-%d')='"+updatedate+"'";
            }
        } 
           
        if(req.query.created_date != ''){
            if(queryStr != ''){
                queryStr += " AND date_format(a.created_date,'%Y-%m-%d')='"+createddate+"'";
            }else{
                queryStr += " WHERE date_format(a.created_date,'%Y-%m-%d')='"+createddate+"'";
            }
        } 
        if(scid != '0'){
            if(queryStr != ''){
                queryStr += " AND b.customer_id ='"+scid+"'";
            }else{
                queryStr += " WHERE b.customer_id ='"+scid+"'";
            }
        }    

        sql = "SELECT a.preference_id, b.customer_name,a.time_zone,a.date_format,a.page_refresh,a.landing_page,a.site_report,"+
              "a.created_date, a.updated_date,a.sms_status,a.video_status FROM tbl_preferences a "+ 
              "LEFT JOIN tbl_customer b ON a.customer_id=b.customer_id"+queryStr;
       
        console.log("index page triggered :"+sql);
        getSQLData(sql, function(dbresultsets){
            //console.log("Length :"+dbresultsets);
            results = dbresultsets;
            //console.log(results);
            res.send({ datas: results});
        });
    });

    /* back to main screen */
    router.get('/cancelAdd', function(req, res, next) {
        res.redirect('/');
    });


    /* new pins */
    router.get('/addpreference',isAuthenticated,function(req,res){
        var suname =req.session.uname;
        var srid=req.session.rid;
        res.render('preferences/newpreference',{title:"Preferences", sess_name: suname, sess_id: srid,});
    });  

    router.post('/delete',isAuthenticated,function(req,res){
        var suname =req.session.uname;
        var srid=req.session.rid;
        var sql = "DELETE FROM tbl_preferences WHERE preference_id in ("+req.body.recordids+")";
        getSQLData(sql, function(dbresultsets){
            msg = "Deleted Successfully";
        });
        res.redirect('/');
    });  

     router.get('/delete/:id',isAuthenticated,function(req,res){
        var suname =req.session.uname;
        var srid=req.session.rid;
        var sql = "DELETE FROM tbl_preferences WHERE preference_id in ("+req.params.id+")";
        getSQLData(sql, function(dbresultsets){
            msg = "Deleted Successfully";
        });
        res.redirect('/preferences');
    }); 

    router.get('/edit/:id',isAuthenticated,function(req, res){
        var suname =req.session.uname;
        var srid=req.session.rid;
        var id = req.params.id;
        var sql = "SELECT * FROM tbl_preferences WHERE preference_id = '"+id+"'";
        getSQLData(sql, function(dbresultsets){
            results = dbresultsets;
            res.render('preferences/editpreference',{title:"Edit Pin Details", sess_name: suname, sess_id: srid, data:results});
        });
     
    });  
      
    /*router.post('/update',isAuthenticated,function(req, res){
        var msg = "";
        if(req.body.preferenceid != ""){
            var pref = req.body;
            var timezone = pref.timezone;
            var dateformat = pref.dateformat;
            var pagerefresh = pref.pagerefresh;
            var landingpage = pref.landingpage;
            var sitereport = pref.sitereport;
            var pid = req.body.preferenceid;
            var now = moment().format("YYYY-MM-DD HH:mm:ss");
            
            var sqls = "UPDATE tbl_preferences SET time_zone='"+timezone+"',date_format='"+dateformat+"',page_refresh='"+pagerefresh+"',page_refresh='"+pagerefresh+"',landing_page='"+landingpage+"',site_report='"+sitereport+"',updated_date='"+now+"' WHERE preference_id = '"+pid+"'";
            getSQLData(sqls, function(dbresultsets){
               msg = "Pin Successfully Added";
            }); 
        }    
        res.redirect('/preferences');
    }); */ 

    router.post('/update',isAuthenticated,function(req, res){
        var msg = "";
        if(req.body.preferenceid != ""){
            var pref = req.body;
            var timezone = pref.timezone;
            var dateformat = pref.dateformat;
            var pagerefresh = pref.pagerefresh;
            var landingpage = pref.landingpage;
            var sitereport = pref.sitereport;
            var pid=req.body.preferenceid;
            var smsid=pref.sms_id;
            var videoid=pref.video_id;
            var now = moment().format("YYYY-MM-DD HH:mm:ss");
            
            var sqls = "UPDATE tbl_preferences SET time_zone='"+timezone+"',date_format='"+dateformat+"',page_refresh='"+pagerefresh+"',page_refresh='"+pagerefresh+"',landing_page='"+landingpage+"',site_report='"+sitereport+"',updated_date='"+now+"',sms_status='"+smsid+"',video_status='"+videoid+"' WHERE preference_id = '"+pid+"'";
            console.log("SQL :"+sqls);
            getSQLData(sqls, function(dbresultsets){
               msg = "Pin Successfully Added";
            }); 
        }   
        res.send("sucess");
    });  

    /* save preferences */
    router.post('/savepreference',isAuthenticated,function(req,res){

        var srid=req.session.rid;

        sqls = "select * from tbl_preferences where customer_id='0'";
        console.log("SQL :"+sqls);
        getSQLData(sqls, function(resultsets){
            if(resultsets == '1'){
                console.log("True triggered");
                res.redirect('/preferences');  
            }else{
                console.log("False triggered");
                var pref = req.body;
                var timezone = pref.timezone;
                var dateformat = pref.dateformat;
                var pagerefresh = pref.pagerefresh;
                var landingpage = pref.landingpage;
                var sitereport = pref.sitereport;
                var msg="";
            
                var now = moment().format("YYYY-MM-DD HH:mm:ss");
                sqls = "INSERT INTO tbl_preferences (user_id,time_zone,date_format,page_refresh,landing_page,site_report,created_date,updated_date) "+
                    " values('1','"+timezone+"','"+dateformat+"','"+pagerefresh+"','"+landingpage+"','"+sitereport+"','"+now+"','"+now+"')";
                console.log("INS SQL:"+sqls);
                getSQLData(sqls, function(dbresultsets){
                    msg = "Preference Successfully Added";
                });//end of insert query  
                res.redirect('/preferences'); 
            }     
        });//end of else statement        
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
 