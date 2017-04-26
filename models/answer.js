'use strict';

// var mongoose = require('mongoose');

import mongoose from 'mongoose';

var AnswerSchema = new mongoose.Schema({
  text: {type: String, default: null},
  questionGroup: {type: mongoose.Schema.Types.ObjectId, ref: 'QuestionGroup'},
  correctAnswer: {type: Boolean, default: false},
  answerImage: {data: Buffer, contentType: String},
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now},
  deletedAt: {type: Date, default: null}
});

module.exports = mongoose.model('Answer', AnswerSchema);
