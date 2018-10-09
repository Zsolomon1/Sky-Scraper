const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EpisodeSchema = new Schema({
    number: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    date: {
        type: Number,
        required: false
    },
    link: {
        type: String,
        required: true
    },
    summary: {
        type: String
    },
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

const Episode = mongoose.model("Episode", EpisodeSchema);
module.exports = Episode;