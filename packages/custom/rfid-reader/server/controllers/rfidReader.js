'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Person = mongoose.model('Person'),
    Resource = mongoose.model('Resource'),
    Rfid = mongoose.model('Rfid');

/**
 * RFID reader first request handler
 */
exports.entry = function(req, res) {
  var reqId = req.param('rfid');
  console.log('RFID: ' + reqId);
  Rfid.find({rfid: reqId}).limit(1).exec(function(err, result) {
    if (err) {
      return res.status(500).json({
        error: 'Cannot get RFID'
      });
    }
    // If query result contain data (array not empty) RFID is exists in database
    if (result.length > 0) {
      var rfid = result[0];
      console.log(rfid);
      switch (rfid.type) {
        case 'person':
          Person.find({}).limit(1).exec(function(err, result) {
            if (err) {
              return res.status(500).json({
                error: 'Cannot get person'
              });
            }
            console.log(err);
            console.log(result);
            res.json(result);
          });
          break;
        case 'resource':
          Resource.find({rfid: rfid.rfid}).limit(1).exec(function(err, result) {
            if (err) {
              return res.status(500).json({
                error: 'Cannot get resource'
              });
            }
            res.json(result);
          });
          break;
        default:
          return res.status(500).json({
            error: 'Wrong RFID type'
          });
      }
    }
    // RFID is not exists in database so will create it
    else {
      res.status(404).json({
        message: 'ID not found.'
      });
    }
  });
};

/**
 *
 * TEST DATA POPULATION !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 */
var rfidGenerate = function() {
      var text = '';
      var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      /*jslint plusplus: true */
      for( var i=0; i < 16; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

      return text;
    },
    peopleTestData = function() {
      var names = ['Dwingar', 'Thrim', 'Dalni', 'Groi', 'Thortil', 'Roy', 'Tarce', 'Houston', 'Grange', 'Ryson'],
          persons = [];
      /*jslint plusplus: true */
      for( var i=0; i < 5; i++ ) {
        var person = {};
        person.name = names[Math.floor(Math.random() * names.length)];
        person.email = person.name + '@local.com';
        person.rfid = rfidGenerate();
        person.created = Date.now();
        person.updated = Date.now();
        persons.push(person);
      }

      return persons;
    },
    rfidsTestData = function(data) {
      var rfids = [];
      /*jslint plusplus: true */
      for( var i=0; i < data.length; i++ ) {
        var rfid = {};
        rfid.rfid = data[i].rfid;
        if(data[i].hasOwnProperty('email')) {
          rfid.type = 'person';
        } else {
          rfid.type = 'resource';
        }
        rfids.push(rfid);
      }
      return rfids;
    },
    resourcesTestData = function() {
      var categories = ['Agriculture', 'Architecture', 'Business', 'Medical', 'Humor', 'Philosophy', 'Education', 'IT'],
          resources = [];
      /*jslint plusplus: true */
      for( var i=0; i < 10; i++ ) {
        var resource = {};
        resource.category = categories[Math.floor(Math.random() * categories.length)];
        resource.description = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ' +
            'ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut ' +
            'aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore ' +
            'eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt ' +
            'mollit anim id est laborum.';
        resource.rfid = rfidGenerate();
        resource.available = true;
        resource.created = Date.now();
        resource.updated = Date.now();
        console.log(resource);
        resources.push(resource);
      }

      return resources;
    };

exports.populatePeople = function(req, res) {
  var persons = peopleTestData();

  Person.collection.insert(persons, function(err, people) {
    if (err)
      console.log('People population ERROR');

    if(people.length > 0) {
      var rfids = rfidsTestData(people);
      Rfid.collection.insert(rfids, function(err, docs) {
        if (err)
          console.log('People RFIDS population ERROR');
        console.info('%d people were successfully stored.', docs.length);
        res.json(people);
      });
    }

  });

};

exports.populateResources = function(req, res) {
  var resources = resourcesTestData();

  Resource.collection.insert(resources, function(err, data) {
    if (err) {
      console.log('Resources population ERROR');
      console.log(err);
    } else {
      if(data.length > 0) {
        var rfids = rfidsTestData(data);
        Rfid.collection.insert(rfids, function(err, docs) {
          if (err)
            console.log('Resources RFIDS population ERROR');
          console.info('%d resources were successfully stored.', docs.length);
          res.json(data);
        });
      }
    }

  });
};
