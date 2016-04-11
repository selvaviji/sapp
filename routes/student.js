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
  	console.log("Student Module triggered");
    router.get('/', isAuthenticated, function(req, res){
        console.log("Student Index triggered************");
        sql = "SELECT a.*,b.class_name from tbl_student a,tbl_class b where a.class_id=b.id and a.institute_id ='"+req.session.cid+"'";
          
        console.log("index page triggered :"+sql);
        getSQLData(sql, function(dbresultsets){
            results = dbresultsets;
            res.render('student/index',{title:"student", sess_name: req.session.uname, sess_id:req.session.rid, datas: results});
        });
    });   

    router.get('/class',function(req,res){
        sql = "SELECT * from tbl_class where institute_id ='"+req.session.cid+"'";
          
        //console.log("index page triggered :"+sql);
        getSQLData(sql, function(dbresultsets){
            results = dbresultsets;
            res.send({custdata:results});
        });
    });
    /* new section */
    router.get('/add',isAuthenticated,function(req,res){
       
        res.render('student/new',{title:"Student Details", sess_name: req.session.uname, sess_id: req.session.rid});
   
    });  

    

    router.get('/delete/:id',isAuthenticated,function(req,res){
      
        var sql = "DELETE FROM tbl_student WHERE id in ("+req.params.id+")";
        //console.log("Delete SQL :"+sql);
        getSQLData(sql, function(dbresultsets){
          msg = "Deleted Successfully";
        });
        res.redirect('/student');
    });  


    router.get('/edit/:id',isAuthenticated,function(req, res){
        var sql = "SELECT * FROM tbl_student WHERE id = '"+req.params.id+"'";
        getSQLData(sql, function(dbresultsets){
            results = dbresultsets;
            res.render('student/edit',{title:"Edit", sess_name: req.session.uname, sess_id: req.session.rid, data:results});
        });
     
    });  
      
    router.post('/update',isAuthenticated,[ multer({ dest: './frontend/assets/uploads'}),function(req, res){
        var msg = "";
        console.log("updated triggered");
        if(req.body.studentname != ""){
            console.log("step-1");
            var now = moment().format("YYYY-MM-DD HH:mm:ss");
            console.log("step-2");
            doj = moment(req.body.doj).format('YYYY-MM-DD HH:mm:ss');
            console.log("step-3");
            dob = moment(req.body.dob).format('YYYY-MM-DD HH:mm:ss');
            console.log("step-4");
            var myObject = req.files;
            console.log("file :"+myObject);
            var count = Object.keys(myObject).length;
            console.log("step-5 :"+count);
            if(count > 0){

                logoname = req.files.imgInp.name;
                console.log("step-6 :"+logoname);
                var sqls = "UPDATE tbl_student SET student_name='"+req.body.studentname+"',doj='"+doj+"',dob='"+dob+"',profile_image='"+logoname+"',class_id='"+req.body.classid+"',gender='"+req.body.gender+"',address='"+req.body.address+"',city='"+req.body.city+"',pincode='"+req.body.pincode+"',state='"+req.body.state+"',country='"+req.body.country+"',landline_no='"+req.body.landlineno+"',blood_group='"+req.body.bloodgroup+"',place_of_birth='"+req.body.placeofbirth+"',mark_identify='"+req.body.markofidentity+"',is_handicap='"+req.body.ishandicap+"',is_rte='"+req.body.isrte+"',father_name='"+req.body.fathername+"',father_mobno='"+req.body.fathermobno+"',father_email='"+req.body.fatheremail+"',mother_name='"+req.body.mothername+"',mother_mobno='"+req.body.mothermobno+"',mother_email='"+req.body.motheremail+"',primary_mobno='"+req.body.primarymobno+"',primary_email='"+req.body.primaryemail+"',father_occupation='"+req.body.fatheroccupation+"',mother_occupation='"+req.body.motheroccupation+"',status='"+req.body.status+"',updated_date='"+now+"' WHERE id = '"+req.body.sid+"'";
            }else{
                console.log("False Statement");
                var sqls = "UPDATE tbl_student SET student_name='"+req.body.studentname+"',doj='"+doj+"',dob='"+dob+"',class_id='"+req.body.classid+"',gender='"+req.body.gender+"',address='"+req.body.address+"',city='"+req.body.city+"',pincode='"+req.body.pincode+"',state='"+req.body.state+"',country='"+req.body.country+"',landline_no='"+req.body.landlineno+"',blood_group='"+req.body.bloodgroup+"',place_of_birth='"+req.body.placeofbirth+"',mark_identify='"+req.body.markofidentity+"',is_handicap='"+req.body.ishandicap+"',is_rte='"+req.body.isrte+"',father_name='"+req.body.fathername+"',father_mobno='"+req.body.fathermobno+"',father_email='"+req.body.fatheremail+"',mother_name='"+req.body.mothername+"',mother_mobno='"+req.body.mothermobno+"',mother_email='"+req.body.motheremail+"',primary_mobno='"+req.body.primarymobno+"',primary_email='"+req.body.primaryemail+"',father_occupation='"+req.body.fatheroccupation+"',mother_occupation='"+req.body.motheroccupation+"',status='"+req.body.status+"',updated_date='"+now+"' WHERE id = '"+req.body.sid+"'";
            }
            console.log("SQL :"+sqls);
            getSQLData(sqls, function(resultsets){
                msg = "section Successfully Added";
            }); 
        }    
        res.redirect('/student');
    }]);  

    
     /* save */
    router.post('/save',isAuthenticated,[ multer({ dest: './frontend/assets/uploads'}),function(req,res){
        var msg="";
        var logoname = "";
            if(req.body.studentname != ""){
                var myObject = req.files;
                var count = Object.keys(myObject).length
                //console.log("Count :"+count);
                if(count > 0){
                    logoname = req.files.imgInp.name;
                }
                var now = moment().format("YYYY-MM-DD HH:mm:ss");
                doj = moment(req.body.doj).format('YYYY-MM-DD HH:mm:ss');
                dob = moment(req.body.dob).format('YYYY-MM-DD HH:mm:ss');
      
                studentObj = {
                    institute_id: req.session.cid,
                    student_name: req.body.studentname,
                    
                    class_id: req.body.classid,
                    gender: req.body.gender,
                    address: req.body.address,
                    city: req.body.city,
                    pincode: req.body.pincode,
                    state:  req.body.state,
                    country: req.body.country,
                    landline_no: req.body.landlineno,
                    blood_group: req.body.bloodgroup,
                    place_of_birth:  req.body.placeofbirth,

                    doj: doj,
                    dob: dob,
                    profile_image: logoname,
                    mark_identify: req.body.markofidentity,
                    is_handicap: req.body.ishandicap,
                    is_rte: req.body.isrte,
                    father_name: req.body.fathername,
                    father_mobno: req.body.fathermobno,
                    father_email: req.body.fatheremail,
                    mother_name: req.body.mothername,
                    mother_mobno: req.body.mothermobno,
                    mother_email: req.body.motheremail,
                    primary_mobno: req.body.primarymobno,
                    primary_email: req.body.primaryemail,
                    father_occupation: req.body.fatheroccupation,
                    mother_occupation: req.body.motheroccupation,
                    created_date: now,
                    updated_date: now
                }
                dbconnection.getConnection(function(err, connection) {
                    connection.query("INSERT INTO tbl_student SET ?",[studentObj], function(err, res){
                        if (err) {
                            throw err;
                        }  
                        msg = "Student Successfully Added";
                    });
                    connection.release();    
                });//end of insert query  
            }else{
                  msg = "Student Already Exists";
            }     
            res.redirect('/student');         
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
 