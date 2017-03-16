'use strict';

// const models = require('../models');
import _ from 'lodash';
import path from 'path';
import Industry from '../models/industry';
import mongoose from 'mongoose';
import q from 'q';

mongoose.Promise = Promise;

function handleError(err) {
  return err;
}

const IndustryController = {

  getAll: function getAll() {
    return Industry.find()
        .exec()
        .then((res) => {
          return res;
        })
        .catch(handleError);
  },

  create: function create(req) {
    const dfrd = q.defer();
    const industry = new Industry(req.body);

    industry.save(function (err){
      if (err) return dfrd.reject(err);
      dfrd.resolve(industry);
    });
    return dfrd.promise;
  },

  findById: function findById(req) {
    return Industry.findOne({_id: req.params.id})
        .exec()
        .then((res) => {
          return res;
        }).catch(handleError);
  },

  update: function update(req) {
    return Industry.findOne({_id: req.params.id})
        .exec()
        .then((Industry) => {
          return Industry.update(req.body)
              .then((res) => {
                return res;
              })
        }).catch(handleError);
  },

  destroy: function destroy(req) {
    return Industry.findOne({_id: req.params.id})
        .exec()
        .then((Industry) => {
          return Industry.update({'deletedAt': new Date()})
              .then((res)=>{
                return res;
              })
        }).catch(handleError)
  },

};

export default IndustryController;