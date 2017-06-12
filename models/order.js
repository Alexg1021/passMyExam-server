'use strict';

// var mongoose = require('mongoose');

import mongoose from 'mongoose';

var OrderSchema = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  orderId: {type: String, default: null},
  totalAmount: {type: String, default: null},
  examDescription: {type: mongoose.Schema.Types.ObjectId, ref: 'ExamDescription'},
  exam: {type: mongoose.Schema.Types.ObjectId, ref: 'Exam'},
  source: {type: Object},
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now},
  deletedAt: {type: Date, default: null}
});

module.exports = mongoose.model('Order', OrderSchema);
