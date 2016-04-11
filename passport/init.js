var login = require('./login');
var signup = require('./signup');


module.exports = function(passport,connection){

	// Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser(function(user, done) {
        console.log('serializing user: ');console.log(user);
        done(null, user.user_id);
    });

    passport.deserializeUser(function(id, done) {
        sql = "SELECT a.*,b.page_refresh,b.sms_status,b.video_status FROM tbl_user a, tbl_preferences b WHERE a.user_id=b.user_id and a.user_id = '"+id+"'"; 
        console.log("SQL :"+sql);
        connection.query("SELECT a.*,b.page_refresh,b.sms_status,b.video_status FROM tbl_user a, tbl_preferences b WHERE a.user_id=b.user_id and a.user_id = ? ",[id], function(err, rows){
            console.log("Passport Init :"+rows[0]);
            done(err, rows[0]);
        });
    });

    // Setting up Passport Strategies for Login and SignUp/Registration
    login(passport,connection);
    signup(passport,connection);

}