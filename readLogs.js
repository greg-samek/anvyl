const readline = require('readline');
const stream = require('stream');

const urlRegex = / \/(\S+) HTTP/;
const responseTimeRegex = /\d+$/;
const statusRegex = /HTTP\/\d.\d" (\d+)/;

const pathMap = new Map();
let maxTime = 0;
let averageTime = 0;

exports.readLogs = function(logs) {
    const bufferStream = new stream.PassThrough();

    const rl = readline.createInterface({
        input: bufferStream,
    });


    rl.on('line', function (line) {
        const url = urlRegex.exec(line)[1];
        const responseTime = responseTimeRegex.exec(line)[0];
        const status = statusRegex.exec(line)[1];
        if(url === 'ok') return;
        addResponse(url, status);
        addTime(responseTime)
    });

    bufferStream.end(logs, () => {
        console.log(`Max time: ${(maxTime / 1000000).toFixed(6)} secs`)
        console.log(`Average time: ${(averageTime / 1000000).toFixed(6)} secs`)
        pathMap.forEach((map, key) => {
            console.log(`Path: /${key}`);
            map.forEach((val, key) => {
                console.log(`  Code ${key}: ${val}`)
            });
        })
    });
}

function addResponse(url, status){
    if (pathMap.has(url)) {
        const mapAtPath = pathMap.get(url);
        if(mapAtPath.has(status)){
            const count = mapAtPath.get(status);
            mapAtPath.set(String(status), count + 1);
        } else {
            mapAtPath.set(String(status), 1);
        }
        pathMap.set(url, mapAtPath)
    } else {
        const code = new Map([
            [String(status), 1]
        ]);
        pathMap.set(url, code)
    }
}

function addTime(time) {
    let count = 0;
    let totalTime = 0;

    if(time > maxTime){
        maxTime = time;
    }

    count += 1;
    totalTime += time;

    averageTime = totalTime / count;

}