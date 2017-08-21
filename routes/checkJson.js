var express = require('express');
var router = express.Router();
var mysql = require('mysql2');

/* GET chooseGraph page. */
router.get('/', function(req, res, next) {
    res.render('checkJson', { status: "", 
                              jsonString: "",
                              availabilityStatus: false,
                              graph: "" });
});

router.post('/', async function (req, res, next) {
    var str = req.body.datatextarea;
    var stat="";
    var availability = false;
    var graphNames = "";

    if(isJson(str)){
        stat="Valid Json";
        availability = true;

        var jsonObj = JSON.parse(str);
        var depthObj = depthCheck(jsonObj);
        if(depthObj==1){
            var propcount = propertyCount(jsonObj);
            if(propcount!=-1){
                var typeObj = typeCount(jsonObj);
                if(typeObj != -1){
                stat = "Type and property count are consistent";
                availability = true;
                try{
                let [ queryRows, queryFields ] = await req.db.query('SELECT * FROM graphtemplates WHERE Depth = ? AND PropertyCount = ?',[depthObj, propcount]);

                var compatibleGraphs = [];
                for(var i=0; i<queryRows.length; i++){

                var rowType = queryRows[i].TypeCount; //col in db

                if(graph_compatible(JSON.parse(rowType), typeObj)){
                //console.log(rows[i].Graph_Name);
                compatibleGraphs.push(queryRows[i].Graph_Name);
                }            
                }
                if(compatibleGraphs.length == 0){

                stat = "No Compatible graphs; we'll expand our horizon soon";
                availability = false;
                }else{

                stat = "Found Compatible Graphs";
                availability = true;

                for(var g in compatibleGraphs){
                graphNames += compatibleGraphs[g] + "$";    //Storing all graphs in one string seperated by $, so later I can split and get back array.
                }

                graphNames = graphNames.slice(0,-1);          //Remove the last character ($)
                }
                }
                catch(e){
                    stat = "Couldn't connect or query from DB. Try again later";
                    availability = false;
                }
                }
                else{                    
                    stat = "Type Count not consistent";
                    availability = false;
                }
            }
            else{
                stat="Property Count not consistent";
                availability = false;
            }
        }
        else{
            stat="Depth not 1, no graph to display!";
            availability = false;
        }
    }
        
    else{
        stat="Not Valid Json";
        availability = false;
    }
    
    res.render('checkJson', { status: stat, 
                              jsonString: str,
                              availabilityStatus: availability,
                              graph: graphNames });
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
    var countDictonary = {"string":0, "number":0}
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
            countDictonary["string"] = strCount;
            countDictonary["number"] = numCount;
            flag = false;
        }
        else{
            if(countDictonary["string"]!=strCount || countDictonary["number"]!=numCount)
                typeConsistency = false;
        }
    });
    if(typeConsistency)
        return countDictonary;
    else 
        return -1;
}

function graph_compatible(rowType, userType){
    if(Object.keys(rowType).length!=Object.keys(userType).length){
        return false;
    }
    try{
      for(var type in rowType){

        if(rowType[type] != userType[type])
          return false;
      
      }
    }catch(e){
      return false;
    }
    return true;
}