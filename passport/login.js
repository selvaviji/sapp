var LocalStrategy   = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport,connection){

	passport.use('login', new LocalStrategy({
            passReqToCallback : true
        },
        function(req, username, password, done) { 
            sql = "SELECT * FROM tbl_user WHERE user_name = ?";
            console.log("SQL:"+sql);
            connection.query(sql,[username], function(err, rows){
            
                
                if (err){
                    console.log("login error");
                    return done(err);
                }
                console.log('The solution is: ', rows.length);
                if (rows.length==0) {
                    return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
                }
                //console.log("crypt pwd :"+bcrypt.hashSync(password, null, null));
                var userpwd = rows[0].pass_word;
                if (!isValidPassword(userpwd, password))
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

                // all is well, return successful user
                return done(null, rows[0]);
            });
        })
    );


    var isValidPassword = function(userpwd, password){
        if(password == userpwd){
            return true;
        }else{
            return false;
        }
        
    }
    // Generates hash using bCrypt
    var createHashs = function(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    }
    
}