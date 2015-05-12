'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Article Schema
 */
var ResourceSchema = new Schema({
  description: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  available: {
    type: Boolean,
    default: true
  },
  rfid: {
    type: String,
    required: true,
    trim: true
  },
  person_rfid: {
    type: String,
    required: true,
    trim: true
  },
  created: {
    type: Date,
    default: Date.now()
  },
  updated: {
    type: Date,
    default: Date.now()
  },
  versionKey: false
});

mongoose.model('Resource', ResourceSchema);
