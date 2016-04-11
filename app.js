var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var dbConfig = require('./config/db.js');
var methodOverride = require('method-override')
var mysql = require('mysql');
var multer  = require('multer'); //middleware for form/file upload 
var passport = require('passport');
var expressSession = require('express-session');
var flash = require('connect-flash');
var app = express();
app.locals.moment = require('moment');

var dbconn = mysql.createPool(dbConfig.options);

var port = normalizePort(process.env.PORT || '9003');

app.set('port', port);
//frontend folder
app.set('views', 'frontend/views');
app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true })); //support x-www-form-urlencoded
app.use(bodyParser.json());
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(express.static(__dirname + '/frontend/assets'));
app.use(cookieParser());
app.use(expressSession({secret: 'mySecretKey',resave: true,saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());

// Using the flash middleware provided by connect-flash to store messages in session
// and displaying in templates
app.use(flash());

// Initialize Passport
var initPassport = require('./passport/init');
initPassport(passport,dbconn);

//Initialize all modules
//app.use(require('./routes')(passport,dbconn));
var routes = require('./routes/index')(passport,dbconn);
var institute = require('./routes/institute')(passport,dbconn);
var section = require('./routes/section')(passport,dbconn);
var sclass = require('./routes/sclass')(passport,dbconn);
var subject = require('./routes/subject')(passport,dbconn);
var design = require('./routes/design')(passport,dbconn);
var staff = require('./routes/staff')(passport,dbconn);
var student = require('./routes/student')(passport,dbconn);
var messages = require('./routes/messages')(passport,dbconn);
var gallery = require('./routes/gallery')(passport,dbconn);
var uploadManager = require('./routes/uploadManager')(passport,dbconn);

var level = require('./routes/level')(passport,dbconn);
var common = require('./routes/common')(passport);
var geomap = require('./routes/geomap')(passport,dbconn);
var geopeople = require('./routes/geopeople')(passport,dbconn);
var userrole = require('./routes/userrole')(passport,dbconn);
var pinmaster = require('./routes/pinmaster')(passport,dbconn);
var hkgenerate = require('./routes/hkgenerate')(passport,dbconn);
var hkreport = require('./routes/hkreport')(passport,dbconn);
var icicireport = require('./routes/icicireport')(passport,dbconn);
var pindetails = require('./routes/pindetails')(passport,dbconn);
var preference = require('./routes/preferences')(passport,dbconn);
var alarmpin = require('./routes/alarmpin')(passport,dbconn);
var users = require('./routes/users')(passport,dbconn);
var customer = require('./routes/customer')(passport,dbconn);
var assignsite = require('./routes/assignsite')(passport,dbconn);
var geography = require('./routes/geographies')(passport,dbconn);
var site = require('./routes/site')(passport,dbconn);
var msp = require('./routes/msp')(passport,dbconn);
var active = require('./routes/alarms')(passport,dbconn);//Active Alarm
var activealarm = require('./routes/activealarm')(passport,dbconn);//Active Alarm
var newalarm = require('./routes/newalarm')(passport,dbconn);//Active Alarm
var newalarm1 = require('./routes/newalarm1')(passport);//Active Alarm
var sbimonit = require('./routes/sbimonit')(passport);//Active Alarm
var alarmlist = require('./routes/alarmlist')(passport,dbconn);
var energy = require('./routes/energydata')(passport,dbconn);
var report = require('./routes/reports')(passport);
var rawdata = require('./routes/rawdata')(passport,dbconn);
var ticket = require('./routes/tickets')(passport,dbconn);
var livedata = require('./routes/livedata')(passport,dbconn);
var assigntt=require('./routes/assigntt')(passport,dbconn);
var settings=require('./routes/setting')(passport,dbconn);
var common=require('./routes/common')(passport,dbconn);
var control=require('./routes/control')(passport,dbconn);
var hkcontrol=require('./routes/hkcontrol')(passport,dbconn);

app.use('/', routes);
app.use('/institute',institute);
app.use('/section',section);
app.use('/sclass',sclass);
app.use('/subject',subject);
app.use('/design',design);
app.use('/staff',staff);
app.use('/messages',messages);
app.use('/student',student);
app.use('/gallery',gallery);
app.use('/photos',uploadManager);

app.use('/level',level);
app.use('/common',common);
app.use('/geomap',geomap);
app.use('/geopeople',geopeople);
app.use('/userrole', userrole);
app.use('/users', users);
app.use('/geography', geography);
app.use('/pinmaster', pinmaster);
app.use('/hkgenerate',hkgenerate);
app.use('/hkreport',hkreport);
app.use('/icicireport',icicireport);
app.use('/pindetails', pindetails);
app.use('/preferences', preference);
app.use('/customer', customer);
app.use('/assignsite', assignsite);
app.use('/site', site);
app.use('/msp', msp);
app.use('/alarmpin', alarmpin);
app.use('/active', active);
app.use('/activealarm',activealarm);
app.use('/newactive',newalarm);
app.use('/newalarm1',newalarm1);
app.use('/sbimonit',sbimonit);
app.use('/alarmlist', alarmlist);
app.use('/energy', energy);
app.use('/report', report);
app.use('/rawdata',rawdata);
app.use('/trouble',ticket);
app.use('/live',livedata);
app.use('/assignticket',assigntt);
app.use('/setting',settings);
app.use('/control',control);
app.use('/hkcontrol',hkcontrol);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    //return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
    res.render('index', { message: 'loginMessage'});
  });
}

//module.exports = app;
var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));  
});




/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}


