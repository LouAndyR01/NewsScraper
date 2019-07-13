var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var CommentSchema = new Schema ({
    body: {
        type: String,
        minlength: [1, "at least 1 character required"]
    },
});

var Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;

