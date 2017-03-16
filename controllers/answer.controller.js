'use strict';

// const models = require('../models');
import _ from 'lodash';
import path from 'path';
import Answer from '../models/answer';
import mongoose from 'mongoose';
import q from 'q';

mongoose.Promise = Promise;

function handleError(err) {
  return err;
}

const AnswerController = {

  getAll: function getAll() {
    return Answer.find()
        .exec()
        .then((res) => {
          return res;
        })
        .catch(handleError);
  },

  create: function create(req) {
    const dfrd = q.defer();
    const answer = new Answer(req.body);

    answer.save(function (err){
      if (err) return dfrd.reject(err);
      dfrd.resolve(answer);
    });
    return dfrd.promise;
  },

  findById: function findById(req) {
    return Answer.findOne({_id: req.params.id})
        .exec()
        .then((res) => {
          return res;
        }).catch(handleError);
  },

  update: function update(req) {
    return Answer.findOne({_id: req.params.id})
        .exec()
        .then((Answer) => {
          return Answer.update(req.body)
              .then((res) => {
                return res;
              })
        }).catch(handleError);
  },

  destroy: function destroy(req) {
    return Answer.findOne({_id: req.params.id})
        .exec()
        .then((Answer) => {
          return Answer.update({'deletedAt': new Date()})
              .then((res)=>{
                return res;
              })
        }).catch(handleError)
  },

};

export default AnswerController;