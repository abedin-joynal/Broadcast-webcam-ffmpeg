'use strict';

const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http/*, {origins: allowedOrigins} */);
const port = 5000;

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', __dirname + "/public");

var devices;
var adb1 = require('child_process').spawn("adb", ["devices", "-l"]);
adb1.stdout.on('data', function(data) {
    devices = getAdbDevicesJSON(data);
});

app.get('/', (req, res) => {
    res.render('index', {devices: devices});
});

var ffmpeg = require('child_process').spawn("ffmpeg", [
	"-i", "/dev/video0", 
	"-vb", "5M",
	"-preset", "ultrafast", 
	'-acodec', 'copy',
	"-f", "mjpeg", 
	"pipe:1"]);

ffmpeg.on('error', function (err) {
	throw err;
});

ffmpeg.on('close', function (code) {
	console.log('ffmpeg exited with code ' + code);
});

ffmpeg.stderr.on('data', function (data) {
	// console.log('stderr: ' + data);
});

io.on('connection', (socket) => {
    console.log('A user connected');

    ffmpeg.stdout.on('data', function (data) {
        var frame = new Buffer(data).toString('base64');
        io.sockets.emit('canvas',frame);
    });
    
    socket.on('message', (msg) => {
        switch (msg) {
            case 'client_event' :
                console.log("Client Events: " + msg);
                disconnect_client();
                break;
        }
    });

    socket.on('client_event', (data) => {
        console.log("Received event from client Key: " + data.key);
        console.log("Received event from client device: " + data.device);
        var adb = require('child_process').spawn("adb", ["-s", data.device,"shell", "input", "keyevent", data.key]);

        adb.stdout.on('data', function(data) {
            console.log("ADB: " + data);
        });
    });

    socket.on('disconnect', () => {
        console.log("Disconnected from server");
    });

    socket.on('forceDisconnect', function() {
        socket.disconnect();
    });
}); 

function getAdbDevicesJSON(data) {
    let lines = data.toString().split('\n');
    let devices = [];
    for(let i=1; i<lines.length; i++) {
        let line = lines[i].trim();
        line = line.trim().split(" ");
        line = line.filter(Boolean);
        if(line.length) {
            if(line[1] == "device") {
                let device = {serial: line[0], status: line[1]};
                if(line[2])
                    device.product = line[2].split(":")[1];
                if(line[3])
                    device.model = line[3].split(":")[1];
                if(line[4])
                    device.device = line[4].split(":")[1];
                
                devices.push(device);
            }
        }
    }
    return devices;
}

http.listen(port, () => {
    console.log('listening on localhost:' + port);
});