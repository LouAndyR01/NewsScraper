    //require all created models //
    var db = require("../models"),

    // required dependencies, scraping tools //
var axios = require("axios");
var cheerio = require("cheerio");

// const db = require("../models")
// const express = require("express");
// const exphbs = require("express-handlebars");

//connection for export //
// const router = express.Router();

// router.get('/', (req, res) => {
//     res.render('index');
//   });

module.exports = function (app) {
  app.get("/api/scrape", function (req, res) {



    axios.get("https://www.npr.org/").then(function (response) {
      var $ = cheerio.load(response.data);

      var result = {};
      $(".story-text").each(function (i, element) {
      result.title = $(this).find(".title").text();
      result.link = $(this).find(".title").parent().attr("href");
      result.summary = $(this).find(".teaser").text();

      db.Article.remove({}, function(err) {
        if (err) {
            console.log(err)
        }
        else {
            res.end('success')
        }
    });
    db.Article.create(result)
        .then(function (dbArticle) {
            console.log(dbArticle);
        })
        .catch(function (err) {
            console.log(err);
        });
      });
    });
  });

  app.get("/api/articles", function (req, res) {
    db.Article.find({})
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

app.delete("/api/articles", function (req, res) {
  db.Article.remove({})
      .then(function (dbArticle) {
          res.json(dbArticle);
      })
      .catch(function (err) {
          res.json(err);
      });
});

app.delete("/api/saved", function (req, res) {
    db.Save.remove({})
    .then(function (dbArticle) {
        res.json(dbArticle);
    })
    .catch(function (err) {
        res.json(err);
    });
});
    
app.delete("/api/notes", function (req, res) {
    db.Note.remove({})
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

app.get("/api/saved", function (req, res) {
    db.Save.find({})
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

app.get("/api/articles/:id", function (req, res) {
    db.Article.findOne({ _id: req.params.id })
        .then(function (dbArticle) {
            res.json(dbArticle);      
        })
        .catch(function (err) {
            res.json(err);
        });
});

app.get("/api/saved/:id", function (req, res) {
    db.Save.findOne({ _id: req.params.id })
    .populate("note")
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

app.delete("/api/articles/:id", function (req, res) {
    db.Article.remove({ _id: req.params.id })
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

app.delete("/api/notes/:id", function (req, res) {
    db.Note.remove({ _id: req.params.id })
        .then(function (dbNote) {
            res.json(dbNote);
        })
        .catch(function (err) {
            res.json(err);
        });
});

app.delete("/api/saved/:id", function (req, res) {
    db.Save.remove({ _id: req.params.id })
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

app.post("/api/saved", function (req, res) {
    console.log(req.body);

    var result = {};
    result.title = req.body.title;
    result.link = req.body.link;
    result.summary = req.body.summary;

    db.Save.create(result)
    .then(function (dbSaved) {
        console.log(dbSaved);
    })
    .catch(function (err) {
        console.log(err);
    });
});

app.get("/articles/:id", function (req, res) {
    db.Article.findOne({ _id: req.params.id })
        .populate("note")
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

app.post("/api/notes/:id", function (req, res) {
    db.Note.create(req.body)
        .then(function (dbNote) {

            return db.Save.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
        })
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

}


 
//       const $ = cheerio.load(response.data);
  
    
//       $('div.item__content').each((i, element) => {

//         const result = {};
  
//         result.title = $(element)
//           .find('h1')
//           .text();

//         result.img = $(element)
//           .find('img-wrapper picture')
//           .children()
//           .first()
//           .attr('data-srcset');

//         result.link = $(element)
//           .find('.headline a')  
//           .attr('href')

//         result.summary = $(element)
//           .find('.excerpt')
//           .first()
//           .text();
        
//         db.Article.update({ title: result.title}, { $set: result}, { upsert: true }).catch(
//             err => res.send(err)
//         );
//       });
//     })
//     .then(() => {
//         // Redirect to root route to display the index page
//         res.redirect('/');
//     });
//   });
  
//         // Route for getting all Articles from the db
//   router.get("/articles", (req, res) => {
  
//     db.Article.find({})
//     .then(function(dbArticle) {
//       res.json(dbArticle)
//     })
//     .catch(function(err) {
//       res.json(err);
//     });
//   });
  
       
//   router.get("/articles/:id", (req, res) => {
    
//     db.Article.findOne({ _id: req.params.id })
//     .populate("note")
//     .then(function(dbArticle) {
//       res.json(dbArticle)
//     })
//     .catch(function(err) {
//       res.json(err);
//     });
//   });
  
//   router.post("/articles/:id", (req, res) => {
    
//     db.Note.create(req.body)
//     .then(function(dbNote) {
//       return db.Article.findOneAndUpdate({
//           _id: req.params.id
//         }, { 
//           note: dbNote._id
//         }, { 
//           safe: true,  
//           new: true, 
//           upsert: true
//         });
//     })
//     .then(function(dbArticle) {
//       res.json(dbArticle);
//     })
//     .catch(function(err) {
//       res.json(err);
//     });
//   });

//   router.get("/notes/:id", (req, res) => {
//     db.Article.findById({ _id: req.params.id })
//     .populate("note")
//     .then(function(dbArticle) {
     
//       res.json(dbArticle)
//     })
//     .catch(function(err) {
//       res.json(err);
//     });
//   })

//   router.delete("articles/:id/:noteid", (req, res) => {
//       db.Note.findByIdAndRemove(req.params.noteid, function(error, doc) {
//           if (error) {
//               console.log(error);
//           } else {
//               db.Article.findOneAndUpdate({
//                 _id: req.params.id
//               }, {
//                  $pull: {
//                     note: doc._id
//                  } 
//               })
//               .exec(function (err, doc) {
//                   if (err) {
//                     console.log(err);
//                   }
//               });
//           };
//       });
//   });

//     //export of router //
// module.exports = router;