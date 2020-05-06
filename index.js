var config = require('./config.json');
var mMessenger = require('./modules/messenger');
var mPoweredUp = require('./modules/powered-up');



var express = require("express");
var app = express();
var mExpressWs = require('express-ws')(app);

app.set('mPoweredUp', mPoweredUp);
app.set('mMessenger', mMessenger);
app.set('mExpressWs', mExpressWs);

app.ws('/', mMessenger.message);

mExpressWs.getWss().on('connection', mMessenger.connection);

mPoweredUp.scan();
mPoweredUp.enableDiscovery();

app.listen(config.server.port, () => {
    console.log("Server running on port " + config.server.port);
});

app.use(function (req, res) {
    res.status(404).send({ url: req.originalUrl + ' not found' })
});

module.exports = app;

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