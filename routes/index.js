const express = require('express');
const passport = require('passport');
const router = express.Router();

router.use('/', require('./swagger'));
router.use('/periods', require('./periods'));
//router.use('/users', require('./users'));
router.use('/categories', require('./categories'));
router.use('/transactions', require('./transaction'));

router.get("/login", passport.authenticate("github"), (req, res) => { });
router.get("/logout", function (req, res, next) {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect("/");
    });
});

module.exports = router;