//express
const express = require("express");
var bodyParser = require('body-parser')
const app = express()
const port = 3000;

require('dotenv').config();


const { Client } = require('@elastic/elasticsearch')
const client = new Client({
    node: 'https://localhost:9200', // Elasticsearch endpoint
    auth: {
        username: process.env.ELASTIC_USERNAME,
        password: process.env.ELASTIC_PASSWORD
    },
    caFingerprint: process.env.FINGERPRINT, 
    //'CA:AD:57:66:F4:7F:C3:E7:3F:23:04:10:0C:7E:90:D8:1C:31:BE:37:7B:89:02:94:31:C3:5C:E1:EA:5F:B1:11',
    tls: {
        rejectUnauthorized: false
    }
});



//helloworld GET
app.get('/', function (req, res) {
    res.send('Hello World');
});

var server = app.listen(port, () => {
    var host = server.address().address;
    console.log("Example app listening at http://%s:%s", host, port);
});

//use json encoded bodies
app.use(express.json())

app.post("/api/runs", function (req, res) {
    client.cat.indices({
        format: 'json'
    }).then((r) => {

        t = [];
        for (i in r) {
            if (r[i]["index"].includes("run")) {
                t.push(r[i]["index"]);
            }
        }
        res.json(t);
    })
});

app.post("/api/body/test", function (req, res) {
    res.json(req.body);
});

/*search for all apps by app_id
 {
    app_id: <id of app>, #required
    start: <from>, #optoinal, default 0
    size: <size>, #optional, default 20 (max 100)
 }

*/
app.post("/api/search/app_id", function (req, res) {
    var app_id = req.body.app_id;

    if (app_id == undefined) {
        res.json({ "Error": "app_id required" })
        return;
    }

    from = req.body.from == undefined || isNaN(parseInt(req.body.from)) ? 0 : parseInt(req.body.from);
    size = req.body.start == undefined || isNaN(parseInt(req.body.size)) ? 20 : parseInt(req.body.size);


    client.search({
        "from": from,
        "size": size,
        "query": {        
            "match": {
                "app_id": app_id
            },
        }
    }).then((r) => {
        var hits = []
        for (i in r.hits.hits) {
            r_id = r.hits.hits[i]._index;
            a_id = r.hits.hits[i]._source.app_id;
            hits.push({
                "app_id": a_id,
                "run_id": r_id
            })
        }
        res.json({
            "from": from,
            "size": size,
            "hits": hits
        });
    });
    return;

});

app.post("/api/get", function (req, res) {

    var app_id = req.body.app_id;

    if (app_id == undefined) {
        res.json({ "Error": "app_id required" })
        return;
    }
    
    var run_id = req.body.run_id;

    if (run_id == undefined) {
        res.json({ "Error": "run_id required" })
        return;
    }
    
    client.get({
        "id":app_id, 
        "index":run_id,
        "_source":true
    }).then((r) => {
        console.log(r);
        res.json(r._source);
    });

    return;
});



//Methods that were just added

//Search method that takes in a given string and performs matching on similar applications 
//Prefix and Suffix
app.post("/api/search/app_name", function (req, res){
    var app_name = req.body.app_name

    if (app_name == undefined){
        res.json({ "Error": "app_id required" })
        return;
    }

    client.search({
        "index": "duplicateapp_run1",
        "query": {
            "wildcard": {
                "app_name": {
                    "value": "*" + app_name + "*",
                    "case_insensitive": true
                }
            }
        }
    }).then((r) =>{
        console.log(r.hits.hits)
        var hits = []
        for (i in r.hits.hits){
            app_id = r.hits.hits[i]._source.app_id;
            app_name = r.hits.hits[i]._source.app_name;
            hits.push({
                "app_id": app_id,
                "app_name": app_name
            })
        }
        res.json(hits);
    })

    return;
})