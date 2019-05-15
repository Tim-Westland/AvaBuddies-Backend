var expect = require('chai').expect;
var should = require('chai').should();
const dotenv = require('dotenv');
const result = dotenv.config();

const bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var logger = require('morgan');
var express = require('express');
const { mockRequest, mockResponse } = require('mock-req-res')
const sinon = require('sinon')

const UserController = require('../controllers/userController');
const TagController = require('../controllers/tagController');
const FriendController = require('../controllers/friendController');
const AuthController = require('../controllers/authController');


const User = require('../models/user');
const Friend = require('../models/friend');
const Tag = require('../models/tag');

var app = express();

async function get(res, req) {
  return await TagController.getTag(res, req)
  done();
}

describe('Tests', function(done) {
  before(function(done) {

    mongoose.connect(process.env.TESTDATABASE, {
      useNewUrlParser: true
    });
    mongoose.set('useFindAndModify', false);
    //Get the default connection
    var db = mongoose.connection;

    //Bind connection to error event (to get notification of connection errors)
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
    });

    // create objects
    // Ceate user objects
    localUser = new User({
      email: 'local@test.nl',
      name: 'local',
      password: 'local',
      isAdmin: true
    });
    localUser.save(function() {});

    userOne = new User({
      email: 'userOne@test.nl',
      name: 'userOne',
      password: 'test',
    })
    userOne.save(function() {});

    userTwo = new User({
      email: 'userTwo@test.nl',
      name: 'userTwo',
      password: 'test',
    })
    userTwo.save(function() {});

    userThree = new User({
      email: 'userThree@test.nl',
      name: 'userThree',
      password: 'test',
    })
    userThree.save(function() {});




    requestOne = new Friend({
      user: localUser._id,
      friend: userTwo._id
    })
    requestOne.save(function() {});




    requestTwo = new Friend({
      user: localUser._id,
      friend: userOne._id,
      accepted: true
    })
    requestTwo.save(function() {});

    requestThree = new Friend({
      user: userThree._id,
      friend: localUser._id
    })
    requestThree.save(function() {});


    //create tag objects
    tagOne = new Tag({
      name: 'tagOne'
    })
    tagOne.save(function() {});

    tagTwo = new Tag({
      name: 'tagOne'
    })
    tagTwo.save(function() { done(null, null) });
  });

  describe('Tags', function(done) {

    const res = mockRequest();
    res.status = sinon.stub().returns(res);
    res.send = sinon.spy();

    describe('create', function(done) {
      var data = null;
      before( async() => {
        var reqOptions = { body: { name: 'createdTag'}, test: true };
        var req = mockRequest(reqOptions);

        data = await TagController.createTag(req, res);
      })

      it('should create a tag', function(done) {
        expect(data.name).to.equal('createdTag');
        done()
      });
    });

    describe('find', function(done) {
      var data = null;
      before( async() => {
        var reqOptions = { params: { id: tagOne._id}, test: true };
        var req = mockRequest(reqOptions);

        data = await TagController.getTag(req, res);
      })

      it('should find a tag', function(done) {
        expect(data.name).to.equal('tagOne');
        done()
      });
    });

    describe('update', function(done) {
      before( async() => {
        var reqOptions = { params: { id: tagOne._id}, body: {name: 'newName', isPrivate: false}, test: true };
        var req = mockRequest(reqOptions);
        data = await TagController.updateTag(req, res);
        updateTag = await TagController.getTag(req, res);
      })

      it('should update a tag', function(done) {
        expect(updateTag.name).to.equal('newName');
        expect(updateTag.isPrivate).to.equal(false);
        done()
      });
    });

    describe('delete', function(done) {
      before( async() => {
        var reqOptions = { params: { id: tagTwo._id}, test: true };
        var req = mockRequest(reqOptions);
        deletedTag = await TagController.deleteTag(req, res);
        data = await TagController.getTag(req, res);
      })

      it('should delete a tag', function(done) {
        expect(deletedTag.deletedCount).to.equal(1);
        expect(data).to.equal(null);
        done()
      });
    });
  });

  describe('Friends', function(done) {

    const res = mockRequest();
    res.status = sinon.stub().returns(res);
    res.send = sinon.spy();

    describe('create', function(done) {
      var data = null;
      before( async() => {

        var reqOptions = { params: { id: userOne._id}, user: localUser, test: true };
        var req = mockRequest(reqOptions);
        success = await FriendController.createRequest(req, res);

        var reqOptions = { params: { id: localUser._id}, user: localUser, test: true };
        var req = mockRequest(reqOptions);
        fail = await FriendController.createRequest(req, res);

      })

      it('should not create a friend request if user and friend is are the same', function(done) {
        expect(fail.error).to.be.an('string');
        expect(fail.error).to.equal('Can not add youself as friend');
        done()
      });

      it('should create a friend request', function(done) {
        expect(success.confirmed).to.equal(false);
        expect(success.user).to.equal(localUser._id);
        expect(success.friend).to.equal(userOne._id);
        done()
      });
    });

    describe('find', function(done) {
      var data = null;
      before( async() => {
        var reqOptions = { params: { id: userOne._id}, user: userOne, test: true };
        var req = mockRequest(reqOptions);

        data = await FriendController.getRequest(req, res);
      })

      it('should find a request', function(done) {
        expect(data.own_requests).to.be.empty;
        expect(data.requests).to.have.lengthOf(2);
        done()
      });
    });

    describe('update', function(done) {
      before( async() => {
        var reqOptions = { params: { id: userTwo._id}, body: {type: 'accept'}, user: localUser, test: true };
        var req = mockRequest(reqOptions);

        accept = await FriendController.updateRequest(req, res);
      })

      it('should update and accept a request', function(done) {
        expect(accept.confirmed).to.equal(true);
        expect(accept.validated).to.equal(false);
        done()
      });

      before( async() => {
        var reqOptions = { params: { id: userTwo._id}, body: {type: 'validate'}, user: localUser, test: true };
        var req = mockRequest(reqOptions);

        validate = await FriendController.updateRequest(req, res);
      })

      it('should update and validate a request', function(done) {
        expect(validate.confirmed).to.equal(true);
        expect(validate.validated).to.equal(true);
        done()
      });
    });

    describe('delete', function(done) {
      before( async() => {
        var reqOptions = { params: { id: localUser._id}, body: {type: 'deny'}, user: userOne, test: true };
        var req = mockRequest(reqOptions);

        deny = await FriendController.deleteRequest(req, res);
      })

      it('should deny and delete a request', function(done) {
        expect(String(localUser._id)).to.equal(String(deny.user));
        done()
      });

      before( async() => {
        var reqOptions = { params: { id: userOne._id}, body: {type: 'cancel'}, user:localUser, test: true };
        var req = mockRequest(reqOptions);

        cancel = await FriendController.deleteRequest(req, res);
      })

      it('should deny and delete a request', function(done) {
        expect(String(localUser._id)).to.equal(String(cancel.user));
        done()
      });

    });
  });

  describe('Users', function(done) {

    const res = mockRequest();
    res.status = sinon.stub().returns(res);
    res.send = sinon.spy();

    describe('create', function(done) {
      var data = null;
      before( async() => {
        var reqOptions = { body: { email: 'newUser@test.nl', password:'test', name: 'createdUser'}, test: true };
        var req = mockRequest(reqOptions);

        data = await AuthController.signupUser(req, res);
      })

      it('should signup user', function(done) {
        expect(data.name).to.equal('createdUser');
        expect(data.sharelocation).to.equal(false);
        expect(data.isAdmin).to.equal(false);
        expect(data.isPrivate).to.equal(false);
        expect(data.email).to.equal('newUser@test.nl');
        done()
      });
    });

    describe('find', function(done) {
      var data = null;
      before( async() => {
        var reqOptions = { params: { id: userOne._id}, user: localUser, test: true };
        var req = mockRequest(reqOptions);

        userone = await UserController.getUser(req, res);
      })

      it('should find a user', function(done) {
        expect(userone.name).to.equal('userOne');
        done()
      });

      before( async() => {
        var reqOptions = { params: { id: 'profile'}, user: localUser, test: true };
        var req = mockRequest(reqOptions);

        usertwo = await UserController.getUser(req, res);
      })

      it('should find profile', function(done) {
        expect(usertwo.name).to.equal('local');
        done()
      });
    });

    describe('update', function(done) {
      before( async() => {
        var reqOptions = { params: { id: userOne._id}, body: {name: 'newName', isPrivate: true, aboutme: 'This is me.', tags: [tagOne._id]}, user: localUser, test: true };
        var req = mockRequest(reqOptions);

        data = await UserController.updateUser(req, res);
        updatedUser = await UserController.getUser(req, res)
      })

      it('should update a user', function(done) {
        expect(updatedUser.name).to.equal('newName');
        expect(updatedUser.isPrivate).to.equal(true);
        expect(updatedUser.aboutme).to.equal('This is me.');
        expect(updatedUser.tags).to.be.an('array');
        done()
      });
    });


    describe('delete', function(done) {
      before( async() => {
        var reqOptions = { params: { id: userOne._id}, user: localUser, test: true };
        var req = mockRequest(reqOptions);
        deletedUser = await UserController.deleteUser(req, res);
        data = await UserController.getUser(req, res);
      })

      it('should delete a user', function(done) {
        expect(deletedUser.deletedCount).to.equal(1);
        expect(data).to.equal(null);
        done()
      });
    });
  });

  after(function(done) {
    mongoose.connection.db.dropDatabase(function(){
      mongoose.connection.close(done);
    });
  });

});
