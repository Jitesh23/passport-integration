const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const errorHandler = require('errorhandler');


//Configure mongoose's promise to global promise

mongoose.promise = global.promise;

//Configure isProduction variable

const isProduction = process.env.NODE_ENV === 'production';


//Initiate our app

const app = express();

//Configure our app

app.use(cors());
app.use(require('morgan')("dev"));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(session({
  secret: 'passport-tutorial',
  cookie: {
    maxAge: 60000
  },
  resave: false,
  saveUninitialized: false
}));


if(!isProduction){
  app.use(errorHandler());
}


//Configure mongoose

mongoose.connect('mongodb://localhost/passport');
mongoose.set('debug', true);


//Error Handlers && middlewares

if (!isProduction) {
  app.use((err, req, res) => {
    res.status(err.status || 500);

    res.json({
      errors: {
        message: err.message,
        error: err,
      },
    });
  });
}

app.use((err, req, res) => {
  res.status(err.status || 500);

res.json({
  errors: {
    message: err.message,
    error: {},
  },
});
});

app.listen(3000, () => {
  console.log('Server is started on PORT 3000');
});
