'use strict';

// var mongoose = require('mongoose');

import mongoose from 'mongoose';

var QuestionGroupSchema = new mongoose.Schema({
  question: {type: String, default: null},
  answers: [{type: mongoose.Schema.Types.ObjectId, ref: 'Answer'}],
  startTime: {type: Date, default: Date.now},
  pauseTime: [{type: Date, default: Date.now}],
  restartTime: [{type: Date, default: Date.now}],
  endTime: [{type: Date, default: Date.now}],
  active: {type: Boolean, default: true},
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
