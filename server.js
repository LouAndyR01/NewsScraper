    //required dependencies loaded //
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