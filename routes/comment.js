var express = require("express"), 
router = express.Router({mergeParams: true}),
Comment = require("../models/comment"),
middleware = require("../middleware"),
Campground = require("../models/campground");


// NEW COMMENT ROUTE
router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if(err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
});

// CREATE COMMENT ROUTE
router.post("/campgrounds/:id/comments", middleware.isLoggedIn, function(req, res) {
    // Find Camp by ID
    Campground.findById(req.params.id, function(err, campground) {
        if(err) {
            console.log(err);
        } else {
            // Add an 'author' object to 'comment' object
            req.body.comment.author = {
                id: req.user.id,
                username: req.user.username
            };
            // Create Comment
            Comment.create(req.body.comment, function(err, comment) {
                if(err) {
                    console.log(err);
                } else {
                    // Associating author(user) to (his) comment
                    // comment.author.id = req.user.id;
                    // comment.author.username = req.user.username;
                    comment.createdAt = Date();
                    comment.save();
                    // link to camp
                    campground.comments.push(comment);
                    campground.save();
                    // redirect to show page
                    res.redirect('/campgrounds/' + campground._id);
                }
            });
        }
    });
});

// EDIT COMMENT ROUTE
router.get("/campgrounds/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, comment) {
        if(err) {
            res.rediredt("back");
        } else {
            res.render("comments/edit", {campground_id: req.params.id, comment: comment});
        }
    });
});

// UPDATE COMMENT ROUTE
router.put("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res) {
     Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
         if(err) {
            res.redirect("back") ;
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DESTROY COMMENT ROUTE
router.delete("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        if(err) {
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;