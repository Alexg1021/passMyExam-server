'use strict';

// var mongoose = require('mongoose');

import mongoose from 'mongoose';

var PromoSchema = new mongoose.Schema({
  code: {type: String, default: null},
  description: {type: String, default: null},
  expiration:{type: Date, default: null},
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now},
  deletedAt: {type: Date, default: null}
});

module.exports = mongoose.model('Promo', PromoSchema);
