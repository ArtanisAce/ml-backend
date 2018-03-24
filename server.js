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
    const response = await axios.get(`https://api.themoviedb.org/3/configuration?api_key=12233`);
    res.send(response.data);
  } catch(e) {
    console.error(e.response.data);
    res.send(e.response.data);
  }
});

app.get('/search-film', async (req, res) => {
  const film = req.query.film;
  try {
    const response = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${film}`);
    console.log(response.data);
    res.send(response.data);
  } catch(e) {
    console.error(e.response.data);
    res.send(e.response.data);
  }
});

module.exports = app;
