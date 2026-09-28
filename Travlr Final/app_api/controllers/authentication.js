const mongoose = require('mongoose');
const User = require('../models/user');
const passport = require('passport');

const register = async (req, res) => {
    if (!req.body.name || !req.body.email || !req.body.password) {
        return res
            .status(400)
            .json({ "message": "All fields required" });
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
        if (!passwordRegex.test(req.body.password)) {
         return res
        .status(400)
        .json({ "message": "Password must be at least 8 characters and include both letters and numbers" });
}

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: ''
    });

    user.setPassword(req.body.password);

    try {
        await user.save();
        const token = user.generateJWT();
        return res
            .status(200)
            .json({ token });
    } catch (err) {
        if (err.code === 11000) {
            return res
                .status(409)
                .json({ "message": "Email already registered" });
        }
        console.log('Register error: ' + err);
        return res
            .status(500)
            .json({ "message": "Something went wrong creating the account" });
    }
};

const login = (req, res) => {
    // Validate message to ensure that email and password are present.
    if (!req.body.email || !req.body.password) {
        return res
            .status(400)
            .json({"message": "All fields required"});
    }

    // Delegate authentication to passport module
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            // Error in Authentication Process
            return res
                .status(404)
                .json(err);
        }

        if (user) { // Auth succeeded - generate JWT and return to caller
            const token = user.generateJWT();
            res
                .status(200)
                .json({token});
        } else { // Auth failed return error
            res
                .status(401)
                .json(info);
        }
    })(req, res);
};

// Export methods that drive endpoints.
module.exports = {
    register,
    login
};