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
        var query;
        var results;
        var suname =req.session.uname;
        var suid =req.session.uid;
        var srid=req.session.rid;
        var custid= "";
        sql = "SELECT a.level_name, a.level_status, b . * "+
                "FROM tbl_level_master a,tbl_level_child b "+
                "WHERE a.level_id = b.level_id "+
                "AND a.level_status =  '0' group by b.level_id";
        console.log("SQL :"+sql);        
        getSQLData(sql, function(dbresultsets){
            results = dbresultsets;
            res.render('level/index',{title:"Level", sess_name: suname, sess_id: srid, datas: results,customerid: custid,sess_report:req.session.reports_info});
        });
    });   
    router.post('/module_data',isAuthenticated, function(req, res){
        var suname =req.session.uname;
        var suid =req.session.uid;
        var srid=req.session.rid;
        var custid= "";
        sql = "SELECT id,module_name FROM tbl_modules WHERE module_status='0' order by id";
        getSQLData(sql, function(dbresultsets){
            results = dbresultsets;
            res.send({custdata:results});
        });
    });
    router.post('/submodule_data',isAuthenticated, function(req, res){
        var suname =req.session.uname;
        var suid =req.session.uid;
        var srid=req.session.rid;
        var custid= "";
        sql = "SELECT id,module_id,submodule_name FROM tbl_sub_modules WHERE module_id='"+req.body.module_id+"'";
        getSQLData(sql, function(dbresultsets){
            results = dbresultsets;
            res.send({submoduledata:results});
        });
    });
    router.get('/search_level', isAuthenticated, function(req, res){
        var suname =req.session.uname;
        var suid =req.session.uid;
        var srid=req.session.rid;
        var custid= "";
       // var regex = new RegExp(req.query["term"], 'i');
        var regex = req.query["term"];
        qryString = " AND a.level_name like '"+regex+"%'";
        sql = "SELECT a.level_name, a.level_id "+
                "FROM tbl_level_master a ,tbl_level_child b "+
                "WHERE a.level_id = b.level_id "+
                "AND a.level_status =  '0' "+qryString+" group by b.level_id";
        console.log("Trriggered :"+sql);
        getSQLData(sql, function(dbresultsets){
            results = dbresultsets;
            console.log("Result :"+results);
            res.send({custdata:results});
        });        
        
        //res.send("success");
    }); 

    /* SEARCH */
    router.post('/search', isAuthenticated, function(req,res){
        var query;
        var results;
        var suname =req.session.uname;
        var suid =req.session.uid;
        var srid=req.session.rid;
        var custid = req.body.customer_id;
        var querystr = "";
        var custstr = "";
        

        if(custid != 'undefined' && custid != '0' && custid != ''){
            querystr = " AND b.customer_id='"+custid+"'";
            custstr = " WHERE b.customer_id='"+custid+"'";
        }else if(custid == '0'){
            custstr = " WHERE a.user_id = '1'";
        }

        if(srid == '1'){
            sql = "SELECT a.alarmpin_id, b.customer_id, b.customer_name, a.alarmpin_no, a.alarmpin_name, a.alarmpin_sc, a.alarmpin_status, a.alarmpin_priority,a.alarmpin_tt,"+
              "a.created_date, a.updated_date FROM tbl_alarmpin a "+ 
              "LEFT JOIN tbl_customer b ON a.customer_id=b.customer_id "+custstr;
        }else{
            sql = "SELECT a.alarmpin_id, b.customer_id, b.customer_name, a.alarmpin_no, a.alarmpin_name, a.alarmpin_sc, a.alarmpin_status, a.alarmpin_priority,a.alarmpin_tt,"+
              "a.created_date, a.updated_date FROM tbl_pindetails a,tbl_customer b "+
              "WHERE a.customer_id=b.customer_id and a.user_id='"+suid+"'"+querystr;
        }      
        //console.log("search triggered :"+sql);
        getSQLData(sql, function(dbresultsets){
            results = dbresultsets;
            res.render('alarmpin/index',{title:"Level", sess_name: suname, sess_id: srid, datas: results,customerid: custid,sess_report:req.session.reports_info});
        });
    });    
    

    /* back to main screen */
    router.get('/cancelAdd', function(req, res, next) {
        res.redirect('/');
    });


    /* new pins */
    router.get('/addlevel',isAuthenticated,function(req,res){
        var suname =req.session.uname;
        var srid=req.session.rid;
        res.render('level/new',{title:"New Level", sess_name: suname, sess_id: srid,sess_report:req.session.reports_info});
    });  

    router.post('/delete',isAuthenticated,function(req,res){
        var suname =req.session.uname;
        var srid=req.session.rid;
        if(req.body.recordids != ''){
            var sql = "DELETE FROM tbl_level_master WHERE level_id in ("+req.body.recordids+")";
            //console.log("Delete SQL :"+sql);
            getSQLData(sql, function(dbresultsets){
                msg = "Deleted Successfully";
            });
        }    
        res.redirect('/');
    });  

    router.get('/edit/:id',isAuthenticated,function(req, res){
        var suname =req.session.uname;
        var srid=req.session.rid;
        var id = req.params.id;
        var sql = "SELECT * FROM tbl_level_master WHERE level_id = '"+id+"'";
        getSQLData(sql, function(dbresultsets){
            results = dbresultsets;
            res.render('level/edit',{title:"Edit Level", sess_name: suname, sess_id: srid, data:results,sess_report:req.session.reports_info});
        });
     
    });  
      
    router.post('/update',isAuthenticated,function(req, res){
        var msg = "";
            var levelname = req.body.levelname;
            var levelstatus = req.body.levelstatus;
            var levelid = req.body.levelid;
            var now = moment().format("YYYY-MM-DD HH:mm:ss");
            
            var sqls = "UPDATE tbl_level_master SET level_name='"+levelname+"',level_status='"+levelstatus+"',updated_date='"+now+"' WHERE level_id = '"+levelid+"'";
            getSQLData(sqls, function(resultsets){
                res.send('Saved Successfully');
            })    
    });  

       
    /* Save Level */
    router.post('/savelevel',isAuthenticated,function(req,res){
        var suid =req.session.uid;
        var levelname = req.body.levelname;
        var levelstatus = req.body.levelstatus;
        var mainmod = req.body.mainmod;
        var submod = req.body.submod;
        var now = moment().format("YYYY-MM-DD HH:mm:ss");

        mainmodule = mainmod.split("*");


        console.log("Level Name:"+levelname);  
        console.log("Level Status:"+levelstatus);
        console.log("Sub Module:"+submod);
        console.log("Main Module:"+mainmod.length);
        values = "("
       /* for(i=0;i<mainmod.length;i++){
              values += "(";  
              if(typeof mainmod[i] != 'undefined'){
                console.log("MM :"+mainmod[i]);
                console.log("SS :"+submod[i]);
                values += mainmod[i] + ",";
                if(submod[i] != '0'){
                    submoddata = submod[i].split(',');
                    for(j=0;j<submoddata.length;j++){
                        if(submoddata[j]!= '' && submoddata[j]!=null && typeof submoddata[j]!=undefined){
                            values += submoddata[j] +')'
                        }
                    }
                }
              }  */
        var msg="";
        sqls = "INSERT INTO tbl_level_master (level_name,level_status,created_date,updated_date) "+
                " values('"+levelname+"','"+levelstatus+"','"+now+"','"+now+"')";
        dbconnection.getConnection(function(err, connection) {
            connection.query(sqls, function(err, res){
                if (err) {
                    return connection.rollback(function() {
                        throw err;
                    });
                }  
                connection.commit(function(err) {
                    if (err) {
                        return connection.rollback(function() {
                            throw err;
                        });
                    }
                    newId = res.insertId;
                    values = "('"+newId+"'";
                    for(i=0;i<mainmod.length;i++){
                        values += mainmod[i] + ",";
                        for(j=0; j<mainmod[i].length;j++){
                            values += mainmod[i][j] +",";
                        }
                    }
                    values += ")";
                    console.log("Values :"+values);             
                    msg = "Level Successfully Added";
                    console.log(msg);
                });
            });
            connection.release();
            res.redirect('/level');
        }); //end of insert query     
    }); //end of save function    
    
     
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
 