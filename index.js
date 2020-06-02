var config = require('./config.json');
var mMessenger = require('./modules/messenger');
var mPoweredUp = require('./modules/powered-up');

var mqtt = require('mqtt');
var client  = mqtt.connect('mqtt://'+config.server.host+':'+config.server.port);

client.on('connect', function () {
    client.subscribe('rocrail/service/command')
    console.log('client subscribed to rocrail commands')
})

mPoweredUp.scan();
mPoweredUp.enableDiscovery();

client.on('message', mMessenger.message)

function exitHandler(options, exitCode) {
    mPoweredUp.stopscan();
    mPoweredUp.disconnectHubs();
    if (options.cleanup) console.log('clean');
    if (exitCode || exitCode === 0) console.log(exitCode);
    if (options.exit) process.exit();
}

//do something when app is closing
process.on('exit', exitHandler.bind(null, { cleanup: true }));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, { exit: true }));

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, { exit: true }));
process.on('SIGUSR2', exitHandler.bind(null, { exit: true }));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, { exit: true }));