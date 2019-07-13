// required dependencies //
const axios = require("axios");
const cheerio = require("cheerio");
const db = require("../models")
const express = require("express");
const exphbs = require("express-handlebars");

//connection for export //
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index');
  });

  router.get('/scrape', (req, res) => {
    // Grab body html with axios, used news-in-brief page because of more consistent elements
    axios.get('https://www.fox4news.com/news').then(response => {

      // Load response into cheerio and store in local variable for a shorthand selector
      const $ = cheerio.load(response.data);
  
      // .item_content divs
      $('div.item__content').each((i, element) => {
        // Save an empty result object
        const result = {};
  
        result.title = $(element)
          .find('h1')
          .text();

        result.img = $(element)
          .find('img-wrapper picture')
          .children()
          .first()
          .attr('data-srcset');

        result.link = $(element)
          .find('.headline a')  
          .attr('href')

        result.summary = $(element)
          .find('.excerpt')
          .first()
          .text();
        
        db.Article.update({ title: result.title}, { $set: result}, { upsert: true }).catch(
            err => res.send(err)
        );
      });
    })
    .then(() => {
        // Redirect to root route to display the index page
        res.redirect('/');
    });
  });
  
        // Route for getting all Articles from the db
  router.get("/articles", (req, res) => {
  
    db.Article.find({})
    .then(function(dbArticle) {
      res.json(dbArticle)
    })
    .catch(function(err) {
      res.json(err);
    });
  });
  
       
  router.get("/articles/:id", (req, res) => {
    
    db.Article.findOne({ _id: req.params.id })
    .populate("note")
    .then(function(dbArticle) {
      res.json(dbArticle)
    })
    .catch(function(err) {
      res.json(err);
    });
  });
  
  router.post("/articles/:id", (req, res) => {
    
    db.Note.create(req.body)
    .then(function(dbNote) {
      return db.Article.findOneAndUpdate({
          _id: req.params.id
        }, { 
          note: dbNote._id
        }, { 
          safe: true,  
          new: true, 
          upsert: true
        });
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
  });

  router.get("/notes/:id", (req, res) => {
    db.Article.findById({ _id: req.params.id })
    .populate("note")
    .then(function(dbArticle) {
     
      res.json(dbArticle)
    })
    .catch(function(err) {
      res.json(err);
    });
  })

  router.delete("articles/:id/:noteid", (req, res) => {
      db.Note.findByIdAndRemove(req.params.noteid, function(error, doc) {
          if (error) {
              console.log(error);
          } else {
              db.Article.findOneAndUpdate({
                _id: req.params.id
              }, {
                 $pull: {
                    note: doc._id
                 } 
              })
              .exec(function (err, doc) {
                  if (err) {
                    console.log(err);
                  }
              });
          };
      });
  });

    //export of router //
module.exports = router;