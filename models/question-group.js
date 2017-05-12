'use strict';

// var mongoose = require('mongoose');

import mongoose from 'mongoose';

var QuestionGroupSchema = new mongoose.Schema({
  question: {type: String, default: null},
  subText: [{type:String, default:null}],
  answers: [{type: mongoose.Schema.Types.ObjectId, ref: 'Answer'}],
  examDescription:{type: mongoose.Schema.Types.ObjectId, ref: 'ExamDescription'},
  examType: {type: mongoose.Schema.Types.ObjectId, ref: 'ExamType'},
  active: {type: Boolean, default: true},
  image: {thumb: String, medium: String, fileType:String, original:String},
  correctAnswer: {type: mongoose.Schema.Types.ObjectId, ref: 'Answer'},
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now},
  deletedAt: {type: Date, default: null}
});


module.exports = mongoose.model('QuestionGroup', QuestionGroupSchema);
