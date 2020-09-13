const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const jwt = require('jsonwebtoken');
const _ = require('lodash');


var UserSchema = new mongoose.Schema({
    fullName : {
        type : String,
        required : 'Full name can\'t be em[ty'
    },
    email : {
        type : String,
        required : 'Email cant be empty',
        unique : true
    },
    password : {
        type : String,
        required : 'Password cant be empty',
        minlength : [4,'Passoword should atleast 4 character long']
    },
    saltSecret : String
});
UserSchema.pre('save',function(next){
    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(this.password,salt,(err,hash)=>{
            this.password = hash;
            this.saltSecret = salt;
            next();
        });
    });
});
UserSchema.path('email').validate((val)=>{
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(val);
}, 'Invalid email.');

// Methods
UserSchema.methods.verifyPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

UserSchema.methods.generateJwt = function () {
    return jwt.sign({ _id: this._id},
        process.env.JWT_SECRET,
    {
        expiresIn: process.env.JWT_EXP
    });
}

module.exports.register = (req,res,next)=>{
    const User = mongoose.model('User',UserSchema,req.body.type);
    var user = new User();
    user.fullName = req.body.fullName;
    user.email = req.body.email;
    user.password = req.body.password;
    user.save((err,doc)=>{
        if(!err){
            res.send(doc);
            console.log(doc);
        }else{
            if(err.code == 11000){
                res.status(422).send(['Duplicate email address found']);
            }else{
                console.log('hi 5 is ready' + err);
                return next(err);
            }
        }
    })
}

module.exports.authenticate = (req,res,next)=>{
    const User = mongoose.model('User',UserSchema,req.body.type);
    passport.use(
        new localStrategy({ usernameField: 'email' },
            (username, password, done) => {
                User.findOne({ email: username },
                    (err, user) => {
                        if (err){
                            return done(err);
                        }
                        // unknown user
                        else if (!user){
                            return done(null, false, { message: 'Email is not registered' });
                        }// wrong password
                        else if (!user.verifyPassword(password)){
                            return done(null, false, { message: 'Wrong password.' });
                        }// authentication succeeded
                        else{
                            return done(null, user);
                        }
                    });
            })
    );
    passport.authenticate('local',(err,user,info)=>{
        // error from passport middleware
        if (err) return res.status(400).json(err);
        // registered user
        else if (user) return res.status(200).json({ "token": user.generateJwt(),'type' : req.body.type });
        // unknown user or wrong password
        else {
            return res.status(404).json(info)
        };
    })(req,res);
}