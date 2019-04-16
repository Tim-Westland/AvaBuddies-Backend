const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const authHelper = require('../helpers/authHelper');
const UserModel = require('../models/user');

const router = express.Router();



router.post('/signup', function (req, res) {
    var shareLocation = false;
    if (req.body.sharelocation) {
        shareLocation = req.body.sharelocation;
    }

    var user = new UserModel({
        email: req.body.email,
        name: req.body.name,
        password: req.body.password,
        sharelocation: shareLocation
    });
    user.save(function (err) {
        if (err) return res.status(500).json({message: "an error occured " + err});
        res.json({
            message: 'Signup successful',
            user: user
        });
    });

});

router.post('/login', async (req, res, next) => {
    passport.authenticate('login', async (err, user, info) => {
        try {
            if (err || !user) {
                return res.status(401).json({message: "Wrong email or password"});
            }
            req.login(user, {session: false}, async (error) => {
                if (error) return next(error);
                //We don't want to store the sensitive information such as the
                //user password in the token so we pick only the email and id
                const body = {_id: user._id, email: user.email, isAdmin: user.isAdmin};
                //Sign the JWT token and populate the payload with the user email and id
                const token = jwt.sign({user: body, expiresIn: '5'}, keys.jwt.secret_key, {expiresIn: '24h'});
                //Send back the token to the user
                return res.json({token});
            });
        } catch (error) {
            return res.status(401).json({message: "Wrong email or password"});
        }
    })(req, res, next);
});


module.exports = router;
