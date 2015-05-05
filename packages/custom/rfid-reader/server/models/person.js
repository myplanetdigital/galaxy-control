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
  tag: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tag'
  },
  created: {
    type: Date,
    default: Date.now
  },
  updated: {
    type: Date,
    default: Date.now
  }
});



mongoose.model('Person', PersonSchema);
