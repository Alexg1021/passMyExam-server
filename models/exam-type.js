'use strict';

// var mongoose = require('mongoose');

import mongoose from 'mongoose';

var ExamTypeSchema = new mongoose.Schema({
  typeName: String,
  description: String,
  shortDescription: String,
  industry: {type: mongoose.Schema.Types.ObjectId, ref: 'Industry'},
  active: {type: Boolean, default: true},
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now},
  deletedAt: {type: Date, default: null}
});


module.exports = mongoose.model('ExamType', ExamTypeSchema);
