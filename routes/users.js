var express = require('express');
var router = express.Router();

/* GET users sign in */
router.get('/sign-in', function(req, res) {
    res.render('users/sign-in');
});

/* GET users sign out */
router.get('/sign-out', function(req, res) {
    res.clearCookie('gs_trello_token');
    res.redirect('/');
});

module.exports = router;
