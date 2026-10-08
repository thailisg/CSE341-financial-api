const express = require('express');
const router = express.Router();

router.use('/', require('./swagger'));
router.use('/periods', require('./periods'));
//router.use('/users', require('./users'));
router.use('/categories', require('./categories'));
router.use('/transactions', require('./transaction'));

module.exports = router;