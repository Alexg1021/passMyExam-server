'use strict';

// var mongoose = require('mongoose');

import mongoose from 'mongoose';

var TestQuestionSchema = new mongoose.Schema({
  questionGroup: {type: mongoose.Schema.Types.ObjectId, ref: 'QuestionGroup'},
  startTime: {type: Date, default: null},
  pauseTime: [{type: Date, default: null}],
  restartTime: [{type: Date, default: null}],
  endTime: [{type: Date, default: null}],
  active: {type: Boolean, default: false},
  flagged: {type: Boolean, default: false},
  answered: {type: Boolean, default: false},
  answeredCorrectly: {type: Boolean, default: null},
  correctAnswer: {type: mongoose.Schema.Types.ObjectId, ref: 'Answer'},
  answerGiven: {type: mongoose.Schema.Types.ObjectId, ref: 'Answer'},
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now},
  deletedAt: {type: Date, default: null}
});


module.exports = mongoose.model('TestQuestion', TestQuestionSchema);
