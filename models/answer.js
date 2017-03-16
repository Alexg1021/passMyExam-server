'use strict';

// var mongoose = require('mongoose');

import mongoose from 'mongoose';

var AnswerSchema = new mongoose.Schema({
  text: {type: String, default: null},
  correctAnswer: {type: Boolean, default: null},
  answerImage: {data: Buffer, contentType: String},
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now},
  deletedAt: {type: Date, default: null}
});


module.exports = mongoose.model('Answer', AnswerSchema);
