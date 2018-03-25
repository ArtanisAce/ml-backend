const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const axios = require('axios');
const cors = require('cors');
const apiKey = require('./config-vars').apiKey;

const app = express();

app.use(helmet());
app.use(cors());

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.get('/get-config', async (req, res) => {
  try {
    const response = await axios.get(`https://api.themoviedb.org/3/configuration?api_key=${apiKey}`);
    res.send(response.data);
  } catch (e) {
    const status = e.response.status;
    const statusText = e.response.statusText;
    const errorMessage = e.response.data.status_message;
    console.error(`Error -> ${statusText}: ${errorMessage}`);
    res.status(status).send(statusText);
  }
});

app.get('/search-film', async (req, res) => {
  const film = req.query.film;
  try {
    const response = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${film}`);
    res.send(response.data);
  } catch (e) {
    const status = e.response.status;
    const statusText = e.response.statusText;
    const errorMessage = e.response.data.status_message;
    console.error(`Error -> ${statusText}: ${errorMessage}`);
    res.status(status).send(statusText);
  }
});

module.exports = app;
