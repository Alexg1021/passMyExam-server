'use strict';

// var mongoose = require('mongoose');

import mongoose from 'mongoose';

var ExamTypeSchema = new mongoose.Schema({
  typeName: String,
  description: String,
  shortDescription: String,
  industry: {type: mongoose.Schema.Types.ObjectId, ref: 'Industry'},
  primaryImage: {thumb: String, medium: String, fileType:String, original:String},
  secondaryImage:{thumb: String, medium: String, fileType:String, original:String},
  active: {type: Boolean, default: true},
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now},
  deletedAt: {type: Date, default: null}
});


module.exports = mongoose.model('ExamType', ExamTypeSchema);
