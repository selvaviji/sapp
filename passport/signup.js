var LocalStrategy   = require('passport-local').Strategy;

var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport,connection){

	passport.use('signup', new LocalStrategy({
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {
            connection.query("SELECT * FROM tbl_user WHERE user_name = ?",[username], function(err, rows) {
                if (err){
                    console.log("Error");
                    //return done(err);
                }
                if (rows.length) {
                    return done(null, false, req.flash('message', 'That username is already taken.'));
                } else {
                    // if there is no user with that username
                    // create the user
                    var newUserMysql = {
                        username: username,
                        password: createHash(password)  // use the generateHash function in our user model
                    };

                    var insertQuery = "INSERT INTO tbl_users ( username, password ) values (?,?)";

                    connection.query(insertQuery,[newUserMysql.username, newUserMysql.password],function(err, rows) {
                        newUserMysql.id = rows.insertId;

                        return done(null, newUserMysql);
                    });
                }
            });
        })
    );

    // Generates hash using bCrypt
    var createHash = function(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    }

};