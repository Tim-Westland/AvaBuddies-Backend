var createError = require('http-errors');
var express = require('express');
var path = require('path');
const bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var userRouter = require('./routes/user');
var secRouter = require('./routes/sec-route');

var app = express();

require('./auth/auth');

mongoose.connect('mongodb://server:ry5pm4EaeyGR@ds121636.mlab.com:21636/avabuddies-backend-live', {
  useNewUrlParser: true
});

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use( bodyParser.urlencoded({ extended : false }) );

app.use('/auth', authRouter);
app.use('/', authRouter);

app.use('/user', passport.authenticate('jwt', {
  session : false
}), userRouter );

app.use('/index', passport.authenticate('jwt', {
  session : false
}), indexRouter );

//We plugin our jwt strategy as a middleware so only verified users can access this route


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
