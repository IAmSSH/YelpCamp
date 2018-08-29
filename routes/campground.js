var Campground  = require("../models/campground");
    middleware  = require("../middleware"),
    express     = require("express"), 
    router      = express.Router(),

// SHOW ALL CAMPGROUNDS
router.get("/campgrounds", function(req, res) {
    Campground.find({}, function(err, campgrounds) {
        if(err) {
            console.log('Error!!');
        }
        else {
            res.render('campgrounds/index', {campgrounds: campgrounds});
        }
    });
});

// NEW CAMPGROUND ROUTE
router.get('/campgrounds/new', middleware.isLoggedIn, function(req, res) {
    res.render('campgrounds/new');
});

// CREATE CAMPGROUND ROUTE
router.post('/campgrounds', middleware.isLoggedIn, function(req, res) {
    // get new camp details from *form*
    var newCamp = req.body.camp;
    newCamp.author = {
        id: req.user._id,
        username: req.user.username
    };
    Campground.create(newCamp, function(err, campground) {
        if(err){
        console.log("Error");
        }
        else {
            req.flash('success', 'Campground successfully created!');
            // Redirect to campgrounds page
            res.redirect('/campgrounds');
        }
    });
});

// SHOW CAMPGROUND ROUTE
router.get('/campgrounds/:id', function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCamp) {
        if(err) {
            console.log("Error!!");
        }
        else {
            res.render('campgrounds/show', {campground: foundCamp});
        }
    });
});

// EDIT CAMPGROUND ROUTE
router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});

// UPDATE CAMPGROUND ROUTE
router.put("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCamp) {
        if(err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DESTROY CAMPGROUND ROUTE
router.delete("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err) {
        if(err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;