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
var tagRouter = require('../routes/tag');

const UserModel = require('../models/user');
const FriendModel = require('../models/friends');
const TagModel = require('../models/tag');

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

function makeAuthDeleteRequest(route, token, statusCode, done) {
  request(app)
    .delete(route)
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

describe('Tests', function(done) {
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

    app.use('/tag', passport.authenticate('jwt', {
      session: false
    }), tagRouter);


    //Bind connection to error event (to get notification of connection errors)
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
      done();
    });


  });

  describe('accounts', function() {


    describe('Authentication', function() {
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
        makePostRequest('/auth/login', 'email=tim@dev.nl&password=test', 200, function(err, res) {
          JSON.parse(res.text).should.have.property("token");
          done(null, null);
        });
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
        }).exec(done);
      })
    });

    describe('Profile', function() {

      it('registration should return an userprofile with the given properties', function(done) {
        makePostRequest('/auth/signup', 'email=bob@example.com&name=bob&password=testpassword&sharelocation=true', 200, done)
      });

      after(function(done) {
        UserModel.deleteOne({
          email: 'bob@example.com'
        }).exec(done);
      });

      var token = '';

      before(function(done) {
        var user = new UserModel({
          email: 'tim@dev.nl',
          name: 'tim',
          password: 'test',
          sharelocation: true
        });
        user.save(function(err) {
          if (err) return done(error, null);
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
            makeAuthGetRequest('/user/profile', token, 200, function(err, res) {
              res.body.should.be.a('object');
              res.body.user.should.have.property('name');
              done(null, null);
            });
          }
        });

      });

      after(function(done) {

        UserModel.deleteOne({
          email: 'tim@dev.nl'
        }).exec(done);
      });

      before(function(done) {
        var user = new UserModel({
          email: 'yoeri@river.nl',
          name: 'yoeri',
          password: 'kitty',
          sharelocation: true
        });
        user.save(function(err) {
          if (err) console.log(err);
          done(null, null)
        });

      });

      it('should delete a user account when the route is reached', function(done) {
        makePostRequest('/auth/login', 'email=yoeri@river.nl&password=kitty', 200, function(err, res) {
          if (err) {
            console.log(err.text);
          }
          if (res) {
            var json = JSON.parse(res.text);
            token = json.token;
            makeAuthGetRequest('/user/profile', token, 200, function(err, res) {
              var profile = JSON.parse(res.text).user;
              makeAuthDeleteRequest('/user/destroy/' + profile._id, token, 200, done);

            });
          }
        });
      });

    });
    describe('Request', function() {
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
          })
        ]
        UserModel.create(this.users, function(err) {
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
            makeAuthPostRequest('/friend/request', 'friend=' + users[1]._id, token, 200, done);
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
            makeAuthPostRequest('/friend/acceptrequest', 'friend=' + users[0]._id, token, 200, done);
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

        FriendModel.create(this.request, function(err) {
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


    describe('connections', function(done) {
      before(function(done) {
        var user = new UserModel({
          email: 'yoeri@connectiontests.nl',
          name: 'yoeri',
          password: 'kitty',
          sharelocation: true
        });
        user.save(function(err) {
          if (err) console.log(err);
          done(null, null)
        });
      });

      it('should return a list of user ', function() {
        makePostRequest('/auth/login', 'email=yoeri@connectiontests.nl&password=kitty', 200, function(err, res) {
          if (err) {
            console.log(err.text);
          }
          if (res) {
            var json = JSON.parse(res.text);
            token = json.token;
            makeAuthGetRequest('/user/list', token, 200, function(err, res) {
              res.body.users.should.be.a('array');

            });
          }
        });
      });

      after(function(done) {
        UserModel.deleteOne({
          email: 'yoeri@connectiontests.nl'
        }).exec(done)
      });
    });

    describe('connections', function(done) {
      before(function(done) {
        var user = new UserModel({
          email: 'tim@tagtests.nl',
          name: 'tim',
          password: 'tagtest',
          isAdmin: true,
          sharelocation: true
        });
        user.save(function(err) {
          if (err) console.log(err);
          done(null, null)
        });
      });

      it('should return tag ', function() {
        makePostRequest('/auth/login', 'email=tim@tagtests.nl&password=tagtest', 200, function(err, res) {
          if (err) {
            console.log(err);
          }
          if (res) {
            var json = JSON.parse(res.text);
            token = json.token;
            makeAuthPostRequest('/tag/create', "name=test", token, 200, function(err, res) {
              // res.body.users.should.be.a('array');
              console.log(res.body);

            });
          }
        });
      });

      after(function(done) {
        UserModel.deleteOne({
          email: 'tim@tagtests.nl'
        }).exec(done)
      });
    });




  });

  after(function(done) {
    mongoose.connection.close(done);
  });

});
