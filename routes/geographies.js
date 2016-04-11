var express = require('express');
var router = express.Router();
//var Q = require('Q');

var isAuthenticated = function (req, res, next) {
  // if user is authenticated in the session, call the next() to call the next request handler 
  // Passport adds this method to request object. A middleware is allowed to add properties to
  // request and response objects
  if (req.isAuthenticated()){
    
    return next();
  }
    
  // if the user is not authenticated then redirect him to the login page
  res.redirect('/');
}



module.exports = function(passport,dbconnection) {
	 /* GET geography listing. */
  	router.get('/', isAuthenticated, function(req, res){
        var query;
        var results;
        var suname =req.session.uname;
        var srid=req.session.rid;
        
        sql = "SELECT a.country_name,b.zone_name,c.state_name,d.district_name,e.area_name "+
                  "FROM tbl_country a "+
                  "LEFT JOIN tbl_zone b ON a.country_id=b.country_id "+
                  "LEFT JOIN tbl_state c ON b.zone_id= c.zone_id "+
                  "LEFT JOIN tbl_district d ON c.state_id = d.state_id "+
                  "LEFT JOIN tbl_area e ON d.district_id = e.district_id";  

        getSQLDatas(sql, function(resultsets){
            results = JSON.stringify(resultsets);
            res.render('geography/index',{title:"RESTful Crud Example", sess_name: suname, sess_id: srid, data: results});
        });
    });   

    
  
    /* add new geography*/
    router.get('/add', function(req, res) {
        var results;
        //console.log("Add Event Triggered");
        sql = "SELECT a.country_name,b.zone_name,c.state_name,d.district_name,e.area_name "+
                "FROM tbl_country a "+
                "LEFT JOIN tbl_zone b ON a.country_id=b.country_id "+
                "LEFT JOIN tbl_state c ON b.zone_id= c.zone_id "+
                "LEFT JOIN tbl_district d ON c.state_id = d.district_id "+
                "LEFT JOIN tbl_area e ON d.district_id = e.district_id";  

        getSQLDatas(sql, function(result){
            results = JSON.stringify(result);
            res.render('geography/newgeo',{title:"New Geography",data:results});
            
        });
        
    });  


    /* back to geography*/
    router.get('/cancelAdd', function(req, res, next) {
        res.redirect('/');
    });

  
    /* save new geography*/
    router.post('/addgeography',isAuthenticated,function(req,res){
        var name = req.body.field1;
        var hname = req.body.field2;
       // console.log("name :"+name+":hname :"+hname);
        var spltdata = hname.split("/");
        var lendata = spltdata.length-1;
        var sql="";
        //console.log("Org Length :"+spltdata.length+": Last Data:"+spltdata[spltdata.length-1]);
        if(lendata == 0){//country
            sql = "insert into tbl_country (country_name) values ('"+name+"')";
        }else if(lendata == 1){//zone
            cname = spltdata[1].trim();
            sql = "insert into tbl_zone (zone_name,country_id) values ('"+name+"',(select country_id from tbl_country where country_name='"+cname+"'))";
        }else if(lendata == 2){//state
            cname = spltdata[1].trim();
            zname = spltdata[2].trim();
            sql = "insert into tbl_state( state_name, country_id, zone_id ) VALUES ('"+name+"',("+
                "select b.country_id FROM tbl_country b where b.country_name =  '"+cname+"'), ("+
                "select a.zone_id FROM tbl_zone a, tbl_country b "+
                "where a.country_id = b.country_id AND b.country_name =  '"+cname+"' AND a.zone_name =  '"+zname+"'))";
          
           //sql = "insert into tbl_state (state_name,country_id,zone_id) values ('"+name+"',(select b.country_id from tbl_country b where a.country_id=b.country_id and a.zone_name='"+zname+"' and b.country_name='"+cname+"'))";
        }else if(lendata == 3){ //district
            cname = spltdata[1].trim();
            zname = spltdata[2].trim();
            sname = spltdata[3].trim();
            sql = "insert into tbl_district(district_name,country_id,zone_id,state_id ) VALUES ('"+name+"',("+
                  "select b.country_id FROM tbl_country b where b.country_name =  '"+cname+"'), ("+
                  "select a.zone_id FROM tbl_zone a, tbl_country b "+
                  "where a.country_id = b.country_id AND b.country_name =  '"+cname+"' AND a.zone_name =  '"+zname+"'), ("+
                  "select a.state_id FROM tbl_state a,tbl_zone b, tbl_country c "+
                  "where a.country_id = c.country_id AND a.zone_id = b.zone_id AND c.country_name =  '"+cname+"' AND "+
                  "a.state_name = '"+sname+"' AND b.zone_name =  '"+zname+"'))";
        }else if(lendata == 4){ //area
            cname = spltdata[1].trim();
            zname = spltdata[2].trim();
            sname = spltdata[3].trim();
            dname = spltdata[4].trim();
           // console.log("Area Triggered");
            sql = "insert into tbl_area(area_name,country_id,zone_id,state_id,district_id ) VALUES ('"+name+"',("+
                "select b.country_id FROM tbl_country b where b.country_name =  '"+cname+"'), ("+
                "select a.zone_id FROM tbl_zone a, tbl_country b "+
                "where a.country_id = b.country_id AND b.country_name =  '"+cname+"' AND a.zone_name =  '"+zname+"'), ("+
                "select a.state_id FROM tbl_state a,tbl_zone b, tbl_country c "+
                "where a.country_id = c.country_id AND a.zone_id = b.zone_id AND c.country_name =  '"+cname+"'"+
                "AND a.state_name = '"+sname+"' AND b.zone_name =  '"+zname+"'),("+ 
                "select a.district_id from tbl_district a,tbl_state b,tbl_zone c,tbl_country d "+
                "where a.country_id=d.country_id and "+
                "a.state_id=b.state_id and a.zone_id=c.zone_id and "+
                "a.district_name='"+dname+"' and b.state_name='"+sname+"' and "+
                "c.zone_name='"+zname+"' and d.country_name='"+cname+"'))";
        }//end of else statement    
         console.log("sql :"+sql);
        if(sql != ""){
             getSQLDatas(sql, function(result){
             });
        }
        res.redirect('/');
    });//end of Save Geography fn


    /* edit geography*/
    router.post('/updategeography',isAuthenticated,function(req,res){
        var name = req.body.field1;
        var hname = req.body.field2;
        var qrystring = req.body.field3;
        //console.log("name :"+name+":hname :"+hname);
        var spltdata = hname.split("/");
        var lendata = spltdata.length-1;
        var sql="";
        //console.log("Org Length :"+spltdata.length+": Last Data:"+spltdata[spltdata.length-1]);
        if(lendata == 1){//country
            sql = "update tbl_country set country_name = '"+name+"' where country_name = '"+qrystring+"'";
        }else if(lendata == 2){//zone
            cname = spltdata[1].trim();
            sql = "update tbl_zone set zone_name='"+name+"' where zone_name='"+qrystring+"' and country_id = (select country_id from tbl_country where country_name='"+cname+"')";
   
        }else if(lendata == 3){//state
            cname = spltdata[1].trim();
            zname = spltdata[2].trim();
            sql = "update tbl_state set state_name='"+name+"' where state_name='"+qrystring+"' and "+
                    "country_id= (select country_id from tbl_country where country_name='"+cname+"') and "+
                    "zone_id = (select a.zone_id FROM tbl_zone a, tbl_country b where a.country_id = b.country_id AND b.country_name =  '"+cname+"' AND a.zone_name =  '"+zname+"')";
        }else if(lendata == 4){ //district
            cname = spltdata[1].trim();
            zname = spltdata[2].trim();
            sname = spltdata[3].trim();
            sql = "update tbl_district set district_name='"+name+"' where district_name='"+qrystring+"' and "+
                    "country_id= (select country_id from tbl_country where country_name='"+cname+"') and "+
                    "zone_id = (select a.zone_id FROM tbl_zone a, tbl_country b where a.country_id = b.country_id AND b.country_name =  '"+cname+"' AND a.zone_name =  '"+zname+"') and "+
                    "state_id = (select a.state_id FROM tbl_state a,tbl_zone b, tbl_country c where a.country_id = c.country_id AND a.zone_id = b.zone_id AND c.country_name =  '"+cname+"' AND "+
                  "a.state_name = '"+sname+"' AND b.zone_name =  '"+zname+"'))";

        }else if(lendata == 5){ //area
            cname = spltdata[1].trim();
            zname = spltdata[2].trim();
            sname = spltdata[3].trim();
            dname = spltdata[4].trim();
           // console.log("Area Triggered");
           sql = "update tbl_area set area_name='"+name+"' where area_name='"+qrystring+"' and "+
                    "country_id= (select country_id from tbl_country where country_name='"+cname+"') and "+
                    "zone_id = (select a.zone_id FROM tbl_zone a, tbl_country b where a.country_id = b.country_id AND b.country_name =  '"+cname+"' AND a.zone_name =  '"+zname+"') and "+
                    "state_id = (select a.state_id FROM tbl_state a,tbl_zone b, tbl_country c where a.country_id = c.country_id AND a.zone_id = b.zone_id AND c.country_name =  '"+cname+"' AND a.state_name = '"+sname+"' AND b.zone_name =  '"+zname+"') and "+
                    "district_id =(select a.district_id from tbl_district a,tbl_state b,tbl_zone c,tbl_country d where a.country_id=d.country_id and a.state_id=b.state_id and a.zone_id=c.zone_id and a.district_name='"+dname+"' and b.state_name='"+sname+"' and c.zone_name='"+zname+"' and d.country_name='"+cname+"')";
            
        }//end of else statement    
        
        dbconnection.getConnection(function(err, connection) {
          connection.query(sql, function(err, res1){
              connection.release(); 
          });
        });       
        //res.redirect('/');
    });//end of Save Geography fn
	

    /* delete geography */
    router.post('/deletegeography',isAuthenticated,function(req,res){
        var name = req.body.field1;
        var hname = req.body.field2;
        var qrystring = req.body.field3;
        //console.log("name :"+name+":hname :"+hname);
        var spltdata = hname.split("/");
        var lendata = spltdata.length-1;
        var sql="";
        //console.log("Org Length :"+spltdata.length+": Last Data:"+spltdata[spltdata.length-1]);
        if(lendata == 1){//country
            sql = "delete from tbl_country where country_name = '"+qrystring+"'";
        }else if(lendata == 2){//zone
            cname = spltdata[1].trim();
            sql = "delete from tbl_zone where zone_name='"+qrystring+"' and country_id = (select country_id from tbl_country where country_name='"+cname+"')";
   
        }else if(lendata == 3){//state
            cname = spltdata[1].trim();
            zname = spltdata[2].trim();
            sql = "delete from tbl_state where state_name='"+qrystring+"' and "+
                    "country_id= (select country_id from tbl_country where country_name='"+cname+"') and "+
                    "zone_id = (select a.zone_id FROM tbl_zone a, tbl_country b where a.country_id = b.country_id AND b.country_name =  '"+cname+"' AND a.zone_name =  '"+zname+"')";
        
        }else if(lendata == 4){ //district
            cname = spltdata[1].trim();
            zname = spltdata[2].trim();
            sname = spltdata[3].trim();
            sql = "delete from tbl_district where district_name='"+qrystring+"' and "+
                    "country_id= (select country_id from tbl_country where country_name='"+cname+"') and "+
                    "zone_id = (select a.zone_id FROM tbl_zone a, tbl_country b where a.country_id = b.country_id AND b.country_name =  '"+cname+"' AND a.zone_name =  '"+zname+"') and "+
                    "state_id = (select a.state_id FROM tbl_state a,tbl_zone b, tbl_country c where a.country_id = c.country_id AND a.zone_id = b.zone_id AND c.country_name =  '"+cname+"' AND "+
                    "a.state_name = '"+sname+"' AND b.zone_name =  '"+zname+"')";    
        }else if(lendata == 5){ //area
            cname = spltdata[1].trim();
            zname = spltdata[2].trim();
            sname = spltdata[3].trim();
            dname = spltdata[4].trim();
           // console.log("Area Triggered");
           sql = "delete from tbl_area where area_name='"+qrystring+"' and "+
                    "country_id= (select country_id from tbl_country where country_name='"+cname+"') and "+
                    "zone_id = (select a.zone_id FROM tbl_zone a, tbl_country b where a.country_id = b.country_id AND b.country_name =  '"+cname+"' AND a.zone_name =  '"+zname+"') and "+
                    "state_id = (select a.state_id FROM tbl_state a,tbl_zone b, tbl_country c where a.country_id = c.country_id AND a.zone_id = b.zone_id AND c.country_name =  '"+cname+"' AND a.state_name = '"+sname+"' AND b.zone_name =  '"+zname+"') and "+
                    "district_id =(select a.district_id from tbl_district a,tbl_state b,tbl_zone c,tbl_country d where a.country_id=d.country_id and a.state_id=b.state_id and a.zone_id=c.zone_id and a.district_name='"+dname+"' and b.state_name='"+sname+"' and c.zone_name='"+zname+"' and d.country_name='"+cname+"')";
        }//end of else statement    
        console.log("SQL:"+sql);     
        dbconnection.getConnection(function(err, connection) {
            connection.query(sql, function(err, res1){
                connection.release(); 
            });
        });   
        //res.redirect('/');
    });//end of Save Geography fn


     /* callback function */
    function getSQLDatas(sqls, cb) { 
        var resultsets;
        console.log("Geo SQL :"+sqls);
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

