'use strict';

// const models = require('../models');
import _ from 'lodash';
import path from 'path';
import Exam from '../models/exam';
import mongoose from 'mongoose';
import q from 'q';

mongoose.Promise = Promise;

function handleError(err) {
  return err;
}

const ExamController = {

  getAll: function getAll() {
    return Exam.find()
        .exec()
        .then((res) => {
          return res;
        })
        .catch(handleError);
  },

  create: function create(req) {
    const dfrd = q.defer();
    const exam = new Exam(req);

    exam.save(function (err){
      if (err) return dfrd.reject(err);
      dfrd.resolve(exam);
    });
    return dfrd.promise;
  },

  findById: function findById(req) {
    return Exam.findOne({_id: req.params.id})
        .exec()
        .then((res) => {
          return res;
        }).catch(handleError);
  },

  update: function update(req) {
    return Exam.findOne({_id: req.params.id})
        .exec()
        .then((Exam) => {
          return Exam.update(req.body)
              .then((res) => {
                return res;
              })
        }).catch(handleError);
  },

  destroy: function destroy(req) {
    return Exam.findOne({_id: req.params.id})
        .exec()
        .then((Exam) => {
          return Exam.update({'deletedAt': new Date()})
              .then((res)=>{
                return res;
              })
        }).catch(handleError)
  },

};

export default ExamController;