'use strict';

// var mongoose = require('mongoose');

import mongoose from 'mongoose';

var ExamResultSchema = new mongoose.Schema({
  exam: {type: mongoose.Schema.Types.ObjectId, ref: 'Exam'},
  answeredQuestions: {type: Number, default: null},
  totalQuestions: {type: Number, default: null},
  totalTime: {type: Number, default: null},
  answeredCorrectly: {type: Number, default: null},
  answeredIncorrectly: {type: Number, default: null},
  averageTimePerQuestion: {type: Number, default: null},
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now},
  deletedAt: {type: Date, default: null}
});


module.exports = mongoose.model('ExamResult', ExamResultSchema);
