var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('validateJson', { status: "" });
});

router.post('/', function (req, res, next) {
    var str = req.body.JsonText;
    var stat="";
    if(isJson(str))
        stat="Valid Json";
    else
        stat="Not Valid Json";
    res.render('validateJson', { status: stat });
});
function isJson(str) {
    try {
        JSON.parse(str);

    } catch (e) {
        return false;
    }
    return true;
}
module.exports = router;