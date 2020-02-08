require("dotenv").config();
const passport = require("passport");
require("./config/passport")(passport);
const express = require("express");
const app = express();
const routes = require("./routes/routes");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const db = require("./config/keys").mongoURI;
const flash = require("connect-flash");


app.use(cookieParser('secret'));
app.use(session({
    secret:"secret",
    resave:true,
    saveUninitialized:true,
    maxAge:360000
}))

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash("error");
    next();
});

mongoose.connect(db,{useNewUrlParser:true,useUnifiedTopology: true })
.then(()=>console.log("connected to mongodb Atlas"))
.catch((err)=>console.log(err));



app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended:true }));
app.set("view engine","ejs");

app.get("/",routes.checkAuthenticated,routes.home);
app.get("/dashboard",routes.ensureAuthenticated,routes.dashboard);
app.get("/login",routes.checkAuthenticated,routes.login);
app.get("/signup",routes.checkAuthenticated,routes.signup);
app.get("/logout",routes.logout);

app.post("/signup",routes.postSignup);
app.post("/login",routes.postLogin);

app.listen(process.env.PORT,()=>console.log(`listening at port ${process.env.PORT}`))
