var express = require('express');
var router = express.Router();
var moment = require('moment');
var request = require('request');
var fs = require("fs");
var minRange=10;
var maxRange=50;
var stepRange=10;


var rightnow = new Date();
var dayformat = rightnow.getFullYear() + '_' + (("0" + (rightnow.getMonth() + 1)).slice(-2)) + '_' + ("0" + (rightnow.getDate())).slice(-2);
var timeformat = ("0"+rightnow.getHours()).slice(-2) + '_' + ("0"+rightnow.getMinutes()).slice(-2) + '_' + ("0"+rightnow.getSeconds()).slice(-2);
var path = "./frontend/assets/todaysnap/";


var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    req.session.uname = req.user.user_name;
    req.session.rid = req.user.role_id;
    req.session.uid = req.user.user_id;
    req.session.cid = req.user.customer_id;
    req.session.perrows = req.user.page_refresh;
    req.session.smsstatus = req.user.sms_status;
    req.session.videostatus = req.user.video_status;
    req.session.reports_info = req.user.reports_info;
    return next();
  
  res.redirect('/');
}

module.exports = function(passport,connection) {
  /* GET geography listing. */
  router.get('/', isAuthenticated, function(req, res){
    //console.log("Live Page Get Method ");
    res.render('hkcontrol/index',{sess_name:req.session.uname,sess_id:req.session.rid,minRange:minRange,maxRange:maxRange,stepRange:stepRange});
  });  
    
  router.post('/getdata', function(req, res){
      //console.log("Live Page POST Method ");
      var suname =req.session.uname;
      var suid =req.session.uid;
      var srid=req.session.rid;
      var cid = req.session.cid;
      var customer_id=req.body.custid;

      var numberofrecords=100;
      var nextPageValue=req.body.nextval;
      var statusValue=req.body.statusvalue;
      var rowsperpageval=req.body.rowsperpageval;
      var limitStartVal;
      var startPosition=1;
      var endPosition;
      var lastRecordPosition;
      var nextval;
      var nextbuttonstatus=1;

      var perpage = req.session.perrows;
      var searchdata = "";
      var searchquery = "";
      
      var siteid =req.body.siteid;
      var pushdata = [];
      var outageDatas = [];
      var fields1 = [];

      //for pagination
      var numberofrecords=100;
      if(req.query.statusvalue==2 && typeof req.query.statusvalue!='undefined'){
          console.log("nextpageval if triggerd........"+rowsperpageval+"numberofrecords"+numberofrecords);
          nextPageValue=numberofrecords*(rowsperpageval/10);
      }
      if(typeof rowsperpageval === 'undefined'){
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
      console.log("customer id************* :"+customer_id);
      if(typeof siteid === 'undefined' || siteid == ""){ 
        qry = "";
      }else{
        qry = " AND a.Siteid ='"+siteid+"'";
      }  
      if(typeof customer_id === 'undefined' || customer_id == ""){  
          
          var  sql =  "SELECT a.RecordingTimeStamp,a.Siteid,b.site_name,b.site_address,a.IP,c.customer_name FROM lastknown a,tbl_site b,tbl_customer c "+
                      "WHERE a.Siteid=b.site_code AND b.customer_id=c.customer_id"+qry+" ORDER BY a.RecordingTimeStamp DESC";
      }else{
          var  sql =  "SELECT a.RecordingTimeStamp,a.Siteid,b.site_name,b.site_address,a.IP,c.customer_name FROM lastknown a,tbl_site b,tbl_customer c "+
                      "WHERE a.Siteid=b.site_code AND b.customer_id=c.customer_id"+qry+" AND b.customer_id='"+customer_id+"' ORDER BY a.RecordingTimeStamp DESC";
      }                
      console.log("Live triggered:"+sql);
       
       
      connection.query(sql)
          .on('result', function(data){
            // Push results onto the notes array
              res.header("Access-Control-Allow-Origin","*");
              res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");;
              outageDatas.push(data);
            //outageDatas.push(data);
          }) 
          
          .on('end', function(){
              var resultslength = outageDatas.length;
             // console.log("total records::"+totalDatas);
             if(resultslength==undefined){
                outageDatas=[];
             }
              if(outageDatas.length<=(numberofrecords-1))
              {
                var pagesCount=Math.ceil(outageDatas.length/rowsperpageval,0);
                endPosition=startPosition+(pagesCount-1);
                lastRecordPosition=endPosition;
                nextbuttonstatus=0;
              }
              if(outageDatas.length>(numberofrecords-1)){
                console.log("outageDataslength"+outageDatas.length);
                nextbuttonstatus=1;
                outageDatas.pop();
              }
              console.log("uname :"+suname+"Role:"+srid);
              res.send({title:"AlarmLists", 
                datas:outageDatas,
                dataslength: resultslength,
                custid: customer_id,
                nextpagevalue:nextval,
                currentposition:startPosition,
                endposition:endPosition,
                lastposition:lastRecordPosition,
                nextbuttonstatus:nextbuttonstatus
              });
          })
          //console.log("NewSQL :"+newsql);
            
  });
  

  router.post('/getimagedata', function(req, res){
      console.log("getimagedata POST Method ");
      

      var site_code = req.body.siteid;
      var IP = req.body.ip;
      var channels = req.body.channels;
      
      var imageNames = [];
      channelId =0;
      channelSize=channels.length;

      //console.log("Going to read directory "+path);
      deleteFiles(path);
      j=0;
      for(i=0;i<channelSize;i++){
        //console.log("step-1 :"+i);
        getImage(IP,site_code,channels[i],function(result){
            
            imageNames.push({"image":result});
            j++;
            if(j==channelSize){
              console.log("FileName :"+JSON.stringify(imageNames));
              res.send({datas:imageNames});
            }
        });
        //console.log("step-2 :"+i);
      }
  });

  function deleteFiles(path){
    fs.readdir(path,function(err, files){
       if (err) {
           return console.error(err);
       }
       files.forEach( function (file){
           //path = path + file;  
           console.log("path:"+ (path+file) );
           fs.unlinkSync((path+file));
       });
       //console.log("--------------------");
    });
  }

  function getImage(IP,site_code,channelId,cb){
      filename =  site_code + '_' + channelId+ '_'+ timeformat + '.jpg';
      request.get('http://' + IP + '/cgi-bin/snapshot.cgi?channel='+channelId,{timeout: 125000})
        .auth('admin', 'admin', false)
        .on('error', function (err) {
            if(err){
              //console.log(site_code+" : " + err);
              return cb(err);  
              //throw err;
            }
        })
        .on('response', function (response) {
          console.log(site_code+"Response: " + response.statusCode);
          console.log("File :"+site_code + '_' + channelId+ '_'+ timeformat + '.jpg'+" =i:"+channelId);
          cb(site_code + '_' + channelId+ '_'+ timeformat + '.jpg');

        })
        .pipe(fs.createWriteStream(path + site_code + '_' + channelId + '_'+ timeformat + '.jpg'))
  }

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


/* callback function */
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
