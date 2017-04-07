'use strict';

// var mongoose = require('mongoose');

import mongoose from 'mongoose';

var QuestionGroupSchema = new mongoose.Schema({
  question: {type: String, default: null},
  answers: [{type: mongoose.Schema.Types.ObjectId, ref: 'Answer'}],
  startTime: {type: Date, default: null},
  pauseTime: [{type: Date, default: null}],
  restartTime: [{type: Date, default: null}],
  examDescription:{type: mongoose.Schema.Types.ObjectId, ref: 'ExamDescription'},
  endTime: [{type: Date, default: null}],
  active: {type: Boolean, default: false},
  flagged: {type: Boolean, default: false},
  answered: {type: Boolean, default: false},
  image: {data: Buffer, contentType: String},
  answeredCorrectly: {type: Boolean, default: null},
  correctAnswer: {type: mongoose.Schema.Types.ObjectId, ref: 'Answer'},
  answerGiven: {type: mongoose.Schema.Types.ObjectId, ref: 'Answer'},
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now},
  deletedAt: {type: Date, default: null}
});


module.exports = mongoose.model('QuestionGroup', QuestionGroupSchema);
