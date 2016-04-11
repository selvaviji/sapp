var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt-nodejs');
var moment = require('moment');
var util = require("util"); 
var path = require('path');     //used for file path
var fs = require('fs-extra');       //File System - for file manipulation
var multer  = require('multer');
var bodyParser = require('body-parser');

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })


var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()){
      
      return next();
    }
    res.redirect('/');
}


module.exports = function(passport,dbconnection) {
  	//console.log("customer triggered");
    
    /* GET customer listing. */
    router.get('/', isAuthenticated, function(req, res){
        var sql = "SELECT a.gallery_name,a.id,a.status,a.created_date,a.updated_date"+
              " FROM tbl_gallery_master a,tbl_gallery_child b"+
              " WHERE a.institute_id='"+req.session.cid+"' and a.status='0' and a.id = b.gallery_id"; 
        getSQLData(sql, function(dbresultsets){
            results = dbresultsets;
            //console.log("results :"+results);
            res.render('gallery/index',{title:"List", sess_name: req.session.uname, sess_id: req.session.rid, datas: results});
        });
    });   

    /* back to main screen */
    router.get('/cancelAdd', function(req, res, next) {
        res.redirect('/');
    });

    /* delete a customer */
    router.post('/delete',isAuthenticated,function(req,res){
        var sql = "DELETE FROM tbl_gallery_master WHERE id in ('"+req.body.recordids+"')";
        dbconnection.getConnection(function(err, connection) {  
            connection.query(sql, function(err, dbresultsets){
                       
            });
            connection.release();
        });
        res.redirect('/');
    });  

    /* delete a customer */
    router.get('/delete/:id',isAuthenticated,function(req,res){
        var suname =req.session.uname;
        var srid=req.session.rid;
        var sql = "DELETE FROM tbl_gallery_master WHERE id in ('"+req.params.id+"')";

        dbconnection.getConnection(function(err, connection) {  
            connection.query(sql, function(err, dbresultsets){
              if(dbresultsets.affectedRows > 0){ 
                  msg = "Deleted Successfully";
              }
              connection.release();
            });
        });
        res.redirect('/');
    });    
    
  
   

   
    /* new customer */
    router.get('/add',isAuthenticated,function(req,res){
        res.render('gallery/add',{title:"Customer",sess_name: req.session.uname, sess_id: req.session.rid});
    });  

    router.get('/edit/:id',isAuthenticated,function(req, res){
        var sql = "SELECT a.id,a.gallery_name,b.id AS 'child_id',b.display_name,b.image_name,a.created_date,a.updated_date "+
                  "FROM tbl_gallery_master a,tbl_gallery_child b "+
                  "WHERE a.id=b.gallery_id and a.status='0' and a.id = '"+req.params.id+"'";
        getSQLData(sql, function(dbresultsets){
            results = dbresultsets;
            res.render('gallery/edit',{title:"Edit",sess_name: req.session.uname, sess_id: req.session.rid,data:results});
        });
    });  
      
    router.post('/update',isAuthenticated,[ multer({ dest: './frontend/assets/gallery'}),function(req, res){
          var now = moment().format("YYYY-MM-DD HH:mm:ss");
          var myObject = req.files;
          var count = Object.keys(myObject).length;

          if(count > 0){
              logoname = req.files.imgInp.name;
            
              sqls = "UPDATE tbl_gallery_master SET gallery_name='"+galleryname+"',status='"+status+"',updated_date='"+now+"' WHERE id = '"+req.body.gid+"'";
              sql1 = "UPDATE tbl_gallery_child SET display_name='"+req.body.displayname+"',image_name = '"+logoname+"' where id= '"+req.body.gcid+"'"; 
          }else{
              sqls = "UPDATE tbl_gallery_master SET gallery_name='"+galleryname+"',status='"+status+"',updated_date='"+now+"' WHERE id = '"+req.body.gid+"'";
              sql1 = "UPDATE tbl_gallery_child SET display_name='"+req.body.displayname+"' where id= '"+req.body.gcid+"'"; 
          }
          getSQLData(sqls, function(dbresultsets){
              getSQLData(sql1, function(dbresultsets){
                if(dbresultsets.length > 0){

                  msg = "Updated Successfully";
                }
              });  
          });
          res.redirect('/gallery');  
    }]);  

    
    
     /* save user1 */
    router.post('/save',isAuthenticated,[ multer({ dest: './frontend/assets/gallery'}),function(req,res){
        var logoname = "";
        var myObject = req.files;
        var count = Object.keys(myObject).length
            //console.log("Count :"+count);
        if(count > 0){
          logoname = req.files.imgInp.name;
        }
        var now = moment().format("YYYY-MM-DD HH:mm:ss");
        sqls = "INSERT INTO tbl_gallery_master (institute_id,gallery_name,status,created_date,updated_date) "+
                    " values('"+req.session.cid+"','"+req.body.galleryname+"','0','"+now+"','"+now+"')";
        console.log("SQL :"+sqls);
                    
        dbconnection.getConnection(function(err, connection) {  
            connection.query(sqls, function(err, dbresultsets){
                newuserid = dbresultsets.insertId;
                sqls = "INSERT INTO tbl_gallery_child (gallery_id,display_name,image_name) "+
                       " values('"+newuserid+"','"+req.body.displayname+"','"+logoname+"')";
                dbconnection.getConnection(function(err, connection) {
                    connection.query(sqls, function(err, res1){
                    });
                });            
            });//end of insert query  
        });
         
        res.redirect('/gallery');  
    }]); //end of save user1 function 


    /* callback function */
    function getSQLData(sqls, cb) { 
        var resultsets;
        dbconnection.getConnection(function(err, connection) {
          console.log("SQL :"+sqls);
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
