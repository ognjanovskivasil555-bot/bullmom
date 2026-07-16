// get-token.js
const https = require('https');

const consumerKey = 'UuCQhaQyWBD7aenRLZjKNdCYN';
const consumerSecret = 'dlUcDaDcFS35NutnLGCanlzb7Wtd8fXsHk82zJVxKo7tQZzPsj';

const credentials = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

const options = {
  hostname: 'api.x.com',
  path: '/oauth2/token',
  method: 'POST',
  headers: {
    'Authorization': `Basic ${credentials}`,
    'Content-Type': 'application/x-www-form-urlencoded'
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('New Bearer Token:');
    console.log(JSON.parse(data).access_token);
  });
});

req.write('grant_type=client_credentials');
req.end();
