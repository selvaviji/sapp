
var express = require('express');
var router = express.Router();
var moment = require('moment');

var minRange=10;
var maxRange=50;
var stepRange=10;

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



    
router.get('/', isAuthenticated, function(req, res){
      var suname =req.session.uname;
      var suid =req.session.uid;
      var srid=req.session.rid;
      var cid = req.session.cid;
      var perpage = req.session.perrows;
      var pinresults;
      var customer_id; 
      if(cid != "0"){
        customer_id = cid;
      }else{
        customer_id = req.query.customer_id;
      }

      if(customer_id == "0" || customer_id == "" || typeof customer_id === "undefined"){
        customername = "All";
      }else{  
        getCustomerName(customer_id,function(dbresults){
          //console.log("customerdata :"+dbresults);
          customername=dbresults;
        });
      }

      //site combobox
       if(customer_id == "0" || customer_id == "" || typeof customer_id === "undefined"){
            var sql4 = "select a.site_code,a.site_name from tbl_site a,tbl_customer b where a.customer_id=b.customer_id Group By a.site_code";
      }else{  
        var sql4 = "select a.site_code,a.site_name from tbl_site a,tbl_customer b where a.customer_id=b.customer_id AND a.customer_id ='"+customer_id+"' Group By a.site_code";
      }

      getSQLData(sql4, function(resultsets){
          console.log("sitetext........sql"+sql4);
           siteresults = resultsets;
           //console.log("results....."+JSON.stringify(pinresults));
          //pin combobox
          if(customer_id == "0" || customer_id == "" || typeof customer_id === "undefined"){
                var sql3 = "SELECT alarmpin_id,alarmpin_name from tbl_alarmpin where customer_id='"+cid+"'";
          }else{  
            var sql3 = "SELECT alarmpin_id,alarmpin_name from tbl_alarmpin where customer_id='"+customer_id+"'";
          }

          getSQLData(sql3, function(resultsets){
              console.log("allpintext........sql"+sql3);
              pinresults = resultsets;
              //console.log("results....."+JSON.stringify(pinresults));
              //var urlstring = req.url;
              var results;
              var  outageDatas = [];
              var fromdate = moment(req.query.fromdate).format('YYYY-MM-DD');
              var todate= moment(req.query.todate).format('YYYY-MM-DD');
              var siteid = req.query.siteid;
              var pin_id=req.query.pin_id;
              console.log("pin id=="+pin_id);
              var customerresult;
             //for pagination
              var numberofrecords=100;
              var nextPageValue=req.query.nextval;
              var statusValue=req.query.statusvalue;
              var rowsperpageval=req.query.rowsperpageval;
              var limitStartVal;
              var startPosition=1;
              var endPosition;
              var lastRecordPosition;
              var nextval;
              var nextbuttonstatus=1;
              if(req.query.statusvalue==2 && typeof req.query.statusvalue!='undefined'){
                  //console.log("nextpageval if triggerd........"+rowsperpageval+"numberofrecords"+numberofrecords);
                  nextPageValue=numberofrecords*(rowsperpageval/10);
              }
              if(typeof rowsperpageval == 'undefined'){
                rowsperpageval=10;
              }
              if(typeof nextPageValue== 'undefined' || nextPageValue == ''){
                //console.log("nextpageval if triggerd"+rowsperpageval+"numberofrecords"+numberofrecords);
                limitStartVal=0;
                nextPageValue=numberofrecords*(rowsperpageval/10);
                statusValue=0;
              }
              numberofrecords=numberofrecords*(rowsperpageval/10);
              records_to_subtract=numberofrecords;
              numberofrecords+=1;
              //console.log("numberofrecords"+numberofrecords);
              //console.log("STEP-2 :"+nextPageValue+" Status:"+statusValue);
              if(((typeof nextPageValue!= 'undefined' || nextPageValue != '') && statusValue==0) || ((typeof nextPageValue!= 'undefined' || nextPageValue != '') && statusValue==2)){
                limitStartVal=nextPageValue-records_to_subtract;
                //console.log("STEP-3");        
                nextval=nextPageValue;
                startPosition=nextPageValue-(numberofrecords-1);
                startPosition=startPosition/rowsperpageval;
                startPosition+=1;
                if(startPosition==0){
                  startPosition=1;
                }
                endPosition=nextPageValue/rowsperpageval;
                lastRecordPosition=endPosition+1;
                }
              if(typeof nextPageValue!= 'undefined' && statusValue==1){
                limitStartVal=nextPageValue-((numberofrecords-1)*2);
                //console.log("limitStartVal in previous"+limitStartVal);
                if(limitStartVal<0){
                  limitStartVal=0;
                }
                startPosition=nextPageValue-((numberofrecords-1)*2);
                startPosition=startPosition/rowsperpageval;
                startPosition+=1;
                if(startPosition==0){
                  startPosition=1;
                }
                nextval=nextPageValue-(numberofrecords-1);
                endPosition=(nextval)/rowsperpageval;
                lastRecordPosition=endPosition+1;
              }
              
             
              
              if ((req.query && typeof siteid === 'undefined'  && typeof pin_id === 'undefined' && typeof customer_id === 'undefined' && typeof todate === 'undefined' && typeof fromdate === 'undefined') || (siteid === '' && pin_id === '' && customer_id === '' && fromdate === '' && todate === '')){
                
                 sql =  "SELECT alarmdata.Siteid, tbl_site.site_name, tbl_site.site_address,alarmdata.Opentime,alarmdata.Closetime,tbl_alarmpin.alarmpin_name, tbl_user.user_name, alarmdata.acktime "+
                         " FROM tbl_alarmpin,alarmdata  "+
                         "LEFT JOIN tbl_site  ON alarmdata.siteid = tbl_site.site_code "+
                         "LEFT JOIN tbl_user  ON alarmdata.ackby = tbl_user.user_id "+
                         "WHERE alarmdata.Alarmpin=tbl_alarmpin.pin_id " +
                         "ORDER BY alarmdata.Opentime DESC ";
              }else{
                 
                  var query = "";
                  if(siteid != "" && typeof siteid != 'undefined'){
                    query = query + " AND alarmdata.Siteid='"+siteid+"'";
                  }  

                  if(pin_id != "" && typeof pin_id != 'undefined'){
                    query = query + " AND tbl_alarmpin.alarmpin_id='"+pin_id+"'";
                  }

                  if(fromdate != ""){
                      query = query + " AND date_format(alarmdata.Opentime,'%Y-%m-%d')>='"+fromdate+"'";
                  }  

                  if(todate != ""){
                    query = query + " AND date_format(alarmdata.Closetime,'%Y-%m-%d')<='"+todate+"'";
                  }    
                  if(customer_id != "" && typeof customer_id !='undefined'){
                      query = query + " AND tbl_site.customer_id='"+customer_id+"'";
                  }
                  
                 sql =  "SELECT alarmdata.Siteid, tbl_site.site_name, tbl_site.site_address,alarmdata.Opentime,alarmdata.Closetime,tbl_alarmpin.alarmpin_name, tbl_user.user_name, alarmdata.acktime "+
                         "FROM tbl_alarmpin,tbl_site,alarmdata  "+
                         "LEFT JOIN tbl_user  ON alarmdata.ackby = tbl_user.user_id "+
                         "WHERE alarmdata.siteid = tbl_site.site_code AND alarmdata.Alarmpin=tbl_alarmpin.pin_id  AND tbl_alarmpin.customer_id=tbl_site.customer_id " + query +
                         "ORDER BY alarmdata.Opentime DESC "+" limit "+limitStartVal+","+numberofrecords+"";
                
                  
              }//else
                       
              console.log("AlarmLists sql triggered :"+sql);

              connection.query(sql)
                  .on('result', function(data){
                      // Push results onto the notes array
                      res.header("Access-Control-Allow-Origin","*");
                      res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");;
                      outageDatas.push(data);
                  })  

                  .on('end', function(){
                      // Only emit notes after query has been completed
                      //socket.emit('initial alarm', notes)console.log("Data :"+students.length);
                      var totalDatas = outageDatas.length;
                      console.log("total records::"+totalDatas);
                      if(outageDatas.length<=(numberofrecords-1))
                      {
                        var pagesCount=Math.ceil(outageDatas.length/rowsperpageval,0);
                        endPosition=startPosition+(pagesCount-1);
                        lastRecordPosition=endPosition;
                        nextbuttonstatus=0;
                      }
                      if(outageDatas.length>(numberofrecords-1)){
                        //console.log("outageDataslength"+outageDatas.length);
                        nextbuttonstatus=1;
                        outageDatas.pop();
                      }
                      

                      res.render('alarmlist/index',{title:"AlarmLists", 
                          sess_name: suname, 
                          sess_id: srid,
                          customerresult:customername,
                          custid : customer_id,
                          cid : cid,
                          siteid : siteid,
                          siteresults:siteresults,
                          pin_id:pin_id,
                          pinresults:pinresults,
                          fromdate : fromdate,
                          todate : todate,
                          outageDatas: outageDatas,
                          sqlquery: sql,
                          totalDatas: totalDatas,
                          nextpagevalue:nextval,
                          currentposition:startPosition,
                          endposition:endPosition,
                          lastposition:lastRecordPosition,
                          nextbuttonstatus:nextbuttonstatus,
                          rowsperpageval:rowsperpageval,
                          numberofrecords:numberofrecords,
                          sess_report:req.session.reports_info,
                          minRange:minRange,
                          maxRange:maxRange,
                          stepRange:stepRange});
                  })
            });
        });              
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


//to get customer name
   function getCustomerName(cid,cb){
    connection.query("select customer_name from tbl_customer where customer_id='"+cid+"'",function(err,res1){
        if(res1.length >0){
          resultsets=res1;
        }else{
          resultsets={};
        }
        cb(resultsets); 
    });
  }
  return router;
}