'use strict';

// var mongoose = require('mongoose');

import mongoose from 'mongoose';

var IndustrySchema = new mongoose.Schema({
  industryName: {type: String, default: null},
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now},
  deletedAt: {type: Date, default: null}
});


module.exports = mongoose.model('Industry', IndustrySchema);
