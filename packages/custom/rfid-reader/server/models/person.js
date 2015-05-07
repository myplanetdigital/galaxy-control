'use strict';

/**
* Module dependencies.
*/
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
* Article Schema
*/
var PersonSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  rfid: {
    type: String,
    required: true,
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  updated: {
    type: Date,
    default: Date.now
  },
  versionKey: false
});



mongoose.model('Person', PersonSchema);
