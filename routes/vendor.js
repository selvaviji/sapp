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

        if(srid == '1'){
        sql = "SELECT a.msp_id, b.customer_name, a.msp_name, a.msp_desc, "+
              "a.created_date, a.updated_date FROM tbl_msp a "+ 
              "LEFT JOIN tbl_customer b ON a.customer_id=b.customer_id";
        }else{
            sql = "SELECT a.msp_id, b.customer_id, b.customer_name, a.msp_name, a.msp_desc, "+
              "a.created_date, a.updated_date FROM tbl_msp a,tbl_customer b "+ 
              "WHERE a.customer_id=b.customer_id and a.user_id='"+suid+"'";
        }       

        getSQLData(sql, function(dbresultsets){
            results = dbresultsets;
            console.log("Rows :"+results);
            res.render('vendor/index',{title:"MSPList", sess_name: suname, sess_id: srid, datas: results});
        });
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
        var srid=req.session.rid;
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
                 if(srid == '1'){
                    queryStr += " WHERE b.customer_name='"+req.query.customer_name+"'";
                 }else{
                    queryStr += " AND b.customer_name='"+req.query.customer_name+"'";
                 }   
            }
        } 
        if(req.query.msp_name != '' && req.query.msp_name != 'undefined' && req.query.msp_name != null){
            if(queryStr != ''){
                queryStr += " AND a.msp_name='"+req.query.msp_name+"'";
            }
            else
            {
                queryStr = " WHERE a.msp_name='"+req.query.msp_name+"'"; 
            }
        } 
         if(req.query.msp_desc != '' && req.query.msp_desc != 'undefined' && req.query.msp_desc != null){
            if(queryStr != ''){
                queryStr += " AND a.msp_desc='"+req.query.msp_desc+"'";
            }
            else
            {
                queryStr = " WHERE a.msp_desc='"+req.query.msp_desc+"'"; 
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

        if(srid == '1'){
            sql = "SELECT a.msp_id, b.customer_name, a.msp_name, a.msp_desc, "+
                    "a.created_date, a.updated_date FROM tbl_msp a "+ 
                    "LEFT JOIN tbl_customer b ON a.customer_id=b.customer_id"+queryStr;
        }else{
            sql = "SELECT a.msp_id, b.customer_id, b.customer_name, a.msp_name, a.msp_desc, "+
                    "a.created_date, a.updated_date FROM tbl_msp a,tbl_customer b "+ 
                    "WHERE a.customer_id=b.customer_id and a.user_id='"+suid+"'"+queryStr;
        }  
        console.log("display"+sql);     
        getSQLData(sql, function(dbresultsets){
            results = dbresultsets;
            res.send({datas: results});
        });
    });


    /* new msps */
    router.get('/addmsp',isAuthenticated,function(req,res){
        var suname =req.session.uname;
        var srid=req.session.rid;
        res.render('vendor/newmsp',{title:"MSP", sess_name: suname, sess_id: srid,});
    });  

    router.post('/delete',isAuthenticated,function(req,res){
        var suname =req.session.uname;
        var srid=req.session.rid;
        var sqls = "DELETE FROM tbl_msp WHERE msp_id in ("+req.body.recordids+")";
        getSQLData(sqls, function(resultsets){
            msg = "Deleted Successfully";
        });
        res.redirect('/');
    });  

    router.get('/edit/:id',isAuthenticated,function(req, res){
        var suname =req.session.uname;
        var srid=req.session.rid;
        var id = req.params.id;
        var sql = "SELECT * FROM tbl_msp WHERE msp_id = '"+id+"'";
        getSQLData(sql, function(dbresultsets){
            results = dbresultsets;
            res.render('vendor/editmsp',{title:"EditMSP", sess_name: suname, sess_id: srid, data:results});
        });
     
    });  
      
    router.post('/update',isAuthenticated,function(req, res){
        var msg = "";
        if(req.body.mspname != ""){
            var mname = req.body.mspname;
            var mdesc = req.body.mspdesc;
            var mid = req.body.mspid;
            var now = moment().format("YYYY-MM-DD HH:mm:ss");
            
            var sqls = "UPDATE tbl_msp SET msp_name='"+mname+"',msp_desc='"+mdesc+"',updated_date='"+now+"' WHERE msp_id = '"+mid+"'";
            getSQLData(sqls, function(resultsets){
                  msg = "msp Successfully Added";
            }); 
        }    
        res.redirect('/vendor');
    });  

     /* save msp1 */
    router.post('/savemsp',isAuthenticated,function(req,res){
        var suname =req.session.uname;
        var suid =req.session.uid;
        var srid=req.session.rid;
        var scid =req.session.cid;

        var msp = req.body;
        var mspname = msp.mspname;
        var mspdesc = msp.mspdesc;
        
        var msg="";
        if(mspname != ""){
          sql = "SELECT msp_name "+
                    "FROM tbl_msp WHERE msp_name ='"+mspname+"'";
          getSQLData(sql, function(resultsets){
            if(Object.keys(resultsets).length == 0){
                var now = moment().format("YYYY-MM-DD HH:mm:ss");
                sqls = "INSERT INTO tbl_msp (customer_id,user_id,msp_name,msp_desc,created_date,updated_date) "+
                " values('"+scid+"','"+suid+"','"+mspname+"','"+mspdesc+"','"+now+"','"+now+"')";
                
                getSQLData(sqls, function(resultsets){
                    msg = "msp Successfully Added";
                });//end of insert query  
            }else{
              msg = "msp Already Exists";
            }     
          });//end of call getData function  
        }
        res.redirect('/vendor');         
    }); //end of save msp1 function    
    
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
 