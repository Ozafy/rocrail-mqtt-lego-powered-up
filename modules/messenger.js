exports.message = function (topic, message) {
    xml = message.toString();
    var parseString = require('xml2js').parseString;
    parseString(xml, function (err, result) {
        if(result.lc) {
                module.exports.parseLoc(result.lc.$);
        }
    });
}

exports.parseLoc = function (loc) {
var idParts = loc.id.split(":");
    var mPoweredUp = require('./powered-up');
    mPoweredUp.setPower(idParts[0],idParts[1],loc.V);
}