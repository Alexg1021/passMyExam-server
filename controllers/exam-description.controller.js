'use strict';

// const models = require('../models');
import _ from 'lodash';
import path from 'path';
import ExamDescription from '../models/exam-description';
import mongoose from 'mongoose';
import q from 'q';

mongoose.Promise = Promise;

function handleError(err) {
  return err;
}

const ExamDescriptionController = {

  getAll: function getAll() {
    return ExamDescription.find({deletedAt:null})
        .populate({path: 'examType', populate:{path: 'industry'}})
        .exec()
        .then((res) => {
          return res;
        })
        .catch(handleError);
  },

  create: function create(req) {
    const dfrd = q.defer();
    const examDescription = new ExamDescription(req.body);

    examDescription.save(function (err){
      if (err) return dfrd.reject(err);
      dfrd.resolve(examDescription);
    });
    return dfrd.promise;
  },

  findById: function findById(req) {
    return ExamDescription.findOne({_id: req.params.id})
        .populate({path: 'examType', populate:{path: 'industry'}})
        .exec()
        .then((res) => {
          return res;
        }).catch(handleError);
  },

  update: function update(req) {
    return ExamDescription.findOne({_id: req.params.id})
        .exec()
        .then((ExamDescription) => {
          return ExamDescription.update(req.body)
              .then((res) => {
                return res;
              })
        }).catch(handleError);
  },

  destroy: function destroy(req) {
    return ExamDescription.findOne({_id: req.params.id})
        .exec()
        .then((ExamDescription) => {
          return ExamDescription.update({'deletedAt': new Date()})
              .then((res)=>{
                return res;
              })
        }).catch(handleError)
  },

};

export default ExamDescriptionController;