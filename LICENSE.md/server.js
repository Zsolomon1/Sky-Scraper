const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

const mongoose = require("mongoose");
const db = require("./models");
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newsScraperTest";
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

const axios = require("axios");
const cheerio = require("cheerio");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

app.use(express.static("./public"));

const convertDate = require("./convertDate.js");


app.get("/", (req, res) => {
   axios.get("https://www.washingtonpost.com/politics/?utm_term=.b3302e527548")..then(response => {
        const $ = cheerio.load(response.data);

        $("div.podcast-episode-header").each(function(i, episode) {
            let completeEpisodeInfo = {
                number: $(this).children(".episode--info--episode-number").text().replace(/(\r\n\t|\n|\r\t)/gm," ").replace(/\s+/g," ").trim(),
                title: $(this).children(".episode--info--title").text().replace(/(\r\n\t|\n|\r\t)/gm," ").trim(),
                link: "http://www.codenewbie.org" + $(this).parents( $("a.podcasts-list--grid-item--link") ).attr("href"),
                summary: ""
            };


            axios.get(completeEpisodeInfo.link).then(individualResponse => {
                const $$ = cheerio.load(individualResponse.data);
                completeEpisodeInfo.summary = $$(".episode__text-content__article").children("p").text();
                let date = $$(".episode-header__date").text();
                completeEpisodeInfo.date = parseInt(convertDate(date));


                db.Episode.create(completeEpisodeInfo)
                    .catch(err => console.log(err));
            });
        });

        res.redirect("/home");
    });
});

app.get("/home", (req, res) => {
    db.Episode.find({}).sort({ date: -1 }).then(function(episodes) {
        res.render("index", {episodes: episodes});  
    });
});

app.get("/:id", (req, res) => {
    db.Episode.findOne({_id: req.params.id})
        .populate("comments")
        .then(dbEpisode => res.render("episode", dbEpisode))
        .catch(err => console.log(err));
});

app.post("/new-comment/:id", (req, res) => {
    let commentData = req.body;
    commentData.episode = req.params.id;

    db.Comment.create(commentData)
        .then(dbComment => {
            return db.Episode.findOneAndUpdate({_id: req.params.id}, {$push: {comments: dbComment._id}})
        })
        .then(dbEpisode => res.end())
        .catch(err => console.log(err));
});

app.delete("/:id", (req, res) => {
    console.log(req.params.id);
    db.Comment.findByIdAndDelete(req.params.id)
        .then(dbComment => res.end())
        .catch(err => console.log(err));
});



app.listen(PORT, () => {
    console.log("App listening on PORT " + PORT);
});
  
 
