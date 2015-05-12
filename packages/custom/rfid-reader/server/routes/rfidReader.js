'use strict';

var reader = require('../controllers/rfidReader'),
    mean = require('meanio'),
    config = mean.loadConfig(),
    endpoints = config.endpoints;

/* jshint -W098 */
// The Package is past automatically as first parameter
module.exports = function(RfidReader, app, auth, database) {




  // RFID reader routes
  for (var key in endpoints) {
    if (endpoints.hasOwnProperty(key)) {
      var endpoint = endpoints[key];
      app.route(endpoint.url.toString())
          .get(reader.entry);
    }
  }
  app.route('/library/resource')
      .post(reader.saveResource);
  app.route('/library/person')
      .post(reader.savePerson);

  // RFID TEST data CRUD operations
  app.route('/populate/people')
      .post(reader.populatePeople);
  app.route('/populate/resources')
      .post(reader.populateResources);
};
