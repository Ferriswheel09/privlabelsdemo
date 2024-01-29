require('dotenv').config();
const { Client } = require('@elastic/elasticsearch')
const fs = require('node:fs');

console.log(process.env.ELASTIC_USERNAME)
console.log(process.env.ELASTIC_PASSWORD)

const client = new Client({
    node: 'https://localhost:9200', // Elasticsearch endpoint
    auth: {
        username: process.env.ELASTIC_USERNAME,
        password: process.env.ELASTIC_PASSWORD
    },
    caFingerprint: 'CA:AD:57:66:F4:7F:C3:E7:3F:23:04:10:0C:7E:90:D8:1C:31:BE:37:7B:89:02:94:31:C3:5C:E1:EA:5F:B1:11',
    tls: {    
        rejectUnauthorized: false
    }
});


client.cat.indices({
    format: 'json'
}).then((r) => {
    for (i in r){
        if (r[i]["index"].includes("run")){
            console.log(r[i]["index"])
        }
    }
    
    
    
})