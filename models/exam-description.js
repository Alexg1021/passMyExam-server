'use strict';

// var mongoose = require('mongoose');

import mongoose from 'mongoose';

var ExamDescriptionSchema = new mongoose.Schema({
  title: String,
  examType: {type: mongoose.Schema.Types.ObjectId, ref: 'ExamType'},
  note: String,
  shortDescription: String,
  longDescription: String,
  totalQuestions: {type: Number, default: null},
  price: {type: Number, default: null},
  timeAllowed: [{type: Number, default: null}],
  image: {data: Buffer, contentType: String},
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now},
  deletedAt: {type: Date, default: null}
});

module.exports = mongoose.model('ExamDescription', ExamDescriptionSchema);
