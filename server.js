    //required dependencies loaded //
var express = require("express");
var mongoose = require ("mongoose");
var logger = require ("morgan");

    //scraping tools //
var axios = require ("axios");
var cheerio = require ("cheerio");

var db = require("./models");

    //setting up the server and intialize express //
var PORT = process.env.PORT || 3000;

var app = express();

    //using for logging requests //
app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

    //handlebars //
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });


app.get("/scrape", function(req, res){
    //axios get to the webpage to scrape
    axios.get("https://www.fox4news.com").then(function(response) {
        
        var $ = cheerio.load(response.data);
        $("div.headline").each(function(i, element){
            
            var result = {};
            result.title = $(this).children().children("a").text();
            result.link = $(this).children().children("a").attr("href");
            result.summary = $(this).children("h5").text();

            //check if article already exists in our db
            db.Article.find({title: result.title}).exec(function(err, doc){
                if(doc.length) {
                    console.log("Article Already Exists");
                   
                }
                else {
                    //create new article in the db //
                    db.Article.create(result).then(function(dbArticle){
                        console.log(dbArticle);
                       
                        res.json(dbArticle); 
                    }).catch(function(err){
                        console.log(err);
                    });  
                }
            });
        });
    });    
});

app.get("/", function(req, res) {
    //get the articles from the db when scraped //
    db.Article.find({}).populate("comment").then(function(dbArticle) {
        var dbArticlesObj = {articles: dbArticle}
        res.render("index", dbArticlesObj);
    }).catch(function(err) {
        res.json(err);
    });
});

app.post("/:articleId", function(req, res) {
    console.log("Comment", req.body);

    db.Comment.create(req.body).then(function(dbComment) {
        return db.Article.findOneAndUpdate({_id: req.params.articleId}, {comment: dbComment._id}, {new: true})
        .then(function(dbArticle) {

            res.json(dbArticle);
        }).catch(function(err){
            res.json(err);
        });
    });
});

    //delete the comment from the comments
    //return the article  and send to the front end //
app.delete("/:commentId", function(req, res) {
       db.Comment.deleteOne({_id: req.params.commentId}).then(function(dbComment){
        return db.Article.findOneAndUpdate({_id: req.params.id}, {new: true})
    }).then(function(dbArticle){
        res.json(dbArticle);
    }).catch(function(err){
        res.json(err);
    });
});

    //local port created for connection //
app.listen(PORT, function() { 
    console.log("Successful Connection, Listening on PORT " + PORT)
});

