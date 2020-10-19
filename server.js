const express = require('express'),
  // create express app
  app = express();
  config = require('./config/config.json'),
  port = config.port || 8000,
  bodyParser = require('body-parser'),
  routes = require('./api'),
  dotenv = require('dotenv');
  mongoose = require('mongoose');
  cors = require('cors');

  const path =require('path');

  app.use(express.static(path.join(__dirname, 'public')));


dotenv.config();

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse requests of content-type - application/json
app.use(bodyParser.json());

//DB connection
mongoose
  .connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

app.options('*', cors())

// define a simple route
app.get('/api', (req, res) => {
    res.json({"message": "Welcome to Mark-It In API application."});
});

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);
  // Pass to next layer of middleware
  next();
});

// Catch errors in Middlewares
app.use((err, req, res, next) => {
    console.log(err)
    res.status(500).send('Internal Server Error');
});

routes.registerRoutes(app);

// listen for requests
app.listen(port, err => {
    if (err) {
      return console.log('something bad happened', err);
    }
    console.log('Mark-It-In API Server is listening on %s', port);
  });