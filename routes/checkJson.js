var express = require('express');
var router = express.Router();

/*var mysql = require('mysql')
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'plotify'
});*/

/* GET chooseGraph page. */
router.get('/', function(req, res, next) {
    res.render('checkJson', { status: "" ,jsonString: "" });
});

router.post('/', function (req, res, next) {
    var str = req.body.datatextarea;
    var stat="";
    if(isJson(str)){
        stat="Valid Json";
        var jsonObj = JSON.parse(str);
        var depthObj = depthCheck(jsonObj);
        if(depthObj==1){
            var propcount = propertyCount(jsonObj);
            if(propcount!=-1){
                var typeObj = typeCount(jsonObj);
                if(typeObj != -1){
                    console.log("Type and property count are consistent");
                    stat = "Type and property count are consistent";
                    //res.render('checkJson', { status: stat,jsonString: str });
                }
                else{
                    console.log("Type Count not consistent");
                    stat = "Type Count not consistent";
                }
            }
            else{
                stat="Property Count not consistent";
            }
        }
        else{
            stat="Depth not 1, no graph to display!";
        }
    }
        
    else
        stat="Not Valid Json";
    
    res.render('checkJson', { status: stat, jsonString: str });
});

module.exports = router;

function isJson(str) {
    try {
        JSON.parse(str);

    } catch (e) {
        return false;
    }
    return true;
}
module.exports = router;

function depthCheck(obj){
    var depth = 0;
    if (obj.children) {
        obj.children.forEach(function (d) {
            var tmpDepth = Depth(d)
            if (tmpDepth > depth) {
                depth = tmpDepth
            }
        })
    }
    return 1 + depth;
}

function propertyCount(obj){
    var count = 0;
    var flag = true;
    var countConsistency = true;
    obj.forEach(function(eachObj){
        var tempPropCount = Object.keys(eachObj).length;
        if(flag){ //Only 1st time assign property count to count 
            count = tempPropCount;
            flag = false;
        }
        else if(count!=tempPropCount){
            countConsistency = false;
        }       
    });
    if(countConsistency)
        return count;
    else 
        return -1;
}

function typeCount(obj){
    var countDictonary = {stringCount:0, numberCount:0}
    var flag = true;
    var typeConsistency = true;
    obj.forEach(function(eachObj){
        var strCount = 0;
        var numCount =0;
        for(i in eachObj){
            if(typeof(eachObj[i])=="string")
                strCount+=1;
            else if(typeof(eachObj[i])=="number")
                numCount+=1;
        }
        if(flag){
            countDictonary["stringCount"] = strCount;
            countDictonary["numberCount"] = numCount;
            flag = false;
        }
        else{
            if(countDictonary["stringCount"]!=strCount || countDictonary["numberCount"]!=numCount)
                typeConsistency = false;
        }
    });
    if(typeConsistency)
        return countDictonary;
    else 
        return -1;
}