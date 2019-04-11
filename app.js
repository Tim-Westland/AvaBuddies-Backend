const dotenv = require('dotenv');
const result = dotenv.config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
const bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var logger = require('morgan');
var swaggerUi = require('swagger-ui-express'),
    swaggerDocument = require('./swagger.json');

var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var userRouter = require('./routes/user');
var friendRouter = require('./routes/friend');

const message = require('./config/errorMessages');

var app = express();
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.disable("etag");

require('./auth/auth');

mongoose.connect(process.env.DATABASE, {
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
app.set('Access-Control-Allow-Origin');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use( bodyParser.urlencoded({ extended : false }) );

app.use('/auth', authRouter);


app.use('/', passport.authenticate('jwt', {
  session : false
}), indexRouter );

app.use('/user', passport.authenticate('jwt', {
  session : false
}), userRouter );

app.use('/friend', passport.authenticate('jwt', {
  session:false
}), friendRouter);





app.use(function(req, res, next) {
  next(createError(404));
});


app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
