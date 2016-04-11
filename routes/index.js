var express = require('express');
var router = express.Router();
var moment = require('moment');
var isAuthenticated = function (req, res, next) {
  // if user is authenticated in the session, call the next() to call the next request handler 
  // Passport adds this method to request object. A middleware is allowed to add properties to
  // request and response objects
  if (req.isAuthenticated()){
    req.session.uname = req.user.user_name;
    req.session.rid = req.user.role_id;
    req.session.uid = req.user.user_id;
    req.session.cid = req.user.customer_id;
    req.session.perrows = req.user.page_refresh;
    req.session.smsstatus = req.user.sms_status;
    req.session.videostatus = req.user.video_status;
    req.session.reports_info = req.user.reports_info;
    req.session.loggedIn = true;
    return next();
  }
  // if the user is not authenticated then redirect him to the login page
  res.redirect('/');
}


module.exports = function(passport,connection) {

    /* GET home page. */
    router.get('/', function(req, res, next) {
      res.render('index', { message: req.flash('loginMessage'),  });
    });

    router.get('/error', function(req, res, next) {
      res.render('index', { message: req.flash('loginMessage') });
    });
    
    router.get('/dashboard', isAuthenticated, function(req,res){
        
        console.log("dashboard triggered :"+req.session.uname+ "   "+req.session.rid);
        res.render('dashboard',{title:"Dashboard", sess_name: req.session.uname, sess_id: req.session.rid});   
    });
    
    router.post('/dashboard_data',isAuthenticated,function(req,res){
        var srid=req.session.rid;
        fromdate = moment().format('YYYY-MM-DD');
        //console.log("report triggered"+req.body.customer_id);
        if(srid==1 && (typeof req.body.customer_id=='undefined' || req.body.customer_id=='')){
            //console.log("step1");
            sql="select (select count(*) from tbl_customer,tbl_user where tbl_customer.user_id=tbl_user.user_id) as customercount,(select count(*)  from tbl_user where user_status='0') as usercount,(select count(*) from alarmdata where Closetime is null AND date_format(Opentime,'%Y-%m-%d') = '"+fromdate+"') as activealarmcount,(select count(*) from alarmdata where Closetime not IN('null') AND date_format(Opentime,'%Y-%m-%d') = '"+fromdate+"') as closedalarmcount,(select count(*) from tbl_site) as sitescount,(select count(*) from tbl_msp) vendorscount,(select count(*) from tbl_tt_master where ticket_state='opened') as ticketopencount,(select count(*) from tbl_tt_master where ticket_state='closed') as ticketclosedcount"; 
         }
         else if(srid==1 && (typeof req.body.customer_id!='undefined' || req.body.customer_id!='')){
          //console.log("step2");
          sql="select (select count(*) from tbl_customer,tbl_user where tbl_customer.user_id=tbl_user.user_id AND tbl_customer.customer_id='"+req.body.customer_id+"') as customercount,(select count(*)  from tbl_user where user_status='0' AND customer_id='"+req.body.customer_id+"') as usercount,(select count(*) from alarmdata,tbl_site where tbl_site.site_code=alarmdata.Siteid AND tbl_site.customer_id='"+req.body.customer_id+"' AND alarmdata.Closetime is null AND date_format(Opentime,'%Y-%m-%d') = '"+fromdate+"') as activealarmcount,(select count(*) from alarmdata,tbl_site where tbl_site.site_code=alarmdata.Siteid AND tbl_site.customer_id='"+req.body.customer_id+"' AND alarmdata.Closetime not IN('null') AND date_format(alarmdata.Opentime,'%Y-%m-%d') = '"+fromdate+"') as closedalarmcount,(select count(*) from tbl_site where customer_id='"+req.body.customer_id+"') as sitescount,(select count(*) from tbl_msp where customer_id='"+req.body.customer_id+"') vendorscount,(select count(*) from tbl_tt_master,tbl_site where tbl_site.site_code=tbl_tt_master.site_id AND tbl_site.customer_id='"+req.body.customer_id+"' AND tbl_tt_master.ticket_state='opened') as ticketopencount,(select count(*) from tbl_tt_master,tbl_site where tbl_site.site_code=tbl_tt_master.site_id AND tbl_site.customer_id='"+req.body.customer_id+"' AND tbl_tt_master.ticket_state='closed') as ticketclosedcount"; 
        }
        else{
           //console.log("step3");
           sql="select (select count(*) from tbl_user where customer_id='"+req.session.cid+"') as totalusercount,(select count(*)  from tbl_user where user_status='0' AND customer_id='"+req.session.cid+"') as usercount,(select count(*) from alarmdata,tbl_site where tbl_site.site_code=alarmdata.Siteid AND tbl_site.customer_id='"+req.session.cid+"' AND alarmdata.Closetime is null AND date_format(Opentime,'%Y-%m-%d') = '"+fromdate+"') as activealarmcount,(select count(*) from alarmdata,tbl_site where tbl_site.site_code=alarmdata.Siteid AND tbl_site.customer_id='"+req.session.cid+"' AND alarmdata.Closetime not IN('null') AND date_format(alarmdata.Opentime,'%Y-%m-%d') = '"+fromdate+"') as closedalarmcount,(select count(*) from tbl_site where customer_id='"+req.session.cid+"') as sitescount,(select count(*) from tbl_msp where customer_id='"+req.session.cid+"') vendorscount,(select count(*) from tbl_tt_master,tbl_site where tbl_site.site_code=tbl_tt_master.site_id AND tbl_site.customer_id='"+req.session.cid+"' AND tbl_tt_master.ticket_state='opened') as ticketopencount,(select count(*) from tbl_tt_master,tbl_site where tbl_site.site_code=tbl_tt_master.site_id AND tbl_site.customer_id='"+req.session.cid+"' AND tbl_tt_master.ticket_state='closed') as ticketclosedcount"; 
        }
        //console.log(sql);
        getSQLData(sql, function(dbresultsets){
          results = dbresultsets;
         res.send({datas:results});   
        }); 

    });

    router.post('/login', passport.authenticate('login', {
        successRedirect : '/dashboard', // redirect to the secure profile section
        failureRedirect : '/', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
    
    /* GET Home Page */
    router.get('/logout', isAuthenticated, function(req, res){
      req.session.loggedIn = false;

      req.session.destroy();
      req.session = null // Deletes the cookie.
      res.render('/', { user: req.user });
    });

    
    function getSQLData(sqls, cb) { 
        console.log("sqls :"+sqls);
        var resultsets;
        connection.query(sqls, function(err, res1){
            console.log("REsult ::"+res1.length);
            if(res1.length >0){
              resultset=res1;
            }else{
              resultset={};
            }
            cb(resultset); //callback if all queries are processed
        });
    };
    return router;
}