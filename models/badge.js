'use strict';

// var mongoose = require('mongoose');

import mongoose from 'mongoose';

var BadgeSchema = new mongoose.Schema({
  name: {type: String, default: null},
  badgeIcon: {type: String, default: null},
  description: {type: String, default:null},
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now},
  deletedAt: {type: Date, default: null}
});

module.exports = mongoose.model('Badge', BadgeSchema);