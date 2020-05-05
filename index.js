var config = require('./config.json');

var mPoweredUp = require('./modules/powered-up');

mPoweredUp.scan();

var express = require("express");
var app = express();
var bodyParser = require('body-parser')
app.use( bodyParser.json() );
    app.set('mPoweredUp', mPoweredUp);

var routes = require('./api/routes/trainRoutes');
routes(app);

app.listen(config.server.port, () => {
 console.log("Server running on port "+config.server.port);
});

app.use(function(req, res) {
    res.status(404).send({url: req.originalUrl + ' not found'})
});


function exitHandler(options, exitCode) {
    mPoweredUp.disconnectHubs();
    mPoweredUp.stopscan();
    /*if (options.cleanup) console.log('clean');
    if (exitCode || exitCode === 0) console.log(exitCode);
    if (options.exit) process.exit();*/
}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, {exit:true}));
process.on('SIGUSR2', exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));