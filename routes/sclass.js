var express = require('express');
var router = express.Router();
var moment = require('moment');
var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated())
      return next();

    res.redirect('/');
}


module.exports = function(passport,dbconnection) {
  	/* GET msps listing. */
    router.get('/', isAuthenticated, function(req, res){
        sql = "SELECT * from tbl_class where institute_id ='"+req.session.cid+"'";
          
        //console.log("index page triggered :"+sql);
        getSQLData(sql, function(dbresultsets){
            results = dbresultsets;
            res.render('sclass/index',{title:"Class", sess_name: req.session.uname, sess_id:req.session.rid, datas: results});
        });
    });   

    /* new section */
    router.get('/add',isAuthenticated,function(req,res){
       
        res.render('sclass/new',{title:"Class Details", sess_name: req.session.uname, sess_id: req.session.rid});
   
    });  

    

    router.get('/delete/:id',isAuthenticated,function(req,res){
      
        var sql = "DELETE FROM tbl_class WHERE id in ("+req.params.id+")";
        //console.log("Delete SQL :"+sql);
        getSQLData(sql, function(dbresultsets){
          msg = "Deleted Successfully";
        });
        res.redirect('/sclass');
    });  


    router.get('/edit/:id',isAuthenticated,function(req, res){
        var sql = "SELECT * FROM tbl_class WHERE id = '"+req.params.id+"'";
        getSQLData(sql, function(dbresultsets){
            results = dbresultsets;
            res.render('sclass/edit',{title:"Edit", sess_name: req.session.uname, sess_id: req.session.rid, data:results});
        });
     
    });  
      
    router.post('/update',isAuthenticated,function(req, res){
        var msg = "";
        if(req.body.sectionname != ""){
           
            var now = moment().format("YYYY-MM-DD HH:mm:ss");
            
            var sqls = "UPDATE tbl_class SET class_name='"+req.body.classname+"',class_name_numeric='"+req.body.classnumeric+"',updated_date='"+now+"' WHERE id = '"+req.body.sid+"'";
            getSQLData(sqls, function(resultsets){
                msg = "section Successfully Added";
            }); 
        }    
        res.redirect('/sclass');
    });  

    
     /* save */
    router.post('/save',isAuthenticated,function(req,res){
        var msg="";
        if(req.body.classname != ""){
          sql = "SELECT class_name FROM tbl_class WHERE institute_id='"+req.session.cid+"' and class_name ='"+req.body.classname+"'";
            console.log("SQL :"+sql);
            getSQLData(sql, function(resultsets){
                if(Object.keys(resultsets).length == 0){
                    var now = moment().format("YYYY-MM-DD HH:mm:ss");
                    sqls = "INSERT INTO tbl_class(institute_id,class_name,class_name_numeric,created_date,updated_date) "+
                    " values('"+req.session.cid+"','"+req.body.classname+"','"+req.body.classnumeric+"','"+now+"','"+now+"')";
                    console.log("SQL :"+sqls);
                    dbconnection.getConnection(function(err, connection) {
                        connection.query(sqls, function(err, res){
                            if (err) {
                              throw err;
                            }  
                            msg = "Class Successfully Added";
                          
                        });
                        connection.release();    
                    });//end of insert query  
                }else{
                  msg = "Class Already Exists";
                }     
            
            });//end of call getData function  
        }
        res.redirect('/sclass');         
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
 