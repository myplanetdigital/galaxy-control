'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    openPage = require('open'),
    Person = mongoose.model('Person'),
    Resource = mongoose.model('Resource'),
    Rfid = mongoose.model('Rfid'),
    mean = require('meanio'),
    config = mean.loadConfig(),
    endpoints = config.endpoints,
    url = require('url');
    
var getEndpointByPath = function(url) {
      for (var key in endpoints) {
        if (endpoints.hasOwnProperty(key)) {
          var endpoint = endpoints[key];
          if (endpoint.url === url)
            return endpoint;
        }
      }
    };

/**
 * RFID reader first request handler
 */
exports.entry = function (req, res) {
  var reqId = req.param('rfid');
  var path = url.parse(req.url).pathname;
  var endpoint = getEndpointByPath(path);

  Rfid.find({rfid: reqId}).limit(1).exec(function(err, result) {
    if (err) {
      return res.status(500).json({
        error: 'Cannot get RFID.'
      });
    }
    // If query result contains data (array is not empty), RFID exists in database
    if (result.length > 0) {
      var rfid = result[0];
      switch (rfid.type) {
        // Server got person RFID
        case 'person':
          Person.find({rfid: rfid.rfid}).limit(1).exec(function (err, person) {
            if (err) {
              return res.status(500).json({
                error: 'Error while getting person.'
              });
            }
            if (person.length > 0) {
              var quest = {};
              quest.data = person[0];
              quest.entryTimestamp = Date.now();
              req.session.person = quest;
              return res.json(endpoint.message + ' ' + quest.data.name);
            }
            else {
              return res.status(404).json({
                message: 'Can\'t get a person.'
              });
            }
          });
          break;
          // Server got resource RFID
        case 'resource':
          // Check session for person
          if (req.session.person && req.session.person.hasOwnProperty('entryTimestamp')) {
            var personEntryDate = req.session.person.entryTimestamp,
                    newDate = Date.now(),
                    datesDiff = newDate - personEntryDate;
            //@todo: DEL console.log
            console.log(datesDiff);
            // User session expired
            if (datesDiff <= 60000) {
              // Update person entry timestamp
              req.session.person.entryTimestamp = Date.now();
              // Change the resource's availability status
              Resource.find({rfid: rfid.rfid}).limit(1).exec(function (err, result) {
                if (err) {
                  return res.status(500).json({
                    error: 'Error while getting resource.'
                  });
                }
                if (result.length > 0) {
                  var resource = result[0],
                          message = (resource.available === true) ? 'Checked out ' : 'Returned ';

                  resource.available = (resource.available === true) ? false : true;
                  resource.updated = Date.now();
                  resource.person_rfid = req.session.person.data.rfid;
                  resource.save(function (err) {
                    if (err) {
                      return res.status(500).json({
                        error: 'Error while updating resource.'
                      });
                    }
                    res.send(message + resource.description);
                  });
                }
                else {
                  return res.status(404).json({
                    message: 'Can\'t get a resource.'
                  });
                }
              });
            }
            else {
              delete req.session.person;
              return res.status(500).json({
                error: 'User session expired.'
              });
            }
          }
          else {
            return res.status(500).json({
              error: 'Tap user card to begin.'
            });
          }
          break;
        default:
          return res.status(500).json({
            error: 'Wrong RFID type.'
          });
      }
    }
    // RFID does not exist in database so send a message and open a registration page
    else {
      openPage('http://' + req.headers.host + '/#!/card-registration?rfid=' + reqId);
      res.status(404).json({
        message: 'ID is not found.'
      });
    }
  });
};

/**
 * TEST DATA POPULATION !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 */
var rfidGenerate = function () {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  /*jslint plusplus: true */
  for (var i = 0; i < 16; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
},
        peopleTestData = function () {
          var names = ['Dwingar', 'Thrim', 'Dalni', 'Groi', 'Thortil', 'Roy', 'Tarce', 'Houston', 'Grange', 'Ryson'],
                  persons = [];
          /*jslint plusplus: true */
          for (var i = 0; i < 5; i++) {
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
        rfidsTestData = function (data) {
          var rfids = [];
          /*jslint plusplus: true */
          for (var i = 0; i < data.length; i++) {
            var rfid = {};
            rfid.rfid = data[i].rfid;
            if (data[i].hasOwnProperty('email')) {
              rfid.type = 'person';
            }
            else {
              rfid.type = 'resource';
            }
            rfids.push(rfid);
          }

          return rfids;
        },
        resourcesTestData = function () {
          var categories = ['Agriculture', 'Architecture', 'Business', 'Medical', 'Humor', 'Philosophy', 'Education', 'IT'],
                  resources = [];
          /*jslint plusplus: true */
          for (var i = 0; i < 10; i++) {
            var resource = {};
            resource.description = 'Lorem ipsum dolor ' + i;
            resource.category = categories[Math.floor(Math.random() * categories.length)];
            resource.available = true;
            resource.rfid = rfidGenerate();
            resource.person_rfid = 'new';
            resource.created = Date.now();
            resource.updated = Date.now();
            resources.push(resource);
          }

          return resources;
        };

exports.populatePeople = function (req, res) {
  var persons = peopleTestData();

  Person.collection.insert(persons, function (err, people) {
    if (err)
      console.log('People population ERROR.');
    if (people.length > 0) {
      var rfids = rfidsTestData(people);
      Rfid.collection.insert(rfids, function (err, docs) {
        if (err)
          console.log('People RFIDS population ERROR.');
        console.info('%d people were successfully stored.', docs.length);
        res.json(people);
      });
    }

  });

};

exports.populateResources = function (req, res) {
  var resources = resourcesTestData();

  Resource.collection.insert(resources, function (err, data) {
    if (err) {
      console.log('Resources population ERROR.');
      console.log(err);
    }
    else {
      if (data.length > 0) {
        var rfids = rfidsTestData(data);
        Rfid.collection.insert(rfids, function (err, docs) {
          if (err)
            console.log('Resources RFIDS population ERROR.');
          console.info('%d resources were successfully stored.', docs.length);
          res.json(data);
        });
      }
    }
  });
};

/**
 * Save new resource RFID
 */
exports.saveResource = function (req, res) {
  Rfid.find({rfid: req.body.rfid}).limit(1).exec(function (err, result) {
    if (err) {
      return res.status(500).json({
        error: 'Cannot get RFID.'
      });
    }
    if (result.length > 0) {
      return res.status(409).json({
        error: 'This RFID has already been registered.'
      });
    }
    else {
      var rfidData = {
        rfid: req.body.rfid,
        type: 'resource'
      };
      Rfid.collection.insert(rfidData, function (err, docs) {
        if (err)
          console.log('Resource RFID insertion ERROR.');
        console.info('Resource RFID was stored successfully.', docs.length);
        Resource.collection.insert(req.body, function(err, data) {
          if (err) {
            console.log('Resource insertion ERROR.');
            console.log(err);
          }
          else {
            res.json(data);
          }
        });
      });
    }
  });
};

/**
 * Save new person RFID
 */
exports.savePerson = function (req, res) {
  Rfid.find({rfid: req.body.rfid}).limit(1).exec(function (err, result) {
    if (err) {
      return res.status(500).json({
        error: 'Cannot get RFID.'
      });
    }
    if (result.length > 0) {
      return res.status(409).json({
        error: 'This RFID has already been registered.'
      });
    }
    else {
      var rfidData = {
        rfid: req.body.rfid,
        type: 'person'
      };
      Rfid.collection.insert(rfidData, function (err, docs) {
        if (err)
          console.log('Person RFID insertion ERROR.');
        console.info('Person RFID was stored successfully.', docs.length);
        Person.collection.insert(req.body, function(err, data) {
          if (err) {
            console.log('Person insertion ERROR');
            console.log(err);
          }
          else {
            res.json(data);
          }
        });
      });
    }
  });
};

/**
 * Get rosourse's statuses
 */
exports.resourceStatus = function (req, res) {
  Rfid.find(function (err, rfids) {
    if (err) {
      return res.status(500).json({
        error: 'Cannot get RFIDs.'
      });
    }
    if (rfids.length > 0) {
      var resources_rfids_arr = [],
          people_rfids_arr = [];
      /*jslint plusplus: true */
      for (var i = 0; i < rfids.length; i++) {
        if (rfids[i].type === 'resource') {
          resources_rfids_arr.push(rfids[i].rfid);
        }
        else if (rfids[i].type === 'person') {
          people_rfids_arr.push(rfids[i].rfid);
        }
      }
      
      Resource.find({rfid: {$in: resources_rfids_arr}}, function (err, resources) {
        if (err) {
          return res.status(500).json({
            error: 'Cannot get resources by its RFIDs.'
          });
        }

        Person.find({rfid: {$in: people_rfids_arr}}, function (err, people) {
          if (err) {
            return res.status(500).json({
              error: 'Cannot get people by their RFIDs.'
            });
          }

          var dataForLibraryStatus = {
            resources: resources,
            people: people
          };

          res.json(dataForLibraryStatus);
        });
      });
    }
    else {
      res.status(404).json({
        message: 'No RFID was found.'
      });
    }
  });
};
