const express = require("express"),
    app = express(),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    passport = require("passport"),
    localStrategy = require("passport-local"),
    flash = require("connect-flash"),
    Admin = require("./models/admin"),
    session = require("express-session"),
    cookieParser = require("cookie-parser"),
    methodOverride = require("method-override"),
    port = process.env.PORT || 3001,
    dotenv = require("dotenv"),
    sslRedirect = require("heroku-ssl-redirect"),
    passportLocalMongoose = require("passport-local-mongoose");
dotenv.config();

const { f11aDash, f12aDash } = require("./controllers/admin/dashboard");
// Require Admin Routes
var adminAuthRoutes = require("./routes/admin/auth"),
    adminNewRoutes = require("./routes/admin/new"),
    adminDashRoutes = require("./routes/admin/dashboard");

// app config-----
app.use(cookieParser("secret"));
app.use(
    require("express-session")({
        secret: "This is a marketing panel",
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 365,
        },
    })
);
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride("_method"));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

app.use(sslRedirect());

// mongoose config
// mongoose.connect("mongodb://localhost/stickman_real_art");
// const mongoURI = "mongodb://localhost/invDatabase";
// const mongoURI = "mongodb+srv://ankit:"+process.env.MLAB_PASS+"@cluster0-gyowo.mongodb.net/real_art?retryWrites=true&w=majority";
//
// const mongoURI =
//   "mongodb+srv://ankit:" +
//   process.env.mongo_pass +
//   "@cluster0.f8aql.mongodb.net/mravans_admin_v1?retryWrites=true&w=majority";
//   mongo_pass=ankusaini00

const mongoURI =
    "mongodb+srv://ankit:" +
    process.env.mongo_pass +
    "@cluster0.gtjgxl4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

// const mongoURI = "mongodb+srv://ankit:" + process.env.mongo_pass + "@cluster0.m2dpa.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
//Mongo connection
mongoose.connect(mongoURI, { useFindAndModify: false, useUnifiedTopology: true, useNewUrlParser: true });

//PASSPORT config

// passport.use('admin', new localStrategy(Admin.authenticate()));
passport.use(
    "admin",
    new localStrategy({
            usernameField: "email",
            passwordField: "password",
        },
        Admin.authenticate()
    )
);

// passport.use('employee', new localStrategy(Employee.authenticate()));
passport.serializeUser(function(user, done) {
    var key = {
        id: user.id,
        type: user.typeof,
    };
    done(null, key);
});
passport.deserializeUser(function(key, done) {
    if (key.type === "admin") {
        Admin.findOne({
                _id: key.id,
            },
            function(err, user) {
                done(err, user);
            }
        );
    }
});

// @route to home page
// app.get("/",(req,res)=>{
//   res.redirect("/");
// })

var unless = function(path, middleware) {
    return function(req, res, next) {
        if (path === req.baseUrl) {
            console.log("HAI...");
            return next();
            // return path == "/report_mob" ? f12aDash(req, res) :
            //     f11aDash(req, res);
        } else {
            return middleware(req, res, next);
        }
    };
};

// Use Admin Routes
app.use(unless("/mob", adminAuthRoutes));
app.use(unless("/mob", adminDashRoutes));
app.use("/new", adminNewRoutes);

app.get("*", (req, res) => {
    res.redirect("/");
});

app.listen(port, () => {
    console.log("Server Started on " + port);
});