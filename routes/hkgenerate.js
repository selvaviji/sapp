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
  	console.log("hkreport triggered");
    

    /* GET msps listing. */
    router.get('/', isAuthenticated,function(req, res){
        console.log(" HKKKKKKKKK triggered");
        res.render('hkgenerate/index',{title:"HK Report", sess_name: req.session.uname, sess_id: req.session.rid});
       
    });   

    router.post('/getSiteInfo',isAuthenticated,function(req,res){
        now = moment().format('YYYY-MM-DD')
        sql = "SELECT idhkreport,siteid,concat('/snapshots/',imgpath) imgpath,status "+
              "FROM hkreport WHERE customer='6' and DATE_FORMAT(createdAt,'%Y-%m-%d')='"+now+"'";
        /*sql = "SELECT idhkreport,siteid,concat('/snapshots/',imgpath) imgpath,status "+
              "FROM hkreport WHERE customer='6' and DATE_FORMAT(createdAt,'%Y-%m-%d')='2016-02-29'"; */     
        //sql = "SELECT idhkreport,siteid,concat('/snapshots/',imgpath) imgpath,status,DATE_FORMAT(createdAt,'%Y-%m-%d') createdat FROM hkreport WHERE customer='6'";      
        console.log("sql1 :"+sql);
        getSQLData(sql,function(resultsets){
           results = resultsets;
           console.log("Results :"+JSON.stringify(results));
            //res.header("Access-Control-Allow-Origin","*");
            //res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
           res.send(results);
        });  
    })

    /* back to main screen */
    router.get('/cancelAdd', function(req, res, next) {
        res.redirect('/');
    });


   
    /* save  */
    router.post('/save',isAuthenticated,function(req,res){
        //console.log("server side savemsp triggered");
        var postdata = req.body.siteinfo;
        
        if(postdata.length >0){
            sql = "UPDATE hkreport SET status = CASE "
            for(i=0;i<postdata.length;i++){
              sql += "WHEN idhkreport='"+postdata[i].idhkreport+"' THEN '"+postdata[i].status+"' ";
            }  
            sql += " ELSE status END";
            console.log("SQL :"+sql)
             //sql = "UPDATE hkrepot SET status ='"+postdata[i].status+"' WHERE idhkreport='"+postdata[i].idhkreport+"'";
              dbconnection.getConnection(function(err, connection) {

                  connection.query(sql, function(err, result){
                      console.log("Successfully Added ");
                      connection.release();    
                  });//end of insert query  
              });
          
          res.send("success");
        }
            
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
 