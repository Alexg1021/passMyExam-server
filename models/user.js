'use strict';

// var mongoose = require('mongoose');

import bcrypt from 'bcrypt';

import mongoose from 'mongoose';

var UserSchema = new mongoose.Schema({

  firstName: String,
  lastName: String,
  email: String,
  password: {type:String,select:false},
  isAdmin: {type: Boolean, default: false},
  passwordReset: {
    token: String,
    exp: {type: Date, default: Date.now}
  },
  examsPurchased: [{type: mongoose.Schema.Types.ObjectId, ref: 'ExamDescription'}],
  isActive: {type: Boolean, default: true},
  emailConfirmed: {type: Boolean, default: false},
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now},
  deletedAt: {type: Date, default: null},
});


module.exports = mongoose.model('User', UserSchema);
