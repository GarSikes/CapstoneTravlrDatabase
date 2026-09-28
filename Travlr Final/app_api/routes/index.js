const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken'); // Enable JSON Web Tokens

const tripsController = require('../controllers/trips');
const authController = require('../controllers/authentication');

// Method to authenticate our JWT
//
// Original version of this function called next() unconditionally right
// after starting jwt.verify(), regardless of whether the token was actually
// valid.
function authenticateJWT(req, res, next) {
    const authHeader = req.headers['authorization'];

    if (authHeader == null) {
        console.log('Auth Header Required but NOT PRESENT!');
        return res.sendStatus(401);
    }

    const headers = authHeader.split(' ');

    // Original check here was `headers.length < 1`, which can never be true:
    // splitting any non-empty string on a space always returns at least one
    // element.
    if (headers.length !== 2) {
        console.log('Malformed Authorization header: ' + authHeader);
        return res.sendStatus(401);
    }

    const token = headers[1];

    if (token == null || token === '') {
        console.log('Null or empty Bearer Token');
        return res.sendStatus(401);
    }

    try {
        req.auth = jwt.verify(token, process.env.JWT_SECRET); // Set the auth param to the decoded object
        next();
    } catch (err) {
        console.log('Token validation error: ' + err.message);
        return res.sendStatus(401);
    }
}

router.route('/register').post(authController.register);
router.route('/login').post(authController.login);

router
  .route('/trips')
  .get(tripsController.tripsList)
  .post(authenticateJWT, tripsController.tripsAddTrip);

router
  .route('/trips/:tripCode')
  .get(tripsController.tripsFindByCode)
  .put(authenticateJWT, tripsController.tripsUpdateTrip)
  // Enhancement: the original CS 465 guide only protected create and update,
  // leaving delete open to anyone with no token at all. Deleting a trip is
  // exactly the kind of action that should require authentication, so this
  // enhancement extends the same JWT check to cover it too.
  .delete(authenticateJWT, tripsController.tripsDeleteTrip);

module.exports = router;
