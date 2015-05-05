'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Person = mongoose.model('Person'),
    Resource = mongoose.model('Resource'),
    Tag = mongoose.model('Tag');

/**
 * Find RFID
 */
exports.entry = function(req, res) {
  var rfid = req.param('rfid');
  console.log('RFID: ' + rfid);
  Tag.find({_id: rfid}).limit(1).exec(function(err, result) {
    if (err) {
      return res.status(500).json({
        error: 'Cannot get RFID'
      });
    }
    // If query result contain data (array not empty) RFID is exists in database
    if (result.length > 0) {
      var tag = result[0];
      switch (tag.type) {
        case 'person':
          Person.find({tag: tag._id}).limit(1).exec(function(err, result) {
            if (err) {
              return res.status(500).json({
                error: 'Cannot get person'
              });
            }

          });
          break;
        case 'resource':
          Resource.find({tag: tag._id}).limit(1).exec(function(err, result) {
            if (err) {
              return res.status(500).json({
                error: 'Cannot get resource'
              });
            }
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
