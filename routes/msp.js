var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt-nodejs');
var moment = require('moment');
var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated())
      return next();
    // if the msp is not authenticated then redirect him to the login page
    res.redirect('/');
}


module.exports = function(passport,dbconnection) {
  	/* GET msps listing. */
    router.get('/', isAuthenticated, function(req, res){
        var srid=req.session.rid;

        if(srid == '1' || srid == '2'){
        sql = "SELECT a.msp_id, b.customer_name, a.msp_name, a.msp_contact_no,a.msp_contact_email,a.msp_contact_name,a.msp_desc, "+
              "a.created_date, a.updated_date FROM tbl_msp a "+ 
              "LEFT JOIN tbl_customer b ON a.customer_id=b.customer_id";
        }else{
            sql = "SELECT a.msp_id, b.customer_id, b.customer_name, a.msp_name,a.msp_contact_no,a.msp_contact_email,a.msp_contact_name,a.msp_desc, "+
              "a.created_date, a.updated_date FROM tbl_msp a,tbl_customer b "+ 
              "WHERE a.customer_id=b.customer_id and a.user_id='"+req.session.uid+"'";
        }       

        getSQLData(sql, function(dbresultsets){
            results = dbresultsets;
            res.render('msp/index',{title:"MSPList", sess_name: req.session.uname, sess_id: srid, datas: results});
        });
    });   

    /* back to main screen */
    router.get('/cancelAdd', function(req, res, next) {
        res.redirect('/');
    });

    /* new msps */
    router.get('/addmsp',isAuthenticated,function(req,res){
        res.render('msp/newmsp',{title:"MSP", sess_name: req.session.uname, sess_id: req.session.rid, sess_cid: req.session.cid});
    });  

    router.post('/delete',isAuthenticated,function(req,res){
        var sqls = "DELETE FROM tbl_msp WHERE msp_id in ("+req.body.recordids+")";
        getSQLData(sqls, function(resultsets){
            msg = "Deleted Successfully";
        });
        res.redirect('/msp');
    });  

    router.get('/delete/:id',isAuthenticated,function(req,res){
        var sqls = "DELETE FROM tbl_msp WHERE msp_id in ("+req.params.id+")";
        getSQLData(sqls, function(resultsets){
            msg = "Deleted Successfully";
        });
        res.redirect('/msp');
    }); 

    router.get('/edit/:id',isAuthenticated,function(req, res){
        var sql = "SELECT * FROM tbl_msp WHERE msp_id = '"+req.params.id+"'";
        getSQLData(sql, function(dbresultsets){
            results = dbresultsets;
            res.render('msp/editmsp',{title:"EditMSP", sess_name: req.session.uname, sess_id: req.session.rid, sess_cid: req.session.cid, data:results});
        });
     
    });  
      
    router.post('/update',isAuthenticated,function(req, res){
        var msg = "";
        if(req.body.mspname != ""){
            var now = moment().format("YYYY-MM-DD HH:mm:ss");
            var sqls = "UPDATE tbl_msp SET customer_id='"+req.body.customer_id+"',msp_name='"+req.body.mspname+"',msp_contact_name='"+req.body.contactname+"',msp_contact_email='"+req.body.mspemail+"',msp_contact_no='"+req.body.mobileno+"',msp_desc='"+req.body.mspdesc+"',updated_date='"+now+"' WHERE msp_id = '"+req.body.mspid+"'";
            getSQLData(sqls, function(resultsets){
                msg = "msp Successfully Added";
            }); 
        }    
        res.redirect('/msp');
    });  

    /* save msp1 */
    router.post('/savemsp',isAuthenticated,function(req,res){
        var msg="";
        if(req.body.mspname != ""){
            sql = "SELECT msp_name FROM tbl_msp WHERE msp_name ='"+req.body.mspname+"'";
            getSQLData(sql, function(resultsets){
                if(Object.keys(resultsets).length == 0){
                    var now = moment().format("YYYY-MM-DD HH:mm:ss");
                    sqls = "INSERT INTO tbl_msp (customer_id,user_id,msp_name,msp_contact_name, msp_contact_no,msp_contact_email,msp_desc,created_date,updated_date) "+
                    " values('"+req.body.customer_id+"','"+req.session.uid+"','"+req.body.mspname+"','"+req.body.contactname+"','"+req.body.mobileno+"','"+req.body.mspemail+"','"+req.body.mspdesc+"','"+now+"','"+now+"')";
                    
                    getSQLData(sqls, function(resultsets){
                        msg = "msp Successfully Added";
                    });//end of insert query  
                }else{
                  msg = "msp Already Exists";
                }     
            });//end of call getData function  
        }else{
            msg = "Enter the MSP Name";
        }
        //res.send({"errormsg":msg}); 
        res.redirect('/msp');        
    }); //end of save msp1 function    
    
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
 