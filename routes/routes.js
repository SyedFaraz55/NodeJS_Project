const User = require("../models/User");
const bcrypt = require("bcryptjs");
const passport = require("passport");


module.exports.home = (req,res)=>{
    res.render("home");
}

module.exports.dashboard = (req,res)=>{
    res.render("dashboard",{user:req.user});
    console.log(req.user); //remove it
}

module.exports.login = (req,res)=>{
    res.render("login");
}

module.exports.signup = (req,res)=>{
    res.render("signup");
}

module.exports.postSignup = (req,res)=>{
    let { email,username,password,cpassword } = req.body;
    let err;
    if(!email || !username || !password, !cpassword){
        err = "please fill all fields !";
        res.render("signup",{error:err});
    }
    if(password != cpassword){
        err = "Password doesn't match !";
        res.render("signup",{error:err,email:email,username:username});
    }
    if(typeof err == 'undefined'){
        User.findOne({ email: email},function(err,data){
            if(err){
                throw err;
            }
            if(data){
                console.log("user exits !");
                err = "user already exits !";
                res.render("signup",{error:err})
            } else {
                bcrypt.genSalt(10,(err,salt)=>{
                    if(err) throw err;
                    bcrypt.hash(password,salt,(err,hash)=>{
                        if(err) throw err;
                        password = hash;
                        User({
                            email,username,password
                        })
                        .save().then((data)=>{
                            console.log(data);
                            req.flash('success_msg',"Registered Successfull,Login to continue");
                            res.redirect("/login");
                        }).catch((err)=>{
                            console.log(err);
                        })
                    })
                })
            }
        });
    }
}

exports.postLogin = function(req, res, next) {
    passport.authenticate("local", {
      successRedirect: "/dashboard",
      failureRedirect: "/login",
      failureFlash: true,
    })(req, res, next);
  };

exports.logout = function(req,res){
    req.logout();
    res.redirect("/");
}

exports.ensureAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, post-check=0, pre-check=0');
        return next();
    } else {
        req.flash("error_msg","please login to continue")
        res.redirect('/login');
    }
}

exports.checkAuthenticated = function(req,res,next) {
  if(req.isAuthenticated()){
    return res.redirect("/dashboard");
  }
  next();
}
