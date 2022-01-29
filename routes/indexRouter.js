var express = require('express');
const { isAuth } = require('../helpers/functions');
var router = express.Router()

router.get('/', isAuth, (req, res) => {
    res.render('index')
});



module.exports = router;