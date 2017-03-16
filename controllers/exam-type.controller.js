'use strict';

// const models = require('../models');
import _ from 'lodash';
import path from 'path';
import ExamType from '../models/exam-type';
import mongoose from 'mongoose';
import q from 'q';

mongoose.Promise = Promise;

function handleError(err) {
  return err;
}

const ExamTypeController = {

  getAll: function getAll() {
    return ExamType.find()
        .populate('industry')
        .exec()
        .then((res) => {
          return res;
        })
        .catch(handleError);
  },

  create: function create(req) {
    const dfrd = q.defer();
    const examType = new ExamType(req.body);

    examType.save(function (err){
      if (err) return dfrd.reject(err);
      dfrd.resolve(examType);
    });
    return dfrd.promise;
  },

  findById: function findById(req) {
    return ExamType.findOne({_id: req.params.id})
        .populate('industry')
        .exec()
        .then((res) => {
          return res;
        }).catch(handleError);
  },

  update: function update(req) {
    return ExamType.findOne({_id: req.params.id})
        .exec()
        .then((ExamType) => {
          return ExamType.update(req.body)
              .then((res) => {
                return res;
              })
        }).catch(handleError);
  },

  destroy: function destroy(req) {
    return ExamType.findOne({_id: req.params.id})
        .exec()
        .then((ExamType) => {
          return ExamType.update({'deletedAt': new Date()})
              .then((res)=>{
                return res;
              })
        }).catch(handleError)
  },

};

export default ExamTypeController;