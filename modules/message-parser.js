exports.message = function (ws, req) {
    ws.on("message", function (msg) {
        try {
            var mPoweredUp = req.app.get("mPoweredUp");
            var messageParts = msg.split(" ");
            switch (messageParts[0]) {
                case "PING":
                    ws.send("PONG");
                    break;
                case "TRAINS":
                    ws.send(listTrains(mPoweredUp));
                    break;
                case "TRAIN":
                    messageParts.shift();
                    ws.send(parseTrainCommand(mPoweredUp, messageParts));
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

function parseTrainCommand(mPoweredUp, messageParts) {
    switch (messageParts[0]) {
        case "STOP":
            return stopTrain(mPoweredUp, messageParts[1], messageParts[2]);
        case "POWER":
            return setTrainPower(mPoweredUp, messageParts[1], messageParts[2], messageParts[3], messageParts[4], messageParts[5]);
        default:
            throw new Error("invalid command");
    }
}

function listTrains(mPoweredUp) {
    var devices = mPoweredUp.getTrains();
    var trains = [];
    for (var deviceId in devices) {
        trains.push([devices[deviceId].hub.uuid, devices[deviceId].portName]);
    }
    if (trains.length > 0) {
        return "TRAINS "+ JSON.stringify(trains);
    }
    else {
        return "TRAINS 0";
    }
}

function stopTrain(mPoweredUp, hubId, portName) {
    mPoweredUp.stop(hubId, portName);
    return "TRAIN STOP "+hubId+" "+portName+" OK";
}

function setTrainPower(mPoweredUp, hubId, portName, power, powerEnd, time) {
    if (powerEnd != undefined) {
        mPoweredUp.rampPower(hubId, portName, power, powerEnd, (time != undefined ? time : 5000));
    }
    else if (power == 0) {
        mPoweredUp.brake(hubId, portName);
    }
    else if (power != undefined) {
        mPoweredUp.setPower(hubId, portName, power);
    }
    return "TRAIN POWER "+hubId+" "+portName+" OK";
}