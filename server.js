    //intializes express app //
var express = require("express");
var app = express();

    //required depedencies //
var bodyParser = require("body-parser");
var mongoose = require ("mongoose");
var logger = require ("morgan");

    //setting up the logger //
app.use(logger("dev"));
app.use(
    bodyParser.urlencoded({
       extended: false 
    })
);

    
app.use(express.static(process.cwd() + "/public"));

    //handlebars //
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

    //establishing mongoose connection //
mongoose.connect("mongodb://localhost/scraped_news");
var db = mongoose.connection;

    //this lets me know I am connected to mongoose //
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
    console.log("Connected to Mongoose"); 
});

    //local port created for connection //
var port = process.env.PORT || 3000;
app.listen(port, function() { 
    console.log("Successful Connection, Listening on PORT " + port)
});

