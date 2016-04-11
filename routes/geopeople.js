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
        //console.log("******* Event Triggered ******************");
        qry="";
        if(req.session.cid != "0"){
            qry += " AND remark_name ='"+req.session.cid+"'";
        }
        sql =   "SELECT a.lat_value,a.lng_value,a.emp_id,a.emp_name,a.contact_no,a.report_manager,b.remark_name,c.state_name,d.location_name,e.design_name  "+
                    "FROM tbl_gis_master a,tbl_gis_child b,tbl_gis_state c,tbl_gis_location d,tbl_gis_designation e "+
                    "WHERE a.id=b.gis_id AND a.state_id=c.id AND a.location_id=d.id "+
                    "AND a.design_id=e.id"+qry;
                  
        //console.log("GeoPeople SQL :"+sql);
        var results = [];
        getSQLData(sql, function(dbresultsets){
            results = dbresultsets;
            res.render('geopeople/index',{title:"Level", sess_name: req.session.uname, sess_id: req.session.rid, datas: results,customerid: req.session.cid});
        });
    });

    router.post('/geo', isAuthenticated, function(req, res){
       // console.log("******* Geo Event Triggered ******************");    
        cid = req.session.cid;
        if(req.body.customerid != "" && req.body.customerid != null && typeof req.body.customerid != undefined){
            cid = req.body.customerid;
        }
        
        qry="";
        if(cid != "0"){
            customer_id = cid;
            qry += " AND remark_name ='"+cid+"'";
        }
        sql = "SELECT a.lat_value,a.lng_value,a.emp_id,a.emp_name,a.contact_no,a.report_manager,b.remark_name,c.state_name,d.location_name,e.design_name  "+
                    "FROM tbl_gis_master a,tbl_gis_child b,tbl_gis_state c,tbl_gis_location d,tbl_gis_designation e "+
                    "WHERE a.id=b.gis_id AND a.state_id=c.id AND a.location_id=d.id "+
                    "AND a.design_id=e.id"+qry;
        //console.log("Geo SQL :"+sql);
        var results = [];
        getSQLData(sql, function(dbresultsets){
            results = dbresultsets;
            res.send({datas: results});
        });
    });  

    router.post('/serverdata',function(req,res){
        dataid = req.body.dataid;
        dataname = req.body.dataname;
        //console.log("dataID :"+dataid+" "+dataname);
        var now = moment().format("YYYY-MM-DD HH:mm:ss");
        if(dataid=="Design"){
            sql = "select id from tbl_gis_designation where design_name='"+dataname+"'";
            dbconnection.getConnection(function(err, connection) {
                connection.query(sql, function(err, res1){
                    results = res1;
                    if(results.length > 0){
                        designid = results[0].id;
                    }else{
                        sql = "insert into tbl_gis_designation(design_name,created_date,updated_date) values ('"+dataname+"','"+now+"','"+now+"')";
                        connection.query(sql, function(err, resultsets){
                            designid = resultsets.insertId;
                        })
                    }
                    connection.release(); 
                    res.send({custdata:designid});
                });
            });    
        }else if(dataid == "Location"){
            sql = "select id from tbl_gis_location where location_name='"+dataname+"'";
            dbconnection.getConnection(function(err, connection) {
                connection.query(sql, function(err, resultset1){
                    results = resultset1;
                    if(results.length > 0){
                        locationid = results[0].id;
                    }else{
                        sql = "insert into tbl_gis_location(location_name,created_date,updated_date) values ('"+dataname+"','"+now+"','"+now+"')";
                        connection.query(sql, function(err, res1){
                            locationid = res1.insertId;
                        });
                    }
                    connection.release(); 
                    res.send({custdata:locationid});
                });
            });    
        }else if(dataid == "State"){
            sql = "select id from tbl_gis_state where state_name='"+dataname+"'";
            dbconnection.getConnection(function(err, connection) {
                connection.query(sql, function(err, resultset1){
                    results = resultset1;
                    if(results.length > 0){
                        stateid = results[0].id;
                    }else{
                        sql = "insert into tbl_gis_state(state_name,created_date,updated_date) values ('"+dataname+"','"+now+"','"+now+"')";
                        connection.query(sql, function(err, res1){
                            stateid = res1.insertId;
                        });    
                    }
                    connection.release(); 
                    res.send({custdata:stateid});
                });
            });    
        }
    }); 

    router.post('/appendserverdata', function(req, res){
        //console.log("******* appenddata Eve HH:mm:ss"); 
        var udata = req.body.uploaddata;
        var remark = udata.Remark;
        
        sql = "insert into tbl_gis_master(emp_id,emp_name,design_id,contact_no,location_id,report_manager,state_id,lat_value,lng_value, created_date,updated_date) values ('"+ udata.EMPID +"','"+udata.EmployeeName+"','"+udata.Designation+"','"+udata.ContactNo+"','"+udata.Location+"','"+udata.ReportingManager+"','"+udata.State+"','"+udata.latvalue+"','"+udata.lngvalue+"','"+now+"','"+now+"')";
        dbconnection.getConnection(function(err, connection) {
            connection.query(sql, function(err, resultsets){
                
                recid = resultsets.insertId;
                if(recid != "0" && typeof recid !== "undefined"){
                    remarkdata=[];
                    if(typeof remark === "undefined"){
                        remarkdata[0] = '';
                    }else{    
                        if(remark.indexOf('/') > -1){
                            remarkdata = remark.split("/");     
                        }else if(remark.indexOf('&') > -1){
                            remarkdata = remark.split("&"); 
                        }else if(remark.indexOf(',') > -1){   
                            remarkdata = remark.split(",");  
                        }else{
                            remarkdata[0] = remark;
                        }
                    }    
                    
                    for(i=0;i<remarkdata.length;i++){
                        sql1 = "insert into tbl_gis_child(gis_id,remark_name,created_date,updated_date) values ('"+recid+"','"+remarkdata[i]+"','"+now+"','"+now+"')";
                        connection.query(sql1, function(err, result){
                            
                        });    
                    }
                }      
                connection.release();
                res.send("success");   
            });   
              
        });    
    });    


    router.post('/getRemark', function(req, res){
        console.log("******* getRemark Event Triggered ******************");
        
        if(req.session.cid != "0"){
            sql = "SELECT id,remark_name FROM tbl_gis_child "+
                    "WHERE id="+ req.session.cid;
        }else{
            sql = "SELECT id,remark_name FROM tbl_gis_child ";
        }            
        
        //console.log("Geo SQL :"+sql);
        var results = [];
        getSQLData(sql, function(resultsets){
           results = resultsets;
           res.send({custdata:results});
        })
     });
     
     /* callback function */
    function getSQLData(sqls, cb) { 
        var resultsets;
        console.log("SQL**********:"+sqls);
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
 
