'use strict';

// var mongoose = require('mongoose');

import bcrypt from 'bcrypt';

import mongoose from 'mongoose';

var UserSchema = new mongoose.Schema({

  firstName: String,
  lastName: String,
  email: String,
  password: String,
  isAdmin: {type: Boolean, default: false},
  passwordReset: {
    token: String,
    exp: {type: Date, default: Date.now}
  },
  isActive: {type: Boolean, default: true},
  emailConfirmed: {type: Boolean, default: false},
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now},
  deletedAt: {type: Date, default: null},
});

UserSchema.pre('save', function preSave(next) {
  var user = this;
  if (!user.isModified('password')) return next();

  bcrypt.genSalt(10, function (err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, function () {
    }, function (err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.toJSON = function toJSON() {
  return _.omit(this.toObject(), ['password']);
};

UserSchema.methods.validPassword = function validPassword(password, cb) {
  return bcrypt.compare(password, this.password, cb);
};

module.exports = mongoose.model('User', UserSchema);
