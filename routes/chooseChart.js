var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    
    res.render("choosChart",{
                ChartName: "",
                jsonStr: "",
                axis: "",
                jsFile: "",
                cssFile: ""});

});

router.post('/', function(req, res, next) {
    var selectedGraph = req.body.graphType;
    var jsonstr = req.body.jsontext;

    var returndata;
    if(isJson(jsonstr)){
        var jsonObj = JSON.parse(jsonstr);
        returndata=findGraphDetails(selectedGraph, jsonObj);
        if(returndata!=null){
            res.render("chooseChart",{
                ChartName: selectedGraph,
                jsonStr: jsonstr,
                axis: JSON.stringify(returndata["axis"]),
                jsFile: returndata["jsFile"],
                cssFile: returndata["cssFile"]
            });
        }
        else{
            res.render("chooseChart",{
                ChartName: "",
                jsonStr: "",
                axis: "",
                jsFile: "",
                cssFile: ""
            });
        }
    }
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

function findGraphDetails(selectedGraph, jsonObj){
     var mainChartDictionary = {"Bar Graph (type 1)" : "/javascripts/BarType1.js",
                                "Pie Graph": "/javascripts/PieType.js"};
      var returndata={};
     if(selectedGraph =="Bar Graph (type 1)" || selectedGraph == "Pie Graph"){
        var dict = {"x":"",
                    "y":""};
        for(var o in jsonObj){
            var arraytemp = Object.keys(jsonObj[o]);
            dict['x']=arraytemp[0];
            dict['y']=arraytemp[1];
            break;
        }
        returndata['axis']=dict;
        returndata['jsFile']=mainChartDictionary[selectedGraph];

        var temp = mainChartDictionary[selectedGraph];
        var cssFile = "/stylesheets/" + temp.substring(13, temp.length-3) + ".css";

        returndata["cssFile"] = cssFile;
    }
     else{
         returndata['axis']=null;
         returndata['jsFile']=null;
         returndata['cssFile']=null;
     }
        return returndata;
}
