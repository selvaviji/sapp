var express = require('express');
var router = express.Router();
var moment = require('moment');
var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated())
      return next();

    res.redirect('/');
}


module.exports = function(passport,dbconnection) {
  	/* GET listing. */
    router.get('/', isAuthenticated, function(req, res){
        sql = "SELECT * from tbl_section where institute_id ='"+req.session.cid+"'";
          
        //console.log("index page triggered :"+sql);
        getSQLData(sql, function(dbresultsets){
            results = dbresultsets;
            res.render('section/index',{title:"Sections", sess_name: req.session.uname, sess_id:req.session.rid, datas: results});
        });
    });   

    /* new section */
    router.get('/add',isAuthenticated,function(req,res){
       
        res.render('section/new',{title:"Section Details", sess_name: req.session.uname, sess_id: req.session.rid});
   
    });  

    

    router.get('/delete/:id',isAuthenticated,function(req,res){
      
        var sql = "DELETE FROM tbl_section WHERE id in ("+req.params.id+")";
        //console.log("Delete SQL :"+sql);
        getSQLData(sql, function(dbresultsets){
          msg = "Deleted Successfully";
        });
        res.redirect('/section');
    });  


    router.get('/edit/:id',isAuthenticated,function(req, res){
        var sql = "SELECT * FROM tbl_section WHERE id = '"+req.params.id+"'";
        getSQLData(sql, function(dbresultsets){
            results = dbresultsets;
            res.render('section/edit',{title:"Edit", sess_name: req.session.uname, sess_id: req.session.rid, data:results});
        });
     
    });  
      
    router.post('/update',isAuthenticated,function(req, res){
        var msg = "";
        if(req.body.sectionname != ""){
           
            var now = moment().format("YYYY-MM-DD HH:mm:ss");
            
            var sqls = "UPDATE tbl_section SET section_name='"+req.body.sectionname+"',updated_date='"+now+"' WHERE id = '"+req.body.sid+"'";
            getSQLData(sqls, function(resultsets){
                msg = "section Successfully Added";
            }); 
        }    
        res.redirect('/section');
    });  

    
     /* save */
    router.post('/save',isAuthenticated,function(req,res){
        var msg="";
        if(req.body.sectionname != ""){
          sql = "SELECT section_name FROM tbl_section WHERE institute_id='"+req.session.cid+"' and section_name ='"+req.body.sectionname+"'";
            console.log("SQL :"+sql);
            getSQLData(sql, function(resultsets){
                if(Object.keys(resultsets).length == 0){
                    var now = moment().format("YYYY-MM-DD HH:mm:ss");
                    sqls = "INSERT INTO tbl_section (institute_id,section_name,created_date,updated_date) "+
                    " values('"+req.session.cid+"','"+req.body.sectionname+"','"+now+"','"+now+"')";
                    console.log("SQL :"+sqls);
                    dbconnection.getConnection(function(err, connection) {
                        connection.query(sqls, function(err, res){
                            if (err) {
                              throw err;
                            }  
                            msg = "Section Successfully Added";
                          
                        });
                        connection.release();    
                    });//end of insert query  
                }else{
                  msg = "Section Already Exists";
                }     
            
            });//end of call getData function  
        }
        res.redirect('/section');         
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
 