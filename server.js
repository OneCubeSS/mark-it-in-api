const express = require('express'),
  // create express app
  app = express();
  config = require('./config/config.json'),
  port = config.port || 8000,
  bodyParser = require('body-parser'),
  routes = require('./api'),
  dotenv = require('dotenv');
  mongoose = require('mongoose');

  const path =require('path');

  app.use(express.static(path.join(__dirname, 'public')));


dotenv.config();

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse requests of content-type - application/json
app.use(bodyParser.json());

app.use((request, response, next) => {
  allowCrossDomain(request, response, next);
});

//DB connection
mongoose
  .connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

// define a simple route
app.get('/api', (req, res) => {
    res.json({"message": "Welcome to Mark-It In API application."});
});

var allowCrossDomain = function(req, res, next) {
  var allowedOrigins = config.allowCors.urls;
  var origin = req.headers.origin;

  if (allowedOrigins.indexOf(origin) > -1 || allowedOrigins.indexOf('*') > -1) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', config.allowCors.methods);
  res.header('Access-Control-Allow-Headers', config.allowCors.headers);

  // Need to immediately return the options method with 200 ok response
  if ('OPTIONS' === req.method) {
    return res.sendStatus(200);
  } else {
    next();
  }
};

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