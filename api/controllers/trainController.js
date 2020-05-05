'use strict';

exports.listTrains = function(req, res) {
    var mPoweredUp = req.app.get('mPoweredUp');
    var devices = mPoweredUp.getTrains();
    //console.log(devices);
    var trains = [];
    for (var deviceId in devices) {
        trains.push({hubId: devices[deviceId].hub.uuid, portName: devices[deviceId].portName});
    }
    res.json(trains);
  };
  exports.motorStop = function(req, res) {
    var mPoweredUp = req.app.get('mPoweredUp');
    mPoweredUp.stop(req.params.hubId, req.params.portName);
    res.json();
};

  exports.motorPower = function(req, res) {
    var mPoweredUp = req.app.get('mPoweredUp');
    var power = req.body.power;
    if(req.body.powerEnd != undefined)
    {
        mPoweredUp.rampPower(req.params.hubId, req.params.portName, power, req.body.powerEnd, (req.body.time!=undefined?req.body.powerEnd:5000));
        power = req.body.powerEnd;
    }
    else if (power==0)
    {
        mPoweredUp.brake(req.params.hubId, req.params.portName);
    }
    else if(power!=undefined)
    {
        mPoweredUp.setPower(req.params.hubId, req.params.portName, power);
    }
    res.json();
};