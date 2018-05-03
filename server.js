require("dotenv").config();

const express = require("express");
const path = require("path");
const favicon = require("serve-favicon");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const axios = require("axios");
const cors = require("cors");
const mongoose = require("mongoose");
const apiKey = require("./config/config-vars").apiKey;
const User = require("./models/user");
// const MongoStore = require('connect-mongo')(session);

// //connect to MongoDB
// mongoose.connect('mongodb://localhost/test');
// var db = mongoose.connection;

// //handle mongo error
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function () {
//   // we're connected!
// });
const option = {
  socketTimeoutMS: 30000,
  keepAlive: true,
  reconnectTries: 30000
};

const mongoURI = "mongodb://localhost/ml-app";
mongoose.connect(mongoURI, option).then(
  () => {
    console.log('Connected to db succesfully!')
  },
  (err) => {
    console.error.bind(console, 'connection error:')
  }
);

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.get("/get-config", (req, res) => {
  const url = `https://api.themoviedb.org/3/configuration?api_key=${apiKey}`;
  tmdbRequest(req, res, url);
});

app.get("/search-film", (req, res) => {
  const film = req.query.film;
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${film}`;
  tmdbRequest(req, res, url);
});

app.post("/create-user", (req, res) => {
  if (req.body.email && req.body.password && req.body.genre) {
    const userData = {
      email: req.body.email,
      password: req.body.password,
      genre: req.body.genre
    };

    User.create(userData, (err, user) => {
      // if (err) {
      //   return next(err);
      // } else {
      //   return res.sendStatus(201);
      // }
      console.log(userData);
      return err ? console.error(err) : res.sendStatus(201);
    });
  }
});

const tmdbRequest = async (req, res, url) => {
  try {
    const response = await axios.get(url);
    res.send(response.data);
  } catch (e) {
    const status = e.response.status;
    const statusText = e.response.statusText;
    const errorMessage = e.response.data.status_message;
    console.error(`Error -> ${statusText}: ${errorMessage}`);
    res.status(status).send(statusText);
  }
};

module.exports = app;
