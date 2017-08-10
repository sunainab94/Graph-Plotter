var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('about', {firstname: "", lastname: ""});
});

router.post('/', function (req, res, next) {
    console.log(req.body);

    var fn = req.body.firstname;
    var ln = req.body.lastname;
    res.render('about', {firstname: fn, lastname: ln});

});

module.exports = router;
