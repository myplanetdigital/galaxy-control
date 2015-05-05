'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Article Schema
 */
var TagSchema = new Schema({
  _id: Schema.Types.Mixed,
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
mongoose.model('Tag', TagSchema);
