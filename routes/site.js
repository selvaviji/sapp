var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt-nodejs');
var moment = require('moment');
var util = require("util"); 
var fs = require("fs");
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
  	 /* GET site listing. */
    router.get('/', isAuthenticated, function(req, res){
      	console.log("Site Triggered");
	var query;
        var results;
        var suname =req.session.uname;
        var suid =req.session.uid;
        var srid=req.session.rid;

        var cid=req.session.cid;
        var perpage=req.session.perrows;
        var customer_id;

        if(cid != "0"){
          customer_id=cid;
        }else{
          customer_id=req.query.customer_id;
        }
        var qry="";
        if(srid != '1' && srid != '2'){
          qry = " and b.user_id='"+suid+"'";
        }

        if(customer_id != "" && typeof customer_id != 'undefined') {
          qry = qry + " AND a.customer_id = '"+ customer_id +"'";
        }

        var sql = "SELECT a.site_name,a.site_id,a.site_code,a.site_status,a.area_id,c.area_name,a.customer_id,b.customer_name,a.site_address,a.site_pincode,a.site_latitude,a.site_longitude,a.site_videolink,a.created_date,a.updated_date "+
              " FROM tbl_site a,tbl_customer b,tbl_area c WHERE a.customer_id = b.customer_id and a.area_id=c.area_id"+qry+" order by site_id"; 
        console.log("Site SQL:"+sql);
        getSQLData(sql, function(dbresultsets){
            results = dbresultsets;
            res.render('site/index',{title:"siteList", sess_name: suname, sess_uid: suid, sess_id: srid, datas: results,custid:customer_id});
        });
    });   

    //areaname 
    router.get('/areaname', isAuthenticated, function(req,res){
      console.log("area triggered");
        var suname =req.session.uname;
        var suid =req.session.uid;
        var srid=req.session.rid;
        var scid =req.session.cid;
        var arr=req.query.areaname;
        console.log("arr values=="+arr);
        var areaid=[];

        var sql = "select a.area_id from tbl_area a where a.area_name='"+arr+"'";
        console.log("sql"+sql);
        getSQLData(sql, function(resultsets){
            if(resultsets.length>0){
              results = resultsets;
              console.log("results :"+JSON.stringify(results));
              areaid = results[0].area_id;
            }else{
              areaid = "0";
            } 
            console.log("area name=="+areaid); 
            res.send({custdata:areaid});
        }) 
    });
    //areaname ends

    
  

    /* GET customer listing */
    router.get('/customer', isAuthenticated, function(req,res){
        var suname =req.session.uname;
        var suid =req.session.uid;
        var srid=req.session.rid;
        var scid =req.session.cid;


        var sql = "SELECT distinct a.customer_id,a.customer_name from tbl_customer a,tbl_user b where a.customer_id=b.customer_id ";
        getSQLData(sql, function(resultsets){
           results = resultsets;
           res.send({custdata:results});
        })
    });

    /* GET msp listing */
    router.get('/msp', isAuthenticated, function(req,res){
        var suname =req.session.uname;
        var suid =req.session.uid;
        var srid=req.session.rid;
        var scid =req.session.cid;
        var sql = "";
        if(srid == '1'){
          sql = "SELECT msp_id,msp_name from tbl_msp";
        }else{
          sql = "SELECT msp_id,msp_name from tbl_msp where customer_id='"+scid+"'";
        }
        
        getSQLData(sql, function(resultsets){
           results = resultsets;
           res.send({custdata:results});
        })
    });

    /* back to main screen */
    router.get('/cancelAdd', function(req, res, next) {
        res.redirect('/');
    });

    /* delete a customer */
    router.post('/delete',isAuthenticated,function(req,res){
        var suname =req.session.uname;
        var srid=req.session.rid;

        var sql = "DELETE FROM tbl_site WHERE site_id in ("+req.body.recordids+")";
        //console.log("Delete SQL :"+sql);
        getSQLData(sql, function(dbresultsets){
            if(dbresultsets.length > 0){
              msg = "Deleted Successfully";
            }
        });
        res.redirect('/site');
    });  


    /* delete a customer */
    router.get('/delete/:id',isAuthenticated,function(req,res){
        var suname =req.session.uname;
        var srid=req.session.rid;

        var sql = "DELETE FROM tbl_site WHERE site_id in ("+req.params.id+")";
        //console.log("Delete SQL :"+sql);
        getSQLData(sql, function(dbresultsets){
            if(dbresultsets.length > 0){
              msg = "Deleted Successfully";
            }
        });
        res.redirect('/site');
    });  

    /* new site */
    router.get('/addsite',isAuthenticated,function(req,res){
        var results;
        var suname =req.session.uname;
        var srid=req.session.rid;
        var suid =req.session.uid;
        var scid =req.session.cid;
        var sql = "SELECT a.country_name,b.zone_name,c.state_name,d.district_name,e.area_name "+
                  "FROM tbl_country a "+
                  "LEFT JOIN tbl_zone b ON a.country_id=b.country_id "+
                  "LEFT JOIN tbl_state c ON b.zone_id= c.zone_id "+
                  "LEFT JOIN tbl_district d ON c.state_id = d.state_id "+
                  "LEFT JOIN tbl_area e ON d.district_id = e.district_id";  
        getSQLData(sql, function(resultsets){
            results = JSON.stringify(resultsets);
            res.render('site/newsite',{title:"New Site",sess_name: suname, sess_uid: suid, sess_cid: scid, sess_id: srid, data: results});
        
        });          
    });  

    

    router.get('/edit/:id',isAuthenticated,function(req, res){

        var suname =req.session.uname;
        var srid=req.session.rid;
        var id = req.params.id;
        //console.log("ID :"+id);
        var sql = "SELECT a.site_name,a.site_id,a.site_code,a.site_msp, a.no_atm, a.area_id,c.area_name, a.customer_id,b.customer_name,a.site_address,a.site_pincode,a.site_latitude,a.site_longitude,a.site_videolink,a.use_videolink,a.site_status, "+
              " d.compliant_id,d.person_name,d.person_mobno,d.title "+
              "FROM tbl_site a,tbl_customer b,tbl_area c,tbl_compliant d "+
              "WHERE a.customer_id = b.customer_id and a.area_id=c.area_id "+
              "and a.site_id=d.site_id and a.site_id = '"+id+"'";
       
        console.log("SQL :"+sql);      
        getSQLData(sql, function(dbresultsets){
            results = dbresultsets;
            res.render('site/editsite',{title:"Editsite",sess_name: suname, sess_id: srid,data:results});
        });
     
    });  
      
    router.post('/update',isAuthenticated,function(req, res){
          var msg = "";
          var site = req.body;
          var sid = site.siteid;
          var sitename = site.sitename;
          var sitecode = site.sitecode;
          var siteaddress = site.siteaddress;
          var sitepincode = site.sitepincode;
          var sitemsp = site.sitemsp;
          var sitelat = site.sitelat;
          var sitelng = site.sitelng;
          var sitevid = site.sitevid;
          var usevideolink = site.chklink;
          var sitestatus = site.site_staus;
          var now = moment().format("YYYY-MM-DD HH:mm:ss");
         
          var qrtname = site.qrtname;
          var qrtno = site.qrtno;
          var custname = site.custname;
          var custno = site.custno;
          var policename = site.policename;
          var policeno = site.policeno;
          var firename = site.firename;
          var fireno = site.fireno;
          var qcompliantid = site.qcompno;
          var fcompliantid = site.fcompno;
          var pcompliantid = site.pcompno;
          var ccompliantid = site.ccompno;
          var noofatm = site.no_atm;
          var sql = "UPDATE tbl_site SET site_name='"+sitename+"',site_code='"+sitecode+"',no_atm='"+noofatm+"',site_msp='"+sitemsp+"',site_address='"+siteaddress+"',site_pincode='"+sitepincode+"',site_longitude='"+sitelng+"',site_latitude='"+sitelat+"',site_videolink='"+sitevid+"',use_videolink='"+usevideolink+"',site_status='"+sitestatus+"',updated_date='"+now+"' WHERE site_id = '"+sid+"'";
          //console.log("SQL :"+sql);
         // getSQLData(sql, function(res){
          dbconnection.getConnection(function(err, connection) { 
            connection.query(sql, function(err, res){ 
              msg = "User Successfully Added";

              for(var z=0;z<qrtname.length;z++){
                  compid = qcompliantid[z];
                  qname = qrtname[z];
                  qno = qrtno[z];
                  newsql = "UPDATE tbl_compliant SET person_name ='"+qname+"',person_mobno='"+qno+"',updated_date='"+now+"' WHERE site_id = '"+sid+"' AND compliant_id='"+compid+"' AND title='QRT'";
                  //console.log("SQL:"+newsql);
                  connection.query(newsql, function(err, res){
                    if (err) {
                      throw err;
                     }
                  }); 
              }//

              for(var z=0;z<qrtname.length;z++){
                  compid = pcompliantid[z];      
                  pname = policename[z];
                  pno = policeno[z];
                  newsql = "UPDATE tbl_compliant SET person_name ='"+pname+"',person_mobno='"+pno+"',updated_date='"+now+"' WHERE site_id = '"+sid+"' AND compliant_id='"+compid+"' AND title='POLICE'";
                  connection.query(newsql, function(err, res){
                    if (err) {
                      throw err;
                    }
                  }); 
              }   
              
              for(var z=0;z<qrtname.length;z++){   
                  compid = ccompliantid[z];
                  cname = custname[z];
                  cno = custno[z];
                  newsql = "UPDATE tbl_compliant SET person_name ='"+cname+"',person_mobno='"+cno+"',updated_date='"+now+"' WHERE site_id = '"+sid+"' AND compliant_id='"+compid+"' AND title='CUSTOMER'";
                  connection.query(newsql, function(err, res){
                    if (err) {
                      throw err;
                    }
                  }); 
              }

              for(var z=0;z<qrtname.length;z++){  
                  compid = fcompliantid[z];     
                  fname = firename[z];
                  fno = fireno[z];
                  newsql = "UPDATE tbl_compliant SET person_name ='"+fname+"',person_mobno='"+fno+"',updated_date='"+now+"' WHERE site_id = '"+sid+"' AND compliant_id='"+compid+"' AND title='FIRE'";
                  connection.query(newsql, function(err, res){
                      if (err) {
                          throw err;
                      }
                  }); 
              }
          });
          connection.release();
        });
          res.redirect('/site');  
    });  

     
      
    /* save user1 */
    router.post('/savesite',isAuthenticated,function(req,res){
          var msg = "";
          //console.log("SaveSite Triggered :");
          
          var site = req.body;
          var cid = site.customerid;
          var areaname = site.areaname;
          var sitename = site.sitename;
          var sitecode = site.sitecode;
          var msp = site.sitemsp;
          var address = site.siteaddress;
          var pincode = site.sitepincode;
          var lat = site.sitelatitude;
          var lng = site.sitelongitude;
          var videolink = site.sitevideolink;
          var usevideolink = site.chklink;
          var now = moment().format("YYYY-MM-DD HH:mm:ss");
          var qrtname = site.qrtname;
          var qrtno = site.qrtno;
          var custname = site.custname;
          var custno = site.custno;
          var policename = site.policename;
          var policeno = site.policeno;
          var firename = site.firename;
          var fireno = site.fireno;

          var noofatm = site.no_atm;
          var aid=0;
          var newsiteid=0;
          values1="";
          
          sql = "select area_id from tbl_area where area_name='"+areaname+"'";
          //console.log("Area getSQLData :"+sql);
          getSQLData(sql, function(resultsets){
            if(Object.keys(resultsets).length != 0){
              aid = resultsets[0].area_id;
            }
       
            //console.log("Area ID :"+aid);
            sql = "select customer_id from tbl_customer where customer_id='"+cid+"'";
            console.log("Customer SQL :"+sql);
            dbconnection.getConnection(function(err, connection) {
              connection.query(sql, function(err, resultsets){
                if(Object.keys(resultsets).length != 0){
                  cid = resultsets[0].customer_id;
                  sqls = "INSERT INTO tbl_site (customer_id, area_id, site_code, site_name, site_msp, site_address, site_pincode, site_latitude, site_longitude, site_videolink, use_videolink, no_atm, created_date,updated_date) "+
                    " values ('"+cid+"','"+aid+"','"+sitecode+"','"+sitename+"','"+msp+"','"+address+"','"+pincode+"','"+lat+"','"+lng+"','"+videolink+"','"+usevideolink+"','"+noofatm+"','"+now+"','"+now+"')";
                  //console.log("SQL :"+sqls);
                  connection.query(sqls, function(err, result){
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
                        newsiteid= result.insertId;
                        newsql = "";
                        
                        //QRT
                        for(var z=0;z<qrtname.length;z++){
                          qname = qrtname[z];
                          qno = qrtno[z];
                          pname = policename[z];
                          pno = policeno[z];
                          cname = custname[z];
                          cno = custno[z];
                          fname = firename[z];
                          fno = fireno[z];
                          values1 += "('"+newsiteid+"','"+qname+"','"+qno+"','QRT','"+now+"','"+now+"'),";
                          values1 += "('"+newsiteid+"','"+pname+"','"+pno+"','POLICE','"+now+"','"+now+"'),";
                          values1 += "('"+newsiteid+"','"+cname+"','"+cno+"','CUSTOMER','"+now+"','"+now+"'),";
                          values1 += "('"+newsiteid+"','"+fname+"','"+fno+"','FIRE','"+now+"','"+now+"'),";
                        }
                        values1 = values1.substr(0,values1.length-1);
                        
                        newsql = "insert into tbl_compliant(site_id,person_name,person_mobno,title,created_date,updated_date) values "+values1;
                        connection.query(newsql, function(err, res){
                            if (err) {
                              return connection.rollback(function() {
                                throw err;
                              });
                            }
                            msg = "User Successfully Added";
                        }); 
                    });
                  });   //end of insert query  
                }else{
                  msg = "User Already Exists";
                }    
            });
            connection.release();
          });
        });//end of call getData function  
        res.redirect('/site');      
    }); //end of save user1 function    
    

    //appending XLS file datas into database
    router.post('/appenddata',isAuthenticated,function(req, res){
        console.log("entered appenddata");
        var suname =req.session.uname;
        var srid=req.session.rid;
        var now = moment().format("YYYY-MM-DD HH:mm:ss");
        //var id = req.params.id;
        var customer_id=req.body.customer_id;
        var area_id=[];
        console.log("customer_id===="+customer_id);
        var arr=req.body.values;
        console.log("array is=="+arr.SiteID);
        if(arr.Area != "0"){
         var sql="insert into tbl_site(customer_id,area_id,site_code,site_name,site_msp,site_address,site_pincode,created_date,updated_date,site_latitude,site_longitude) values('"+customer_id+"','"+arr.Area+"','"+arr.SiteID+"','"+arr.SiteName +"','"+arr.MSP +"','"+arr.Address +"','"+arr.Pincode +"',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'"+arr.Latitude+"','"+arr.Longitude+"')";        
          //console.log("sql is=="+sql);
          dbconnection.query(sql, function(err, result){
              if (err) {
                throw err;
              }

              newsiteid= result.insertId;
              newsql = "";
              values1="";          
              //QRT
              for(var z=0;z<3;z++){
                values1 += "('"+newsiteid+"','','','QRT','"+now+"','"+now+"'),";
                values1 += "('"+newsiteid+"','','','POLICE','"+now+"','"+now+"'),";
                values1 += "('"+newsiteid+"','','','CUSTOMER','"+now+"','"+now+"'),";
                values1 += "('"+newsiteid+"','','','FIRE','"+now+"','"+now+"'),";
              }
              values1 = values1.substr(0,values1.length-1);
                        
              newsql = "insert into tbl_compliant(site_id,person_name,person_mobno,title,created_date,updated_date) values "+values1;
              dbconnection.query(newsql, function(err, res){
                  if (err) {
                    throw err;
                  }
                  msg = "User Successfully Added";
              });  
          });//connection
        }
      res.send('success');                             
    });//router  
    //end of appending function


    router.get('/getdata', function(req, res, next) {

        var query;
        var results;
        var suname =req.session.uname;
        var suid =req.session.uid;
        var srid=req.session.rid;
        var queryStr = "";
        var rolename = req.query.role_name;
        var updatedate=req.query.updated_date;
        var createddate=req.query.created_date;
        var cdate;
        if(updatedate.match("-")){
          cdate = moment(req.query.updated_date,'DD-MM-YYYY').format("YYYY-MM-DD");
          updatedate=cdate;
        }
        if(updatedate.match("/")){
          cdate = moment(req.query.updated_date,'DD/MM/YYYY').format("YYYY-MM-DD");
          updatedate=cdate;
        }
        if(createddate.match("/")){
          cdate = moment(req.query.created_date,'DD/MM/YYYY').format("YYYY-MM-DD");
          createddate=cdate;
        }
        if(createddate.match("-")){
          cdate = moment(req.query.created_date,'DD-MM-YYYY').format("YYYY-MM-DD");
          createddate=cdate;
        }
        if(req.query.customer_name != ''){
          queryStr = " AND b.customer_name ='"+req.query.customer_name+"'";
        }    
        if(req.query.site_code != ''){
          if(queryStr != ''){
            queryStr += " AND a.site_code='"+req.query.site_code+"'";
            }else{
                queryStr = " AND a.site_code='"+req.query.site_code+"'";
            }
        } 
        if(req.query.area_name != ''){
            if(queryStr != ''){
                queryStr += " AND c.area_name='"+req.query.area_name+"'";
            }else{
                queryStr = " AND c.area_name='"+req.query.area_name+"'";
            }
        } 
         if(req.query.site_name != ''){
            if(queryStr != ''){
                
                queryStr += " AND a.site_name='"+req.query.site_name+"'";
            }else{
                queryStr = " AND a.site_name='"+req.query.site_name+"'";
            }
        } 
         if(req.query.updated_date != ''){
            if(queryStr != ''){
                
                queryStr += " AND date_format(a.updated_date,'%Y-%m-%d')='"+updatedate+"'";
            }else{
                queryStr = " AND date_format(a.updated_date,'%Y-%m-%d')='"+updatedate+"'";
            }
        } 
           
        if(req.query.created_date != ''){
            if(queryStr != ''){
                
                queryStr += " AND date_format(a.created_date,'%Y-%m-%d')='"+createddate+"'";
            }else{
                queryStr = " AND date_format(a.created_date,'%Y-%m-%d')='"+createddate+"'";
            }
        } 

        var qry="";
        if(srid != '1'){
          qry = " and b.user_id='"+suid+"'";
        }
        var sql = "SELECT a.site_name,a.site_id,a.site_code,a.site_status,a.area_id,c.area_name,a.customer_id,b.customer_name,a.site_address,a.site_pincode,a.site_latitude,a.site_longitude,a.site_videolink,a.created_date,a.updated_date "+
              "FROM tbl_site a,tbl_customer b,tbl_area c WHERE a.customer_id = b.customer_id and a.area_id=c.area_id"+qry+queryStr; 
        console.log("List Triggered :"+sql);       
        getSQLData(sql, function(dbresultsets){
            results = dbresultsets;
            //console.log("results :"+results);
            res.send({datas: results});
        });
        
    });
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
