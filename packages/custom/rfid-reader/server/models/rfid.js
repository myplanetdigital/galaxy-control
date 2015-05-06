'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Article Schema
 */
var RfidSchema = new Schema({
  rfid: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    trim: true
  }
//  ,
//  reader: {
//    type: mongoose.Schema.Types.ObjectId,
//    ref: 'Reader'
//  }
});
mongoose.model('Rfid', RfidSchema);
