var request = require('supertest');
var expect = require('chai').expect;
var should = require('chai').should();

const bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var logger = require('morgan');
var express = require('express');

var indexRouter = require('../routes/index');
var authRouter = require('../routes/auth');
var userRouter = require('../routes/user');
var secRouter = require('../routes/sec-route');

mongoose.connect('mongodb://server:9T9F8QR9xzBo@ds121636.mlab.com:21636/avabuddies-backend-dev', {
	useNewUrlParser: true
});

require('../auth/auth');

var app = express();
app.use( bodyParser.urlencoded({ extended : false }) );
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
});

app.use('/auth', authRouter);

app.use('/', passport.authenticate('jwt', {
	session : false
}), indexRouter );

app.use('/user', passport.authenticate('jwt', {
	session : false
}), userRouter );


function makeGetRequest(route, statusCode, done){
	request(app)
		.get(route)
		.expect(statusCode)
		.end(function(err, res){
			if(err){ return done(err); }

			done(null, res);
		});
};

function makePostRequest(route, data, statusCode, done){
	request(app)
		.post(route)
		.send(data)
		.expect(statusCode)
		.end(function(err, res){
			if(err){ return done(err); }
			console.log(res.text);
			done(null, res);
		});
};

describe('Auth', function(){
	it('authenticated path should return an error when no token is used.', function(done) {
		makePostRequest('/auth/login','email=simon@projectsoa.onmicrosoft.com&password=SamplePassword',200, done);

	});
});
