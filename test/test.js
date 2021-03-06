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
const ChatController = require('../controllers/chatController');
const ChallengeController = require('../controllers/challengeController');

const User = require('../models/user');
const Friend = require('../models/friend');
const Tag = require('../models/tag');
const Chat = require('../models/chat');
const Challenge = require('../models/challenge');
var app = express();

async function get(res, req) {
  return await TagController.getTag(res, req);
  done();
}

describe('Tests', function(done) {
  before(function(done) {
    this.timeout(10000); //increase the timeout when testing with a slow internet connection

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

    tagOne = new Tag({
      name: 'tagOne'
    });
    tagOne.save(function() {});

    tagTwo = new Tag({
      name: 'tagTwo'
    });
    tagTwo.save(function() {});

    tagThree = new Tag({
      name: 'tagThree',
      isPrivate: false
    });
    tagThree.save(function() {});

    challengeOne = new Challenge({
      title: 'challengeOne',
      description: 'challengeOne'
    });
    challengeOne.save(function() {});

    challengeTwo = new Challenge({
      title: 'challengeTwo',
      description: 'challengeTwo'
    });
    challengeTwo.save(function() {});

    challengeThree = new Challenge({
      title: 'challengeThree',
      description: 'challengeThree'
    });
    challengeThree.save(function() {});

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
      password: 'test'
    });
    userOne.save(function() {});

    userTwo = new User({
      email: 'userTwo@test.nl',
      name: 'userTwo',
      password: 'test'
    });
    userTwo.save(function() {});

    userThree = new User({
      email: 'userThree@test.nl',
      name: 'userThree',
      password: 'test',
      tags: [mongoose.Types.ObjectId(tagThree._id)]
    });
    userThree.save(function() {});


    requestOne = new Friend({
      user: localUser._id,
      friend: userTwo._id
    });
    requestOne.save(function() {});

    requestTwo = new Friend({
      user: localUser._id,
      friend: userOne._id
    });
    requestTwo.save(function() {});

    requestThree = new Friend({
      user: userThree._id,
      friend: localUser._id,
      validated: true
    });
    requestThree.save(function() { done(null, null) });

    chatOne = new Chat({
      user1: localUser._id,
      user2: userOne._id
    });
    chatOne.save(function() {});

    chatTwo = new Chat({
      user1: localUser._id,
      user2: userTwo._id
    });
    chatOne.save(function() {});

    chatThree = new Chat({
      user1: localUser._id,
      user2: userThree._id
    });
    chatOne.save(function() {});
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
      });

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
      });

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
      });

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
      });

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

        var reqOptions = { body: { id: userOne._id}, user: localUser, test: true };
        var req = mockRequest(reqOptions);
        success = await FriendController.createRequest(req, res);

        var reqOptions = { body: { id: localUser._id}, user: localUser, test: true };
        var req = mockRequest(reqOptions);
        fail = await FriendController.createRequest(req, res);
      });

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
      });

      it('should find a request', function(done) {
        expect(data.own_requests).to.be.empty;
        expect(data.requests).to.have.lengthOf(2);
        done()
      });
    });

    describe('update', function(done) {
      before( async() => {
        var reqOptions = { params: { id: userThree._id}, body: {type: 'accept'}, user: localUser, test: true };
        var req = mockRequest(reqOptions);

        accept = await FriendController.updateRequest(req, res);
      });

      it('should update and accept a request', function(done) {
        expect(accept.confirmed).to.equal(true);
        expect(accept.validated).to.equal(true);
        done()
      });

      before( async() => {
        var reqOptions = { params: { id: userTwo._id}, body: {type: 'validate'}, user: localUser, test: true };
        var req = mockRequest(reqOptions);

        validate = await FriendController.updateRequest(req, res);
      });

      it('should update and validate a request', function(done) {
        expect(validate.confirmed).to.equal(false);
        expect(validate.validated).to.equal(true);
        done()
      });
    });

    describe('delete', function(done) {
      before( async() => {
        var reqOptions = { params: { id: localUser._id}, user: userOne, test: true };
        var req = mockRequest(reqOptions);

        deny = await FriendController.deleteRequest(req, res);
      });

      it('should deny and delete a request', function(done) {
        expect(String(localUser._id)).to.equal(String(deny.user));
        done()
      });

      before( async() => {
        var reqOptions = { params: { id: userThree._id}, user:localUser, test: true };
        var req = mockRequest(reqOptions);

        cancel = await FriendController.deleteRequest(req, res);
      });

      it('should deny and delete a request', function(done) {
        expect(String(localUser._id)).to.equal(String(cancel.friend));
        done()
      });

    });
  });

  describe('Chats', function(done) {

    const res = mockRequest();
    res.status = sinon.stub().returns(res);
    res.send = sinon.spy();

    describe('create', function(done) {
      var success = null;
      var fail = null;
      before( async() => {

        var reqOptions = { params: { id: userOne._id}, user: localUser, test: true };
        var req = mockRequest(reqOptions);
        success = await ChatController.createRequest(req, res);

        var reqOptions = { params: { id: localUser._id}, user: localUser, test: true };
        var req = mockRequest(reqOptions);
        fail = await ChatController.createRequest(req, res);

      });

      it('should not create a chat if user1 and user2 is are the same', function(done) {
        expect(fail.error).to.be.an('string');
        expect(fail.error).to.equal('You can\'t add yourself as a chat.');
        done()
      });

      it('should create a chat', function(done) {
        expect(success.user1).to.equal(localUser._id);
        expect(success.user2).to.equal(userOne._id);
        done()
      });
    });

    describe('find', function(done) {
      var data = null;
      before( async() => {
        var reqOptions = { user: userOne, test: true };
        var req = mockRequest(reqOptions);

        data = await ChatController.getRequests(req, res);
      });

      it('should find a chat', function(done) {
        expect(data.chats).to.have.lengthOf(2);
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
      });

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
      });

      it('should find a user', function(done) {
        expect(userone.name).to.equal('userOne');
        done()
      });

      before( async() => {
        var reqOptions = { params: { id: 'profile'}, user: localUser, test: true };
        var req = mockRequest(reqOptions);

        usertwo = await UserController.getUser(req, res);
      });

      it('should find profile', function(done) {
        expect(usertwo.name).to.equal('local');
        done()
      });

      before( async() => {
        var reqOptions = { query: { tags: 'tagThree'}, user: localUser, test: true };
        var req = mockRequest(reqOptions);

        userByTags = await UserController.getUsers(req, res);
      });

      it('should find users by tags', function(done) {
        expect(userByTags.users).to.be.an('array');
        expect(userByTags.users[0].name).to.equal('userThree');
        done()
      });


    });

    describe('update', function(done) {
      before( async() => {
        var reqOptions = { params: { id: userOne._id}, body: {name: 'newName', isPrivate: true, aboutme: 'This is me.', tags: [tagOne._id]}, user: localUser, test: true };
        var req = mockRequest(reqOptions);

        data = await UserController.updateUser(req, res);
        updatedUser = await UserController.getUser(req, res)
      });

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
      });

      it('should delete a user', function(done) {
        expect(deletedUser.deletedCount).to.equal(1);
        expect(data).to.equal(null);
        done()
      });
    });
  });

  describe('Challenges', function(done) {

    const res = mockRequest();
    res.status = sinon.stub().returns(res);
    res.send = sinon.spy();

    describe('create', function(done) {
      var data = null;
      before( async() => {
        var reqOptions = { body: { title: 'createdChallenge', description: 'createdChallenge'}, test: true };
        var req = mockRequest(reqOptions);

        data = await ChallengeController.createChallenge(req, res);
      });

      it('should create a challenge', function(done) {
        expect(data.title).to.equal('createdChallenge');
        done()
      });
    });

    describe('find', function(done) {
      var data = null;
      before( async() => {
        var reqOptions = { params: { id: challengeOne._id}, test: true };
        var req = mockRequest(reqOptions);

        data = await ChallengeController.getChallenge(req, res);
      });

      it('should find a challenge', function(done) {
        expect(data.title).to.equal('challengeOne');
        done()
      });
    });

    describe('update', function(done) {
      before( async() => {
        var reqOptions = { params: { id: challengeOne._id}, body: {title: 'newName', description: 'description', task: 'aTask'}, test: true };
        var req = mockRequest(reqOptions);
        data = await ChallengeController.updateChallenge(req, res);
      });

      it('should update a tag', function(done) {
        expect(data.title).to.equal('newName');
        expect(data.description).to.equal('description');
        expect(data.task).to.equal('aTask');
        done()
      });
    });

    describe('delete', function(done) {
      before( async() => {
        var reqOptions = { params: { id: challengeThree._id}, test: true };
        var req = mockRequest(reqOptions);
        deletedChallenge = await ChallengeController.deleteChallenge(req, res);
        data = await ChallengeController.getChallenge(req, res);
      });

      it('should delete a Challenge', function(done) {
        expect(deletedChallenge.title).to.equal('challengeThree');
        expect(deletedChallenge.description).to.equal('challengeThree');
        expect(data.error).to.equal('Something went wrong');
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
