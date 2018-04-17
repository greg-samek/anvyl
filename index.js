const request = require('request');
const zlib = require('zlib');

const readLogs = require('./readLogs');

const date = process.argv[2];

main();

function main() {
    const url = `https://storage.googleapis.com/anvyl-interview-challenge/${date}-orders-access.log.gz`;
    request(url, {encoding: null}, function(err, response, body){
        if(response.headers['content-type'] == 'application/x-gzip'){
            zlib.gunzip(body, function(err, dezipped) {
                readLogs.readLogs(dezipped);
            });
        } else {
            console.log("There was an error downloading these logs.")
        }
    });
}