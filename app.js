var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
import APIRoutes from './routes/api';
import cors from 'cors';
import models from './models';
import passport from './modules/passport';
var bodyParser = require('body-parser');
var expressJWT = require('express-jwt');
var app = express();
var env = require('dotenv').config();
// var passport =require('passport');
var LocalStrategy = require('passport-local');
var mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI);
//
// var index = require('./routes/index');
// var users = require('./routes/users');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.options('*', cors());
// Allow requests from any localhost -- on any port
const corsHostnameWhitelist = [/http:\/\/localhost(?::\d{1,5})?$/,
  /http:\/\/app\.pass-myexam\.com/,
  /https:\/\/app\.pass-myexam\.com/,
/http:\/\/54\.191\.238\.235(?::\d{1,5})?$/,];
app.use(cors({
  origin: corsHostnameWhitelist
}));


// app.use('/', index);
// app.use('/users', users);

app.use(passport.initialize());

app.use('/', expressJWT({
  secret: process.env.JWT_SECRET
}).unless({
  // Doesn't protect /api/v1/auth (except for /auth/renew) or /api/v1/version
  //path: /\/api\/login(?!\/renew)/
  path: [/\/api\/login(?!\/renew)/,
    /\/api\/authenticate\/login(?!\/renew)/,
    /\/api\/authenticate\/new-user(?!\/renew)/,
    /\/api\/authenticate\/reset-password(?!\/renew)/,
    /\/api\/authenticate\/forgot-password(?!\/renew)/
  ]
}));

APIRoutes(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
