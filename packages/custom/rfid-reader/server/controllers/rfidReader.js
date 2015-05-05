'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
//    Person = mongoose.model('Person');
//    Resource = mongoose.model('Resource'),
    Tag = mongoose.model('Tag');
//    _ = require('lodash');
//var endpoints = {
//  library: {
//    description: "Local library",
//    url: "library",
//    message: "Welcome to our library"
//  },
//  smth: {
//    description: "Some other place",
//    url: "smth",
//    message: "Welcome to the SMTH"
//  }
//};
/**
 * Find RFID
 */
exports.entry = function(req, res) {
//  var pers = new Person({
//    name: 'Vasya',
//    children: [{
//      _id: 123,
//      type: 'person'
//    }]
//  });
//
//  pers.save(function(err) {
//    if (err) {
//      console.log('fucking err: ' + err);
//    }
//    console.log(err);
//    console.log('cool');
//  });

  var rfid = req.param('rfid');
  console.log('RFID: ' + rfid);
  Tag.find({_id: rfid}).limit(1).exec(function(err, result) {
    console.log('err: ' + err);
    if (err) {
      return res.status(500).json({
        error: 'Cannot list the articles'
      });
    }
    // If query result contain data (array not empty) RFID is exists in database
    if (result.length > 0) {
      res.json(result[0]);
    }
    // RFID is not exists in database so will create it
    else {
      res.json(404, { message: 'ID not found.' });
    }
  });
};
