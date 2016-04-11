
var express = require('express');
var router = express.Router();
var moment = require('moment');


var isAuthenticated = function (req, res, next) {
  // if user is authenticated in the session, call the next() to call the next request handler 
  // Passport adds this method to request object. A middleware is allowed to add properties to
  // request and response objects
  if (req.isAuthenticated())
    return next();
  // if the user is not authenticated then redirect him to the login page
  res.redirect('/');
}


module.exports = function(passport,connection) {
    /* GET geography listing. */
    
  //sitestart
  router.get('/', isAuthenticated, function(req, res){
     console.log("site triggered ");
      var suname =req.session.uname;
      var suid =req.session.uid;
      var srid=req.session.rid;
      var cid = req.session.cid;
      var perpage = req.session.perrows;
      var sql2="";
      var sql3="";
      var sql4="";
      var sql5="";
      var results;
      var outageDatas = [];
      var zoneresults="";
      var stateresults="";
      var userresults="";
      var country_id=req.query.country_id;
      //console.log("country_id="+country_id);
      var zone_id=req.query.zone_id;
      //console.log("zone_id="+zone_id);
      var state_id=req.query.state_id;
      //console.log("state_id="+state_id);
      var district_id=req.query.district_id;
      //console.log("district_id="+district_id);
      var area_id=req.query.area_id;
      //console.log("area_id="+area_id);
      var user_id=req.query.user_id;
      console.log("userid=="+user_id);
      var siteid=req.query.chkall;
      console.log("chkall =="+siteid);
      
      



      //combobox for zone
      if( country_id == "" || typeof country_id === "undefined"){
          sql2 = "SELECT zone_id,zone_name from tbl_zone ";
      }else{  
         sql2 = "SELECT  tbl_zone.zone_id ,tbl_zone.zone_name from tbl_country,tbl_zone  where tbl_country.country_id=tbl_zone.country_id AND tbl_zone.country_id='"+country_id+"'";
      }

      getSQLData(sql2, function(resultsets){
          console.log("zone........sql"+sql2);
           zoneresults = resultsets;
           //console.log("zone....."+JSON.stringify(zoneresults));
      //});

      //combobox for State
      if( zone_id == "" || typeof zone_id === "undefined"){
          sql3 = "SELECT state_id,state_name from tbl_state ";
      }else{  
          sql3 = "SELECT  tbl_state.state_id ,tbl_state.state_name from tbl_state,tbl_zone  where tbl_zone.zone_id=tbl_state.zone_id AND tbl_state.zone_id='"+zone_id+"'";
      }

      getSQLData(sql3, function(resultsets){
          console.log("state........sql"+sql3);
          stateresults = resultsets;
           //console.log("state .."+JSON.stringify(stateresults));
          //});

        //combobox for dist
        if( state_id == "" || typeof state_id === "undefined"){
           sql4 = "SELECT district_id,district_name from tbl_district ";
        }else{  
           sql4 = "SELECT  tbl_district.district_id ,tbl_district.district_name from tbl_district,tbl_state  where tbl_district.state_id=tbl_state.state_id AND tbl_district.state_id='"+state_id+"'";
        }

        getSQLData(sql4, function(resultsets){
          console.log("state........sql"+sql4);
          distresults = resultsets;
          

          //combobox for area
          if( district_id == "" || typeof district_id === "undefined"){
             sql5 = "SELECT area_id,area_name from tbl_area ";
          }else{  
            sql5 = "SELECT  tbl_area.area_id ,tbl_area.area_name from tbl_area,tbl_district  where tbl_area.district_id=tbl_district.district_id AND tbl_area.district_id='"+district_id+"'";
          }

          getSQLData(sql5, function(resultsets){
              console.log("area........sql"+sql5);
              arearesults = resultsets;
           
              if ((req.query && typeof country_id === 'undefined' && typeof zone_id === 'undefined' && typeof state_id === 'undefined' && typeof district_id === 'undefined' && typeof area_id === 'undefined'  ) || (country_id === '' && zone_id === '' && state_id === '' && district_id === '' && area_id === '')){
                sql="SELECT  site_code  "+
                         " FROM tbl_country,tbl_area,tbl_site "+
                         " WHERE tbl_area.area_id=tbl_site.area_id "+
                         " AND tbl_country.country_id=tbl_area.country_id ";
              }else{
                var query = "";
                  if(country_id != "" && typeof country_id != 'undefined') {
                          query = query+ " AND tbl_area.country_id = '"+ country_id +"'";
                  }

                  if(zone_id != "" && typeof zone_id != 'undefined') {
                          query = query+ " AND tbl_area.zone_id = '"+ zone_id +"'";
                  }

                  if(state_id != "" && typeof state_id != 'undefined') {
                          query = query+ " AND tbl_area.state_id = '"+ state_id +"'";
                  }

                  if(district_id != "" && typeof district_id != 'undefined') {
                          query = query+ " AND tbl_area.district_id = '"+ district_id +"'";
                  }

                  if(area_id != "" && typeof area_id != 'undefined') {
                          query = query+ " AND tbl_area.area_id = '"+ area_id +"'";
                  }

                     sql="SELECT  site_code  "+
                         " FROM tbl_country,tbl_area,tbl_site "+
                         " WHERE tbl_area.area_id=tbl_site.area_id "+
                         " AND tbl_country.country_id=tbl_area.country_id "+query ;
                        
              }
              console.log("sql=="+sql);
               connection.query(sql)
               .on('result', function(data){
                    // Push results onto the notes array
                    res.header("Access-Control-Allow-Origin","*");
                    res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");;
                    outageDatas.push(data);
                })  

                .on('end', function(){
                    //console.log("end :"+students);
                    // Only emit notes after query has been completed
                    //socket.emit('initial alarm', notes)console.log("Data :"+students.length);
                    var totalDatas = outageDatas.length;
                    console.log("total records::"+totalDatas);
                            
                    res.render('assignsite/index',{title:"AlarmLists", 
                        sess_name: suname, 
                        sess_id: srid,
                        siteid: siteid,
                        zoneresults:zoneresults,
                        stateresults:stateresults,
                        distresults:distresults,
                        arearesults:arearesults,
                        userresults:userresults,
                        country_id:req.query.country_id,
                        zone_id:req.query.zone_id,
                        state_id:req.query.state_id,
                        district_id:req.query.district_id,
                        area_id:req.query.area_id,
                        user_id:user_id,
                        outageDatas: outageDatas,
                        sqlquery: sql,
                        totalDatas: totalDatas,
                        sess_report:req.session.reports_info
                    });
                }); 
            });
          });
        });
    });      
});
  //assign site end


router.get('/country', isAuthenticated, function(req, res){
     var sql = "SELECT * from tbl_country";
        getSQLData(sql, function(resultsets){
           results = resultsets;
           res.send({custdata:results});
        })
});


router.get('/user', isAuthenticated, function(req, res){
     var sql = "SELECT * from tbl_user where role_id=5";
        getSQLData(sql, function(resultsets){
           results = resultsets;
           res.send({custdata:results});
        })
});

router.post('/save',isAuthenticated,function(req,res){
        var suname =req.session.uname;
        var srid=req.session.rid;
        var user_id=req.body.user_id;
        var siteid=req.body.recordids;
        var splitsite=siteid.toString().split(",");
        console.log("user_id is=="+user_id);
        console.log("Save Site :"+splitsite.length);
        //var sql = "DELETE FROM tbl_site WHERE site_id in ("+req.body.recordids+")";
        //var sql="UPDATE tbl_field_users_child SET  field_user_id='"+user_id+"' WHERE siteid IN("+req.body.recordids+")";
        var sql1="DELETE  FROM tbl_field_users_child WHERE field_user_id='"+user_id+"'";
        console.log("delete sql is=="+sql1);
        getSQLData(sql1, function(resultsets){
          for(var i=0;i<splitsite.length;i++){
                 var sql="INSERT INTO tbl_field_users_child (siteid,recorded_date,field_user_id) VALUES("+splitsite[i]+",CURRENT_TIMESTAMP,'"+user_id+"')";
                 console.log("insert sql=="+sql);
                 connection.query(sql, function(err, res){
                    if (err) {
                      throw err;
                    }  
                    if(res.affectedRows > 0){
                      console.log('success!');
                      msg = "Saved Successfully";
                    }
                  });
              }//for ends    
        })
        res.redirect('/assignsite');
});  

router.post('/userSites', isAuthenticated, function(req, res){
     var user_id=req.body.user_id;
     console.log("user id is::"+user_id);
     var sql = "SELECT siteid from tbl_field_users_child where field_user_id='"+user_id+"' ";
     console.log("user Site sql is=="+sql);
        getSQLData(sql, function(resultsets){
           results = resultsets;
           res.send({custdata:results});
        })
});



  function getSQLData(sqls, cb) { 
    //console.log("sqls :"+sqls);
    var resultsets;
    connection.query(sqls, function(err, res1){
      if(res1.length >0){
        resultsets=res1;
      }else{
        resultsets={};
      }
      cb(resultsets); //callback if all queries are processed
    });
  };




  return router;
}