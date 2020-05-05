const PoweredUP = require("node-poweredup");
const poweredUP = new PoweredUP.PoweredUP();

const HubColors = [PoweredUP.Consts.Color.PURPLE, PoweredUP.Consts.Color.RED, PoweredUP.Consts.Color.GREEN, PoweredUP.Consts.Color.BLUE, PoweredUP.Consts.Color.YELLOW];
var CurrentHubColor = 0;

poweredUP.on("discover", async (hub) => {
    console.log("Found hub " + hub.name);
    await hub.connect();
    hub.on("attach", (device) => {
        if (device.type == PoweredUP.Consts.DeviceType.HUB_LED) {
            device.setColor(HubColors[CurrentHubColor++]);
            if (CurrentHubColor >= HubColors.length) {
                CurrentHubColor = 0;
            }
        }
    });
});

exports.disconnectHubs = function () {
    console.log("Disconnecting all hubs...");
    var hubs = poweredUP.getHubs();
    for (var hubId in hubs) {
        hubs[hubId].disconnect();
    }
}

exports.scan = function () {
    console.log("Scanning for powered up devices...");
    poweredUP.scan();
}

exports.stopscan = function () {
    console.log("Stopped scanning for powered up devices...");
    poweredUP.stop();
}

exports.getTrains = function () {
    var trains = [];
    var hubs = poweredUP.getHubs();
    for (var hubId in hubs) {
        var hub = hubs[hubId];
        var devices = hub.getDevicesByType(PoweredUP.Consts.DeviceType.TRAIN_MOTOR);
        for (var deviceId in devices) {
            trains.push(devices[deviceId]);
        }
    }
    return trains;
}

exports.brake = function (hubId, portName) {
    console.log("Braking motor ("+hubId+":"+portName+")");
    var hub = poweredUP.getHubByUUID(hubId);
    var motor = hub.getDeviceAtPort(portName);
    //write own brake code
    motor.brake();
}

exports.stop = function (hubId, portName) {
    console.log("Stopping motor ("+hubId+":"+portName+")");
    var hub = poweredUP.getHubByUUID(hubId);
    var motor = hub.getDeviceAtPort(portName);
    motor.stop();
}

exports.setPower = function (hubId, portName, power) {
    console.log("Setting motor ("+hubId+":"+portName+") power to "+power);
    var hub = poweredUP.getHubByUUID(hubId);
    var motor = hub.getDeviceAtPort(portName);
    motor.setPower(power);
}

exports.rampPower = function (hubId, portName, fromPower, toPower, time) {
    console.log("Ramping motor ("+hubId+":"+portName+") power from "+fromPower+" to "+toPower+" over "+time+"ms");
    var hub = poweredUP.getHubByUUID(hubId);
    var motor = hub.getDeviceAtPort(portName);
    //write own ramp code
    motor.rampPower(fromPower, toPower, time);
}