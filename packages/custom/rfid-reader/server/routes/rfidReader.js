'use strict';

var reader = require('../controllers/rfidReader');
/* jshint -W098 */
// The Package is past automatically as first parameter
module.exports = function(RfidReader, app, auth, database) {

  // RFID reader library endpoint route
  app.route('/library')
      .get(reader.entry)
      .post()
      .put()
      .delete();

  // RFID TEST data CRUD operations
  app.route('/populate/people')
      .post(reader.populatePeople);
  app.route('/populate/resources')
      .post(reader.populateResources);
};
