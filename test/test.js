var request = require('supertest');
var expect = require('chai').expect;
var should = require('chai').should();
const dotenv = require('dotenv');
const result = dotenv.config();

const bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var logger = require('morgan');
var express = require('express');

var indexRouter = require('../routes/index');
var authRouter = require('../routes/auth');
var userRouter = require('../routes/user');
var friendRouter = require('../routes/friend');

const UserModel = require('../models/user');
const FriendModel = require('../models/friends');


require('../auth/auth');

var app = express();


function makeGetRequest(route, statusCode, done) {
  request(app)
    .get(route)
    .expect(statusCode)
    .end(function(err, res) {
      if (err) {
        return done(err);
      }

      done(null, res);
    });
};

function makeAuthGetRequest(route, token, statusCode, done) {
  request(app)
    .get(route)
    .set('Authorization', 'Bearer ' + token)
    .expect(statusCode)
    .end(function(err, res) {
      if (err) {
        return done(err);
      }

      done(null, res);
    });
};

function makeAuthPostRequest(route, data, token, statusCode, done) {
  request(app)
    .post(route)
    .set('Authorization', 'Bearer ' + token)
		.send(data)
    .expect(statusCode)
    .end(function(err, res) {
      if (err) {
        return done(err);
      }

      done(null, res);
    });
};

function makePostRequest(route, data, statusCode, done) {
  request(app)
    .post(route)
    .send(data)
    .expect(statusCode)
    .end(function(err, res) {
      if (err) {
        return done(err);
      }

      done(null, res);
    });
};

describe('Tests', function() {
  before(function(done) {

    mongoose.connect(process.env.TESTDATABASE, {
      useNewUrlParser: true
    });

    //Get the default connection
    var db = mongoose.connection;

    app.use(bodyParser.urlencoded({
      extended: false
    }));
    app.use(express.json());
    app.use(express.urlencoded({
      extended: false
    }));

    app.use('/auth', authRouter);

    app.use('/', passport.authenticate('jwt', {
      session: false
    }), indexRouter);

    app.use('/user', passport.authenticate('jwt', {
      session: false
    }), userRouter);

    app.use('/friend', passport.authenticate('jwt', {
      session: false
    }), friendRouter);


    //Bind connection to error event (to get notification of connection errors)
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
      done();
    });


  });


  describe.only('Authentication', function() {
    before(function(done) {
      var user = new UserModel({
        email: 'tim@dev.nl',
        name: 'tim',
        password: 'test',
        sharelocation: true
      });
      user.save(function(err) {
        if (err) return done(err);
        done(null, null)
      });
    });

    it('login should return an token when logged in with valid credentials.', function(done) {
      makePostRequest('/auth/login', 'email=tim@dev.nl&password=test', 200, done);
    });

    it('login should return an 401 error when invalid credentials are used.', function(done) {
      makePostRequest('/auth/login', 'email=tim@dev.nl&password=wrongpassword', 401, done);
    });

    it('login should return an 401 error when incorrect parameters are used.', function(done) {
      makePostRequest('/auth/login', 'qwerty', 401, done);
    });


    after(function(done) {

      UserModel.deleteOne({
        email: 'tim@dev.nl'
      }).exec();
      done(null, null);
    })
  });

  describe.only('Profile', function() {
    var token = '';

    before(function(done) {
      var user = new UserModel({
        email: 'tim@dev.nl',
        name: 'tim',
        password: 'test',
        sharelocation: true
      });
      user.save(function(err) {
        if (err) return next(error);
        done(null, null)
      });

    });

    it('route should return the user profile when authenticated.', function(done) {
      makePostRequest('/auth/login', 'email=tim@dev.nl&password=test', 200, function(err, res) {
        if (err) {
          console.log(err.text);
        }
        if (res) {
          var json = JSON.parse(res.text);
          token = json.token;
          makeAuthGetRequest('/user/profile', token, 200, done);
        }
      });

    });

    after(function(done) {

      UserModel.deleteOne({
        email: 'tim@dev.nl'
      }).exec();
      done(null, null);
    })
  });




  describe.only('Request', function() {
    var token = '';
		before(function(done) {

      this.users = [new UserModel({
        email: 'tim@test.nl',
        name: 'tim',
        password: 'test',
        sharelocation: true
      }),
      new UserModel({
        email: 'bart@test.nl',
        name: 'bart',
        password: 'test',
        sharelocation: true
      })]
			UserModel.create(this.users, function (err) {
				done(null, null)
			});

    });

    it('route should make a friend request.', function(done) {
		var users = this.users;
      makePostRequest('/auth/login', 'email=tim@test.nl&password=test', 200, function(err, res) {
        if (err) {
          console.log(err.text);
        }
        if (res) {
          var json = JSON.parse(res.text);
          token = json.token;
          makeAuthPostRequest('/friend/request', 'friend='+users[1]._id, token, 200, done);
        }
      });

    });

		it('route should accept friend request.', function(done) {
		var users = this.users;
			makePostRequest('/auth/login', 'email=bart@test.nl&password=test', 200, function(err, res) {
				if (err) {
					console.log(err.text);
				}
				if (res) {
					var json = JSON.parse(res.text);
					token = json.token;
					makeAuthPostRequest('/friend/acceptrequest', 'friend='+users[0]._id, token, 200, done);
				}
			});

		});

    after(function(done) {

      FriendModel.deleteMany({}).exec();

      done(null, null);
    })

    before(function(done) {
      this.request = new FriendModel({
        friend1: this.users[0]._id,
        friend2: this.users[1]._id,
        confirmed: false
      })

      FriendModel.create(this.request, function (err) {
				done(null, null)
			});
    })

    it('route should deny friend request.', function(done) {
      var users = this.users;
      makePostRequest('/auth/login', 'email=bart@test.nl&password=test', 200, function(err, res) {
        if (err) {
          console.log(err.text);
        }
        if (res) {
          var json = JSON.parse(res.text);
          token = json.token;
          makeAuthPostRequest('/friend/denyrequest', 'friend=' + users[1]._id, token, 200, done);
        }
      });

    });

		after(function(done) {

      UserModel.deleteOne({
        email: 'tim@test.nl'
      }).exec();

      UserModel.deleteOne({
        email: 'bart@test.nl'
      }).exec();

      FriendModel.deleteMany({}).exec();

      done(null, null);
    })
  });


  console.log("test");

  after(function(done) {
    mongoose.connection.close(done);
  });
});
