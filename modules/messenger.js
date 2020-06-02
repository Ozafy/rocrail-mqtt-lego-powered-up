exports.message = function (topic, message) {
    xml = message.toString();
    var parseString = require('xml2js').parseString;
    parseString(xml, function (err, result) {
        if (result.lc) {
            module.exports.parseLoc(result.lc.$);
        }
    });
}

exports.parseLoc = function (loc) {
    console.dir(loc);
    var idParts = loc.id.split(":");
    var mPoweredUp = require('./powered-up');
    var power = (loc.dir =='true' ? loc.V : loc.V * -1);
    mPoweredUp.setPower(idParts[0], idParts[1], power);
}