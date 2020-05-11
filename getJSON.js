const https = require('https');

// Basic implementation of simple fetch()
function getJSON(url) {
  return new Promise((resolve, reject) => {
    let output = '';
    https.get(url, (res) => {
      res.setEncoding('utf8');

      res.on('data', (chunk) => {
        output += chunk;
      });

      res.on('end', () => {
        const obj = JSON.parse(output);
        if (res.statusCode !== 200) {
          reject(Error(`status: ${res.statusCode}`));
        } else {
          resolve(obj);
        }
      });
    }).on('error', (err) => {
      reject(Error(`error: ${err.message}`));
    });
  });
}

module.exports = getJSON;
