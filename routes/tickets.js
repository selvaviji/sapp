var express = require('express');
var router = express.Router();


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
      //console.log("trouble report triggered");
      res.render('trouble/index',{title:"AlarmLists", sess_name: suname, sess_id: srid});
  });
	return router;
}
