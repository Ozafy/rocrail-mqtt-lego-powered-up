exports.message = function (ws, req) {
    ws.on("message", function (msg) {
        try {
            var mMessenger = req.app.get("mMessenger");
            var messageParts = msg.split(" ");
            switch (messageParts[0]) {
                case "PING":
                    ws.send("PONG");
                    break;
                case "TRAIN":
                    messageParts.shift();
                    mMessenger.broadCastMessage(mMessenger.parseTrainCommand(mMessenger, messageParts));
                    break;
                default:
                    throw new Error("invalid command");
            }
        }
        catch (err) {
            ws.send(err.message);
        }
    });
}

exports.connection = function (ws, req, client) {
    var mMessenger = req.app.get("mMessenger");
    ws.send(mMessenger.listTrainHubs());
}

exports.parseTrainCommand = function (mMessenger, messageParts) {
    switch (messageParts[0]) {
        case "STOP":
            return mMessenger.stopTrain(messageParts[1], messageParts[2]);
        case "POWER":
            return mMessenger.setTrainPower(messageParts[1], messageParts[2], messageParts[3], messageParts[4], messageParts[5]);
        default:
            throw new Error("invalid command");
    }
}

exports.listTrainHubs = function () {
    app = require("../index.js");
    var mPoweredUp = app.get("mPoweredUp");
    var hubs = mPoweredUp.getTrainHubs();
    if (hubs.length > 0) {
        return "TRAINHUBS :" + JSON.stringify(hubs);
    }
    else {
        return "TRAINHUBS :[]";
    }
}

exports.broadCastMessage = function (message) {
    app = require("../index.js");
    var mExpressWs = app.get("mExpressWs");
    mExpressWs.getWss().clients.forEach(function each(client) {
        client.send(message);
    });
}

exports.stopTrain = function (hubId, portName) {
    app = require("../index.js");
    var mPoweredUp = app.get("mPoweredUp");
    mPoweredUp.stop(hubId, portName);
    return "TRAIN STOP " + hubId + " " + portName;
}

exports.setTrainPower = function (hubId, portName, power, powerEnd, time) {
    app = require("../index.js");
    var mPoweredUp = app.get("mPoweredUp");
    if (powerEnd != undefined) {
        mPoweredUp.rampPower(hubId, portName, power, powerEnd, (time != undefined ? time : 5000));
        return "TRAIN POWER " + hubId + " " + portName + " " + power + " " + powerEnd + " " + time;
    }
    else if (power == 0) {
        mPoweredUp.brake(hubId, portName);
        return "TRAIN BRAKE " + hubId + " " + portName;
    }
    else if (power != undefined) {
        mPoweredUp.setPower(hubId, portName, power);
        return "TRAIN POWER " + hubId + " " + portName + " " + power;
    }
}