var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt-nodejs');
var moment = require('moment');
var isAuthenticated = function (req, res, next) {
    // if role is authenticated in the session, call the next() to call the next request handler 
    // Passport adds this method to request object. A middleware is allowed to add properties to
    // request and response objects
    if (req.isAuthenticated())
      return next();
    // if the role is not authenticated then redirect him to the login page
    res.redirect('/');
}


module.exports = function(passport,dbconnection) {
  	//console.log("roles triggered");
    

    /* GET roles listing. */
    router.get('/', isAuthenticated, function(req, res){
        var query;
        var results;
        var suname =req.session.uname;
        var srid=req.session.rid;
        sql = "SELECT role_id, role_name, role_desc, "+
              "created_date, updated_date FROM tbl_role order by role_id";
              
        //console.log("index page triggered :"+sql);
        getSQLData(sql, function(dbresultsets){
            //console.log("Length :"+dbresultsets);
            results = dbresultsets;
            //console.log(results);
            res.render('userrole/index',{title:"roleList", sess_name: suname, sess_id: srid, datas: results});
        });
    });   


    /* GET roles listing. */
    router.get('/getdata', isAuthenticated, function(req, res){
        //console.log("get data triggered "+req.query.role_name);
        var query;
        var results;
        var suname =req.session.uname;
        var srid=req.session.rid;
        var queryStr = "";
        var rolename = req.query.role_name;
        var updatedate=req.query.updated_date;
        var createddate=req.query.created_date;
        var cdate;
        
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
        if(rolename != ''){
            queryStr = " WHERE role_name='"+req.query.role_name+"'";
        }    
        
        if(req.query.updated_date != ''){
            if(queryStr != ''){
                queryStr += " AND date_format(updated_date,'%Y-%m-%d')='"+updatedate+"'";
            }else{
                queryStr += " WHERE date_format(updated_date,'%Y-%m-%d')='"+updatedate+"'";
            }
        } 
           
        if(req.query.created_date != ''){
            if(queryStr != ''){
                queryStr += " AND date_format(created_date,'%Y-%m-%d')='"+createddate+"'";
            }else{
                queryStr += " WHERE date_format(created_date,'%Y-%m-%d')='"+createddate+"'";
            }
        } 

        sql = "SELECT role_id, role_name, role_desc, "+
              "created_date, updated_date FROM tbl_role"+queryStr;
              
        //console.log("index page triggered :"+sql);
        getSQLData(sql, function(dbresultsets){
            //console.log("Length :"+dbresultsets);
            results = dbresultsets;
            //console.log(results);
            res.send({datas: results});
        });
    });   


    router.post('/verification',isAuthenticated,function(req,res){
        //console.log("verification triggered");
        var role = req.body;
        var rolename = role.rolename;
        
        sql = "SELECT role_name "+
                    "FROM tbl_role WHERE role_name ='"+rolename+"'";
          //console.log("Verification SQL :"+sql);          
          getSQLData(sql, function(resultsets){
            //console.log("Length :"+resultsets);
           
            if(Object.keys(resultsets).length != 0){
             res.send("true");
            }else{
             res.send("false"); 
            }
        });    
    });
    
    /* Search listing. */
    router.get('/search', isAuthenticated, function(req, res){
        var query;
        var results;
        var suname =req.session.uname;
        var srid=req.session.rid;
        var searchtxt = req.query.search_keyword;
        //console.log("searchtxt :"+searchtxt);
        sql = "SELECT role_id, role_name, role_desc, "+
              "created_date, updated_date FROM tbl_role "+
              "where role_id like '"+searchtxt+"%' or role_name like '"+searchtxt+"%' order by role_id";
              
        //console.log("index page triggered :"+sql);
        getSQLData(sql, function(dbresultsets){
            results = dbresultsets;
            res.render('userrole/index',{title:"roleList", sess_name: suname, sess_id: srid, datas: results});
        });
    });   

    /* back to main screen */
    router.get('/cancelAdd', function(req, res, next) {
        res.redirect('/');
    });


    /* new roles */
    router.get('/addrole',isAuthenticated,function(req,res){
        var suname =req.session.uname;
        var srid=req.session.rid;
        res.render('userrole/newrole',{title:"role", sess_name: suname, sess_id: srid,});
    });  

    router.post('/delete',isAuthenticated,function(req,res){
        var suname =req.session.uname;
        var srid=req.session.rid;
        var sql = "DELETE FROM tbl_role WHERE role_id in ("+req.body.recordids+")";
        getSQLData(sql, function(dbresultsets){
            if(dbresultsets.length > 0){
              msg = "Deleted Successfully";
            }
        });
        res.redirect('/');
    });  

    router.get('/delete/:id',isAuthenticated,function(req,res){
        var suname =req.session.uname;
        var srid=req.session.rid;
        var sql = "DELETE FROM tbl_role WHERE role_id in ("+req.params.id+")";
        getSQLData(sql, function(dbresultsets){
            if(dbresultsets.length > 0){
              msg = "Deleted Successfully";
            }
        });
        res.redirect('/userrole');
    });    

    router.get('/edit/:id',isAuthenticated,function(req, res){
        var suname =req.session.uname;
        var srid=req.session.rid;
        var id = req.params.id;
        var sql = "SELECT * FROM tbl_role WHERE role_id = '"+id+"'";
        getSQLData(sql, function(dbresultsets){
            results = dbresultsets;
            res.render('userrole/editrole',{title:"Editrole", sess_name: suname, sess_id: srid, data:results});
        });
     
    });  
      
    router.post('/update',isAuthenticated,function(req, res){
        var msg = "";
        if(req.body.rolename != ""){
            var mname = req.body.rolename;
            var mdesc = req.body.roledesc;
            var mid = req.body.roleid;
            var now = moment().format("YYYY-MM-DD HH:mm:ss");
            
            var sqls = "UPDATE tbl_role SET role_name='"+mname+"',role_desc='"+mdesc+"',updated_date='"+now+"' WHERE role_id = '"+mid+"'";
            getSQLData(sqls, function(dbresultsets){
                if(dbresultsets.changedRows > 0){
                  msg = "role Successfully Added";
                }
            }); 
        }    
        res.redirect('/userrole');
    });  

    
    /* save role1 */
    router.post('/saverole',isAuthenticated,function(req,res){
        var role = req.body;
        var rolename = role.rolename;
        var roledesc = role.roledesc;
        
        var msg="";
        if(rolename != ""){
            sql = "SELECT role_name "+
                    "FROM tbl_role WHERE role_name ='"+rolename+"'";
            getSQLData(sql, function(resultsets){
                if(Object.keys(resultsets).length == 0){
                    var now = moment().format("YYYY-MM-DD HH:mm:ss");
                    sqls = "INSERT INTO tbl_role (role_name,role_desc,created_date,updated_date) "+
                    " values('"+rolename+"','"+roledesc+"','"+now+"','"+now+"')";
                    //console.log("SQL :"+sqls);
                    getSQLData(sqls, function(resultsets){
                        if(resultsets.length >0){
                          msg = "role Successfully Added";
                        }
                    });
                }else{
                  msg = "role Already Exists";
                }     
            });//end of call getData function  
        }
        res.redirect('/userrole');         
    }); //end of save role1 function    
    
     
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
 