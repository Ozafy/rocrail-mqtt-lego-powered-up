exports.message = function (topic, message) {
    xml = message.toString();
    var parseString = require('xml2js').parseString;
    parseString(xml, function (err, result) {
        if (result.lc) {
            module.exports.parseLoc(result.lc.$);
        } else {
            console.dir(result);
        }
    });
}

exports.parseLoc = function (loc) {
    console.dir(loc);
    var mPoweredUp = require('./powered-up');
    var power = (loc.dir =='true' ? loc.V : loc.V * -1);
    var motorAddress = parseInt(loc.addr, 10);
    if(motorAddress == 1) {
        mPoweredUp.setPower(loc.oid, "A", power);
    }
    if(motorAddress == 2) {
        mPoweredUp.setPower(loc.oid, "B", power);
    }
    if(motorAddress == 3) {
        mPoweredUp.setPower(loc.oid, "A", power);
        mPoweredUp.setPower(loc.oid, "B", power*-1);
    }
}