
require('dotenv').config()
// nodejs to load expres module
const express = require('express');
// initialise new express app
const app = express();

// nodejs method that creates a server that listens to port#
//start server at localhost3000
app.listen(process.env.PORT, function(){
  console.log("server running");
});

// use node's native https get module
//no need to initialise because its a native module
const https = require("https");

//npm install body parser to parse through post request
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));

//to be able to use css file, tell server to look in public folder
app.use(express.static("public"));

const ejs = require("ejs");


//set up pug
app.set('view engine', 'ejs');




// what happens when user tries to go to home page (get request?)
app.get("/", function(req,res){

  //send the html file created to the user
  // res.sendFile(__dirname+"/index.html");
  res.sendFile(__dirname + "/index.html");
});

// app.use((req, res, next) => {
//   const error = new Error("Not found");
//   error.status = 404;
//   next(error);
// });

// error handler middleware
// app.use((error, req, res, next) => {
//     res.status(error.status || 500).send({
//       error: {
//         status: error.status || 500,
//         message: error.message || 'Internal Server Error',
//       },
//     });
//   });
//index.html includes a form that sends a post request
//catch the post request here using app.post
//post request sent to root route, so you catch at root ("/") route
app.post("/", function(req,res){

  // https module requires https:// in front
  //set link to url variable so its more easily readable
  const query = req.body.cityName;
  console.log(query)
  const apiKey = process.env.APIKEY
  const unit = "metric"
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" +apiKey+ "&units="+unit;

  //call get method on https object, using url
  https.get(url, function(response){

  //using the response we get from the get request, do something "on" receiving data, and pass into anon func
    response.on("data", function(data){

  //store data in a variable and convert it to JSON object
      const weatherData = JSON.parse(data);
      console.log(weatherData);

      var weather = {
        city: weatherData.name,
        temperature: Math.round(weatherData.main.temp),
        description: weatherData.weather[0].description,
        icon: weatherData.weather[0].icon
      };

      var weather_data = {weather : weather};

      res.render("index.ejs", weather_data);
    });
  });
})
