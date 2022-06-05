const express = require('express');
const morgan = require("morgan");
const { createProxyMiddleware } = require('http-proxy-middleware');
const dns = require('dns');

// Create Express Server
const app = express();

// Configuration
const PORT = 3000;
const HOST = "localhost";

// Logging
app.use(morgan('dev'));

// Info GET endpoint
app.get('/info', (req, res, next) => {
    res.send('This is a proxy service which proxies to Billing and Account APIs.');
});

let db = []

// Full endpoint
app.use('*', async (req, res) => {    
    let domain = req.hostname
    //Check if domain is in DB
    let found = db.find(x => x.domain === domain)
    if(!found){
        let d = {
            "domain": domain,
            "mod": createProxyMiddleware(({target: "https://" + domain,changeOrigin: false})),
            "key": await getDomainKey(domain)
        }
        d.enable = d.key.length > 0 ? true : false
        db.push(d)
        console.log("Added new domain: " + domain + " setting: " + d.enable)
        found = db.find(x => x.domain === domain)
    }
    found.mod(req, res)
});

async function getDomainKey(domain){
    return await new Promise((resolve, reject) => {
       dns.lookup(domain,(err, address, family) => {
        console.log('address: %j family: IPv%s', address, family);
        resolve(address)
      })})
}

// Start the Proxy
app.listen(PORT, HOST, () => {
    console.log(`Starting Proxy at ${HOST}:${PORT}`);
});