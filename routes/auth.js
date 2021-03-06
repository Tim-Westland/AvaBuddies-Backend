const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const result = dotenv.config();
const User = require('../models/user');
const Controller = require('../controllers/authController');

const router = express.Router();


router.route('/signup')
	.post(Controller.signupUser);


router.post('/login', async (req, res, next) => {
  req.body.password = process.env.BACKEND_PASSWORD;
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
                const token = jwt.sign({user: body, expiresIn: '5'}, process.env.SECRET, {expiresIn: '24h'});
                //Send back the token to the user
                return res.json({token});
            });
        } catch (error) {
            return res.status(401).json({message: "Wrong email or password"});
        }
    })(req, res, next);
});


module.exports = router;
