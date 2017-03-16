'use strict';

// const models = require('../models');
import _ from 'lodash';
import path from 'path';
import ExamResult from '../models/exam-result';
import mongoose from 'mongoose';
import q from 'q';

mongoose.Promise = Promise;

function handleError(err) {
  return err;
}

const ExamResultController = {

  getAll: function getAll() {
    return ExamResult.find()
        .exec()
        .then((res) => {
          return res;
        })
        .catch(handleError);
  },

  create: function create(req) {
    const dfrd = q.defer();
    const examResult = new ExamResult(req.body);

    examResult.save(function (err){
      if (err) return dfrd.reject(err);
      dfrd.resolve(examResult);
    });
    return dfrd.promise;
  },

  findById: function findById(req) {
    return ExamResult.findOne({_id: req.params.id})
        .exec()
        .then((res) => {
          return res;
        }).catch(handleError);
  },

  update: function update(req) {
    return ExamResult.findOne({_id: req.params.id})
        .exec()
        .then((ExamResult) => {
          return ExamResult.update(req.body)
              .then((res) => {
                return res;
              })
        }).catch(handleError);
  },

  destroy: function destroy(req) {
    return ExamResult.findOne({_id: req.params.id})
        .exec()
        .then((ExamResult) => {
          return ExamResult.update({'deletedAt': new Date()})
              .then((res)=>{
                return res;
              })
        }).catch(handleError)
  },

};

export default ExamResultController;