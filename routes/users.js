var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest: './uploads'});
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var Tweet = require('../models/tweets');
var User = require('../models/user');

/* GET users listing. */
router.post('/', function(req, res, next) {

    User.find({},'username profileimage -_id', function (err, result) {
        userData = result;
         Tweet.find({}, function (err1, result1) {
            tweetData = result1;
            var data = {
                tweetData,
                userData
            }
            res.send(data);
        })
    })
});

router.post('/tweet', function (req,res,next) {
    let tweet = new Tweet();
    var obj = JSON.parse(req.body);
    tweet.body = obj.textdata;
    User.find({username: req.body.username},function (err,user) {
        tweet.user=user._id;
        tweet.save();
        console.log('data saved');
        res.send(tweet.body);
    });

});

router.post('/login', function(req, res) { //this will issue token for valid users
    var username = req.body.user;
    var password = req.body.password;
    var isUserFound = false;
    var foundUser = {};
    console.log(req.body.user + " " + req.body.password);

    User.find({username : username}, function(err, username) {
        if(username){
            isUserFound = true;
        }
    })

    if (isUserFound) {
        if (foundUser.password == req.body.password) {
            var token = jwt.sign(foundUser, app.get('superSecret'), {
                expiresInMinutes: 1440 // expires in 24 hours
            });
            console.log(token);
            res.json({
                success: true,
                message: 'Enjoy your token!',
                token: token
            });
        } else {
            res.json({
                success: false,
                message: 'Authentication failed. Wrong password.'
            });
        }
        res.send(foundUser);
    } else {
        res.json({
            success: false,
            message: 'Authentication failed. user not found.'
        });
    }
});


passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
        done(err, user);
    });
});

passport.use(new LocalStrategy(function(username, password, done){
    User.getUserByUsername(username, function(err, user){
        if(err) throw err;
        if(!user){
            return done(null, false, {message: 'Unknown User'});
        }

        User.comparePassword(password, user.password, function(err, isMatch){
            if(err) return done(err);
            if(isMatch){
                return done(null, user);
            } else {
                return done(null, false, {message:'Invalid Password'});
            }
        });
    });
}));

router.post('/register', upload.single('profileimage') ,function(req, res, next) {
    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;

    if(req.file){
        console.log('Uploading File...');
        var profileimage = req.file.filename;
    } else {
        console.log('No File Uploaded...');
        var profileimage = 'noimage.jpg';
    }

    // Form Validator
    req.checkBody('name','Name field is required').notEmpty();
    req.checkBody('email','Email field is required').notEmpty();
    req.checkBody('email','Email is not valid').isEmail();
    req.checkBody('username','Username field is required').notEmpty();
    req.checkBody('password','Password field is required').notEmpty();
    req.checkBody('password2','Passwords do not match').equals(req.body.password);

    // Check Errors
    var errors = req.validationErrors();

    if(errors){
        res.render('register', {
            errors: errors
        });
    } else{
        var newUser = new User({
            name: name,
            email: email,
            username: username,
            password: password,
            profileimage: profileimage
        });

        User.createUser(newUser, function(err, user){
            if(err) throw err;
            console.log(user);
        });

        req.flash('success', 'You are now registered and can login');

        res.location('/');
        res.redirect('/');
    }
});

module.exports = router;
