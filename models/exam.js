'use strict';

// var mongoose = require('mongoose');

import mongoose from 'mongoose';

var ExamSchema = new mongoose.Schema({
  title: String,
  examDescription: {type: mongoose.Schema.Types.ObjectId, ref: 'ExamDescription'},
  questionGroups: [{type: mongoose.Schema.Types.ObjectId, ref: 'QuestionGroup'}],
  startTime: {type: Date, default: null},
  pauseTime: [{type: Date, default: null}],
  restartTime: [{type: Date, default: null}],
  endTime: {type: Date, default: null},
  completed: {type: Boolean, default: false},
  active: {type: Boolean, default: false},
  user:{type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now},
  deletedAt: {type: Date, default: null}
});


module.exports = mongoose.model('Exam', ExamSchema);
