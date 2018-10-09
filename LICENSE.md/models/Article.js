var mongoose = require("mongoose");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    episode: {
        type: Schema.Types.ObjectId,
        ref: "Episode"
    },
    created: {
        type: Date,
        default: Date.now
    }
})

const Comment = mongoose.model("Article", ArticleSchema);
module.exports = Article;
