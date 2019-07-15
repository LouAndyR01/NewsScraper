    //require pendencies loaded //
    var express = require("express");
    var mongoose = require ("mongoose");
    var logger = require ("morgan");
    var exphbs = require("express-handlebars");
    
    var PORT = process.env.PORT || 3000;
    
        //Initializing express //
    var app = express();

      //using for logging requests //
      app.use(logger("dev"));

      app.use(express.urlencoded({ extended: true }));
      app.use(express.json());
  
      app.use(express.static("public"));

       //If deployed, use the deployed database. Otherwise use the local mongoHeadlines database //
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Routes
require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);

    //local port created for connection //
app.listen(PORT, () => { 
    console.log("Successful Connection, Listening on PORT " + PORT)
});
