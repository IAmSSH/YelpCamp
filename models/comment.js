var mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
    text: String,
    time: Date,
    createdAt: Date,
    author:{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }, username: String
    }
});

module.exports = mongoose.model("Comment", commentSchema);