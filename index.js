const axios = require('axios').default;
const express = require('express');
const morgan = require("morgan");

const dns = require('dns');
const fs =require("fs")
class proxy{
    constructor(req){
        this.req=req
    }
    render(res){
        console.log(`${this.req.protocol}//${this.req.hostname}${this.req.originalUrl}`)
  
  
    }
}


  
  // Create Express Server
  const app = express();
  
  // Configuration
  const PORT = 3000;
  const HOST ="0.0.0.0";
  
  // Logging
  app.use(morgan('dev'));
  
  // Info GET endpoint
  app.get('/info', (req, res, next) => {
      res.send('This is a proxy service which proxies to Billing and Account APIs.');
res.end()
  });
  
  
  const db=require("./db")
  
  
  // Full endpoint
  app.use('*', async (req, res) => { 
    let domain = req.hostname
    //Check if domain is in DB
    let found = ""
    if(!found){
        let d = {
            "domain": domain,
            
            "key": await getDomainKey(domain)
        }
        d.enable = d.key.length > 0 ? true : false
        console.log(d)
        found=d
        db.push("/"+domain,d,false)
        console.log("Added new domain: " + domain + " setting: " + d.enable)
        //found = db.find(x => x.domain === domain)
    }
    if (req.method=="GET") {
        axios.get(`${req.originalUrl}`)
        .then(function (response) {
          // handle success
          res.send(response);
	res.end()
        })
        .catch(function (error) {
          // handle error
          res.send(error);
res.end()
        })   
    } else {
        axios.post(`${req.originalUrl}`)
        .then(function (response) {
          // handle success
          res.send(response);
       res.end() })
        .catch(function (error) {
          // handle error
          res.send(error);
       res.end() })
    }  
     
     
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
