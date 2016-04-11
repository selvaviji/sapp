var express = require('express');
var router = express.Router();
var moment = require('moment');


var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()){
      
      return next();
    }
    res.redirect('/');
}

// config the uploader
var options = {
    tmpDir: __dirname + '/../frontend/assets/gallery/tmp',
    publicDir: __dirname + '/../frontend/assets/gallery',
    uploadDir: __dirname + '/../frontend/assets/gallery/files',
    uploadUrl: '/gallery/files/',

    maxPostSize: 11000000000, // 11 GB
    minFileSize: 1,
    maxFileSize: 10000000000, // 10 GB
    acceptFileTypes: /.+/i,
    // Files not matched by this regular expression force a download dialog,
    // to prevent executing any scripts in the context of the service domain:
    inlineFileTypes: /\.(gif|jpe?g|png)$/i,
    imageTypes: /\.(gif|jpe?g|png)$/i,
    imageVersions: {
        maxWidth: 80,
        maxHeight: 80
    },
    accessControl: {
        allowOrigin: '*',
        allowMethods: 'OPTIONS, HEAD, GET, POST, PUT, DELETE',
        allowHeaders: 'Content-Type, Content-Range, Content-Disposition'
    },
    storage : {
        type : 'local'
    },
    nodeStatic: {
        cache: 3600 // seconds to cache served files
    }
};

var uploader = require('blueimp-file-upload-expressjs')(options);


module.exports = function(passport,dbconnection) {
    router.get('/', isAuthenticated, function(req, res){
       res.render('photos/index',{title:"List", sess_name: req.session.uname, sess_id: req.session.rid});
    });

    router.get('/upload', function(req, res) {

        uploader.get(req, res, function(err, obj) {
            res.send(JSON.stringify(obj));
        });

    });

    router.post('/upload', function(req, res) {
        console.log("Evernt Triggered");
        uploader.post(req, res, function(err, obj) {
            res.send(JSON.stringify(obj));
        });

    });

    router.delete('/gallery/files/:name', function(req, res) {
        uploader.delete(req, res, function(err, obj) {
            res.send(JSON.stringify(obj));
        });
    });
    return router;
}
