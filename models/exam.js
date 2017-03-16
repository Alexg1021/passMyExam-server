'use strict';

// var mongoose = require('mongoose');

import mongoose from 'mongoose';

var ExamSchema = new mongoose.Schema({
  title: String,
  examDescription: {type: mongoose.Schema.Types.ObjectId, ref: 'ExamDescription'},
  questionGroups: [{type: mongoose.Schema.Types.ObjectId, ref: 'QuestionsGroup'}],
  startTime: {type: Date, default: Date.now},
  pauseTime: [{type: Date, default: Date.now}],
  restartTime: [{type: Date, default: Date.now}],
  endTime: {type: Date, default: Date.now},
  completed: {type: Boolean, default: false},
  active: {type: Boolean, default: true},
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now},
  deletedAt: {type: Date, default: null}
});


module.exports = mongoose.model('Exam', ExamSchema);
