'use strict';

// const models = require('../models');
import _ from 'lodash';
import path from 'path';
import Badge from '../models/badge';
import mongoose from 'mongoose';
import q from 'q';
import async from 'async';

mongoose.Promise = Promise;

function handleError(err) {
  return err;
}

const CommunityController = {

  getBadges: function getBadges() {
    return Badge.find()
        .exec()
        .then((res) => {
          return res;
        })
        .catch(handleError);
  },

  createBadge: function createBadge(req) {
     let badge = new Badge(req.body);
    return badge.save()
        .then((res)=>{
          return res;
        });
  },

  findBadge: function findBadge(req) {
    return Badge.findOne({_id: req.params.id})
        .exec()
        .then((res) => {
          return res;
        }).catch(handleError);
  },

  updateBadge: function updateBadge(req) {
    return Badge.findOne({_id: req.params.id})
        .exec()
        .then((badge) => {
          return badge.update(req.body)
              .then((res) => {
                return res;
              })
        }).catch(handleError);
  },

  destroyBadge: function destroyBadge(req) {
    return Badge.findOne({_id: req.params.id})
        .exec()
        .then((badge) => {
          return badge.update({'deletedAt': new Date()})
              .then((res)=>{
                return res;
              })
        }).catch(handleError)
  },

};

export default CommunityController;