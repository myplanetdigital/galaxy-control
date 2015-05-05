'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * Article Schema
 */
var ReaderSchema = new Schema({
  reader: {
    type: Schema.Types.Mixed,
    required: true
  }
});

mongoose.model('Reader', ReaderSchema);