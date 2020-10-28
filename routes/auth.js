// top level routes are to be here 

const express = require('express');
const passport = require('passport');
const router = express.Router();

//@desc  autheticate with google  
//@route GET  /auth/google

router.get('/google',
passport.authenticate('google',{ scope: ['profile'] })
);

//@desc  route for the callback
//@route GET  /auth/google/callback

router.get('/google/callback',
passport.authenticate('google',{failureRedirect:'/'}),

(req,res) => {
    res.redirect('/dashboard');
}
)

module.exports = router;