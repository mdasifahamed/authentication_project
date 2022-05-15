//jshint esversion:6
require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const md5 = require('md5') // to encrypt user data
const app = express();
app.set("view engine", 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));
mongoose.connect("mongodb://localhost:27017/userDB")
const userShcema = new mongoose.Schema({ // creating new schema to store user data in the database
  email: String,
  password: String
});


const User = mongoose.model("User", userShcema); // creating database model

app.get("/", function(req, res) {
  res.render("home");
});

app.get("/login", function(req, res) {
  res.render("login");
});

app.get("/register", function(req, res) {
  res.render("register");
});
// from this post method will get user email and password throug html form
app.post("/register", function(req, res) {
  const username = req.body.username; // recieving usename from user
  const password = md5(req.body.password); // recieving password from user and converting it to hash using md5 module
  const user = new User({ // storing user registration data to the database creating object its model
    email: username,
    password: password
  });
  user.save(function(err) { // saving user log in data to the data base
    if (err) {
      console.log(err);
    } else {
      res.render("secrets"); // if no error is found then only the registerd user able to see the sectrets.ejs page ejs render method
    }
  });
})
app.post('/login', function(req, res) {
  const username = req.body.username; // from the log in page getting user name from the user
  const password = md5(req.body.password); // from the log in page getting user password from the user and also converting it in hash with th md5 module to match with the database
  User.findOne({
    email: username
  }, function(err, foudedUser) { // after the user press log in this findone method firt look for user email that has in our datbase or not
    if (err) {
      console.log(err);
    } else {
      if (foudedUser) { // if the username i mean the email shows in the datbase then it go to next condition
        if (foudedUser.password = password) { // if the the user email shows in the database then it check for password that has been registered with this email.
          res.render("secrets"); // if password mathces the can be able log in as the secrets.ej page will render .
        }
      }
    }
  });
});



app.listen(3000, function(req, res) {
  console.log("Server Started On Port 3000");
})
