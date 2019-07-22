var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
    title: {
        type: String,
        required: true
    },

    link: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
      },

      saved: {
        type: Boolean,
        default: false
      },

    note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
    }
});

    //mongoose method to create schema //
var Article = mongoose.model("Article", ArticleSchema);

    //exports the article model //
module.exports = Article;
