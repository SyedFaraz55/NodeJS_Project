const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");

// load user model 
const User = require("../models/User");

module.exports = function(passport) {
	passport.use(
		new LocalStrategy({usernameField:"email"},(email,password,done)=>{
			// verifying user
			User.findOne({email	:email})
			.then((user)=>{
				if(!user){
					return done(null,false,{message:"No user found with this email"});
				} 
				// Match Password 
				bcryptjs.compare(password,user.password,(err,isMatch)=> {
					if(err) throw err;
					if(isMatch){
							return done(null,user);
							console.log(user);
					} else {
						return done(null,false,{message:"password is incorrect !"});
					}
				});
			})
			.catch(err=>console.log(err));
		})
	);
	  passport.serializeUser(function(user, done) {
        done(null, user);
      });
      
      passport.deserializeUser(function(user, done) {
        User.findById(user, function (err, user) {
          done(err, user);
        });
      });
}
