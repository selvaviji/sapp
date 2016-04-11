var express = require('express');
var router = express.Router();
var moment = require('moment');
var multer  = require('multer');
var bodyParser = require('body-parser');

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated())
      return next();

    res.redirect('/');
}


module.exports = function(passport,dbconnection) {
  	/* GET msps listing. */
    router.get('/', isAuthenticated, function(req, res){
        sql = "SELECT a.*,b.design_name from tbl_staff a,tbl_design b where a.design_id=b.id and a.institute_id ='"+req.session.cid+"'";
          
        //console.log("index page triggered :"+sql);
        getSQLData(sql, function(dbresultsets){
            results = dbresultsets;
            res.render('staff/index',{title:"staff", sess_name: req.session.uname, sess_id:req.session.rid, datas: results});
        });
    });   

    router.get('/design',function(req,res){
        sql = "SELECT * from tbl_design where institute_id ='"+req.session.cid+"'";
          
        //console.log("index page triggered :"+sql);
        getSQLData(sql, function(dbresultsets){
            results = dbresultsets;
            res.send({custdata:results});
        });
    });
    /* new section */
    router.get('/add',isAuthenticated,function(req,res){
       
        res.render('staff/new',{title:"staff Details", sess_name: req.session.uname, sess_id: req.session.rid});
   
    });  

    

    router.get('/delete/:id',isAuthenticated,function(req,res){
      
        var sql = "DELETE FROM tbl_staff WHERE id in ("+req.params.id+")";
        //console.log("Delete SQL :"+sql);
        getSQLData(sql, function(dbresultsets){
          msg = "Deleted Successfully";
        });
        res.redirect('/staff');
    });  


    router.get('/edit/:id',isAuthenticated,function(req, res){
        var sql = "SELECT * FROM tbl_staff WHERE id = '"+req.params.id+"'";
        getSQLData(sql, function(dbresultsets){
            results = dbresultsets;
            res.render('staff/edit',{title:"Edit", sess_name: req.session.uname, sess_id: req.session.rid, data:results});
        });
     
    });  
      
    router.post('/update',isAuthenticated,[ multer({ dest: './frontend/assets/uploads'}),function(req, res){
        var msg = "";
        if(req.body.staffname != ""){
           
            var now = moment().format("YYYY-MM-DD HH:mm:ss");
            doj = moment(req.body.doj).format('YYYY-MM-DD HH:mm:ss');
            dob = moment(req.body.dob).format('YYYY-MM-DD HH:mm:ss');
            var myObject = req.files;
            var count = Object.keys(myObject).length;
            if(count > 0){
                logoname = req.files.imgInp.name;
                var sqls = "UPDATE tbl_staff SET staff_name='"+req.body.staffname+"',staff_image='"+logoname+"',design_id='"+req.body.designid+"',gender='"+req.body.gender+"',address='"+req.body.address+"',qualification='"+req.body.qualification+"',mobileno='"+req.body.mobilno+"',email='"+req.body.email+"',doj='"+doj+"',dob='"+dob+"',updated_date='"+now+"' WHERE id = '"+req.body.sid+"'";
            }else{
                var sqls = "UPDATE tbl_staff SET staff_name='"+req.body.staffname+"',design_id='"+req.body.designid+"',gender='"+req.body.gender+"',address='"+req.body.address+"',qualification='"+req.body.qualification+"',mobileno='"+req.body.mobilno+"',email='"+req.body.email+"',doj='"+doj+"',dob='"+dob+"',updated_date='"+now+"' WHERE id = '"+req.body.sid+"'";
            }
            getSQLData(sqls, function(resultsets){
                msg = "section Successfully Added";
            }); 
        }    
        res.redirect('/staff');
    }]);  

    
     /* save */
    router.post('/save',isAuthenticated,[ multer({ dest: './frontend/assets/uploads'}),function(req,res){
        var msg="";
        var logoname = "";
            if(req.body.staffname != ""){
                var myObject = req.files;
                var count = Object.keys(myObject).length
                //console.log("Count :"+count);
                if(count > 0){
                    logoname = req.files.imgInp.name;
                }
                var now = moment().format("YYYY-MM-DD HH:mm:ss");
                doj = moment(req.body.doj).format('YYYY-MM-DD HH:mm:ss');
                dob = moment(req.body.dob).format('YYYY-MM-DD HH:mm:ss');
                sqls = "INSERT INTO tbl_staff(institute_id,staff_name,staff_image,design_id,gender,address,qualification,mobileno,email,doj,dob,created_date,updated_date) "+
                        " values('"+req.session.cid+"','"+req.body.staffname+"','"+logoname+"','"+req.body.designid+"', '"+req.body.gender+"','"+req.body.address+"','"+req.body.qualification+"','"+req.body.mobileno+"','"+req.body.email+"','"+doj+"','"+dob+"','"+now+"','"+now+"')";
                    console.log("SQL :"+sqls);
                    dbconnection.getConnection(function(err, connection) {
                        connection.query(sqls, function(err, res){
                            if (err) {
                              throw err;
                            }  
                            msg = "staff Successfully Added";
                          
                        });
                        connection.release();    
                    });//end of insert query  
            }else{
                  msg = "staff Already Exists";
            }     
            res.redirect('/staff');         
    }]); //end of save function    
    
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
 