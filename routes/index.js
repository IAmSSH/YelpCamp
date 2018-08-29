var express = require("express"), 
router = express.Router(),
User = require("../models/user"),
flash = require("connect-flash"),
passport = require("passport");

// ROOT ROUTE
router.get("/", function(req, res) {
    res.render('landing');
});

// REGISTER/CREATE ROUTES
router.get("/register", function(req, res) {
    res.render("register");
});
router.post("/register", function(req, res) {
    var username = new User({username: req.body.username});
    User.register(username, req.body.password, function(err, user) {
        if(err) {
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to YelpCamp " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

// LOGIN ROUTES
router.get("/login", function(req, res) {
    res.render("login");
});
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function(req, res) {
});

// LOGOUT ROUTE
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged you out");
    res.redirect("/campgrounds");
});

module.exports = router;