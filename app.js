var express         = require("express"), 
    app             = express(),
    bodyParser      = require('body-parser'),
    mongoose        = require("mongoose"),
    methodOverride  = require("method-override"),
    Campground      = require("./models/campground"),
    Comment         = require("./models/comment"),
    flash           = require("connect-flash"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    User            = require("./models/user"),
    seedDB          = require("./seeds");
    
var commentRoutes = require("./routes/comment"),
    indexRoutes = require("./routes/index"),
    campgroundRoutes = require("./routes/campground");
    

// mongoose.connect('mongodb://localhost:27017/yelp_camp', { useNewUrlParser: true });
mongoose.connect('mongodb://admin:hello1@ds247121.mlab.com:47121/yelpcamp', { useNewUrlParser: true });
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
// seedDB();



app.use(require("express-session")({
    secret: "Ding Dong",
    resave: false,
    saveUninitialized: false
}));

app.use(flash());

// Passport Setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});


app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);

app.listen(process.env.PORT, process.env.IP, function() {
    console.log('Server Started!!!');
});