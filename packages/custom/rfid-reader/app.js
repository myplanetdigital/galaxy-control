'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var RfidReader = new Module('rfid-reader');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
RfidReader.register(function(app, auth, database) {

  //We enable routing. By default the Package Object is passed to the routes
  RfidReader.routes(app, auth, database);

  //We are adding a link to the main menu for all authenticated users
  RfidReader.menus.add({
      title: 'rfidReader example page',
      link: 'rfidReader example page',
      roles: ['authenticated'],
      menu: 'main'
  });
  
  RfidReader.aggregateAsset('css', 'cardRegister.css');

  /**
    //Uncomment to use. Requires meanio@0.3.7 or above
    // Save settings with callback
    // Use this for saving data from administration pages
    RfidReader.settings({
        'someSetting': 'some value'
    }, function(err, settings) {
        //you now have the settings object
    });

    // Another save settings example this time with no callback
    // This writes over the last settings.
    RfidReader.settings({
        'anotherSettings': 'some value'
    });

    // Get settings. Retrieves latest saved settigns
    RfidReader.settings(function(err, settings) {
        //you now have the settings object
    });
    */

  return RfidReader;
});
