'use strict';
module.exports = function(app) {
  var trains = require('../controllers/trainController');

  app.route('/hubs')
    .get(trains.listTrains);

  app.route('/hubs/:hubId/motor/:portName')
    .post(trains.motorPower);

    app.route('/hubs/:hubId/motor/:portName/stop')
    .get(trains.motorStop);
};