var expect = require('chai').expect;
var should = require('chai').should();

var app = require('express')();
var calendar = require('../routes/user');
app.use('/', calendar);

function makeRequest(route, statusCode, done){
	request(app)
		.get(route)
		.expect(statusCode)
		.end(function(err, res){
			if(err){ return done(err); }

			done(null, res);
		});
};

describe('Testing user role', function(){
	describe('without params', function(){
		it('should return todays date', function(done){
			var today = new Date();
			var expectedString =
				(today.getDate() < 10 ? '0' : '') +
				today.getDate() + '-' +
				(today.getMonth() + 1 < 10 ? '0' : '') +
				(today.getMonth() + 1) + '-' +
				today.getFullYear();

			makeRequest('/', 200, function(err, res){
				if(err){ return done(err); }

				expect(res.body).to.have.property('date');
				expect(res.body.date).to.not.be.undefined;
				expect(res.body.date).to.equal(expectedString);
				done();
			});
		});
	});
});
