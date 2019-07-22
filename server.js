        //require pendencies loaded //
    var express = require("express");
    var mongoose = require ("mongoose");
    var exphbs = require("express-handlebars");

        //scraping tools //
    var axios = require("axios");
    var cheerio = require("cheerio");

        //require all models //
    var db = require("./models");

    
    var PORT = process.env.PORT || 3000;
    
        //Initializing express //
    var app = express();

      app.use(express.urlencoded({ extended: true }));
      app.use(express.json());

        //create public static folder //  
      app.use(express.static("public"));

       //If deployed, use the deployed database. Otherwise use the local mongoHeadlines database //
       //connect to Mongo db //
        var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
        mongoose.connect(MONGODB_URI);
        console.log("connected to mongoose!");

        app.engine("handlebars", exphbs({ defaultLayout: "main" }));
        app.set("view engine", "handlebars");

                // Routes //
      app.get("/", function(req, res) {
            db.Article.find({})
                .then(function(dbArticle) {
                var dbArticleRev = dbArticle.reverse();
                var hbsObject = {
                    article: dbArticleRev 
                }

                res.render("index", hbsObject);
                })
            });

        app.get("/scrape", function(req, res) {
            axios.get("https://www.nytimes.com/").then(function(response) {

        var $ = cheerio.load(response.data);

        // $("div.headline").each(function(i, element) {

        $("article").each(function(i, element) {
        
            var result = {};
            
          result.title = $(element).find('span.flytitle-and-title__title').text();

          articleURL = $(element).find(".teaser__link").attr("href");
          result.link = "https://www.economist.com" + articleURL;
          img = $(element).find("a").parent().find("img").attr("src");
          result.description = $(element).find(".teaser__text").text();

          if (img) {
            result.img = img;
          }
          else {
            result.img = $("div.component-image__img").find("img").attr("src");
          }
              // Searching through the database
              db.Article.findOne({title:result.title},function(err,data){
                if (!data)
                {
                    var entry = new db.Article(result);
                          // Saving to database
                          entry.save(function(err, data) {
                            if (err) {
                              console.log(err);
                            }
                            else {
                              console.log("saving article, title: "+ data.title);
                              console.log("Link:  " + data.link);
                              console.log("Descriptoin:  " + data.description);
                              console.log("Image link: " + data.img)
                            }
                          });


  //         .children("a")
  //         .text();

  //         result.link = $(this)
  //           .children("a")
  //           .attr("href");

  //         result.description = $(this)
  //           .next()
  //           .text();

  //       //Search the db for articles already scraped
  //       db.Article.findOne({title:result.title},function(err,data){
  //           //if new, add to db //
  //           if (!data)
  //           {
  //               var entry = new db.Article(result);

  //               entry.save(function(err, doc) {
  //                   // Log any errors
  //                   if (err) {
  //                     console.log(err);
  //                   }
  //                   // Or log the doc
  //                   else {
  //                     console.log("saving article, title: "+ doc.title);
  //                   }
  //                 });

        } else {
            console.log("this article is already in db: "+ data.title);
        }
    });
  });

  res.redirect("/");
});
});

        // route for getting all Articles from the db
app.get("/articles", function(req, res) {

    db.Article.find({})
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
            //send if error //
        res.json(err);
      });
  });
  
  app.get("/saved", function(req, res) {
    db.Article.find({saved: true})
      .then(function(dbArticle) {
        var dbArticleRev = dbArticle.reverse();
        var hbsObject = {
          article: dbArticleRev 
        }
        res.render("index", hbsObject);
      })
  });
  
  // Route for saving an article
  app.put("/saved/:id", function(req, res) {
    console.log(req.params.id);
    db.Article.findOneAndUpdate({ _id: req.params.id }, { $set: { saved: true }})
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
  });
  
            //route for article //
  app.get("/articles/:id", function(req, res) {
        
    db.Article.findOne({ _id: req.params.id })
      .populate("note")
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
  });
  
  app.post("/articles/:id", function(req, res) {
    // create note to the entry //
        db.Note.create(req.body)
      .then(function(dbNote) {
       
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
      })
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
            //send if error //
        res.json(err);
      });
  });
  
            //route for deleting an article from db //
  app.delete("/delete/:id", function(req, res) {
  
    db.Article.deleteOne({_id: req.params.id}, function(err){})
      .then(function(dbArticle) {

        res.json(dbArticle);
      })
      .catch(function(err) {
            //send if error //
        res.json(err);
      }); 
  });        

            //local port created for connection //
        app.listen(PORT, () => { 
            console.log("Successful Connection, Listening on PORT " + PORT)
        });