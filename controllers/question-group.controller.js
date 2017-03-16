'use strict';

// const models = require('../models');
import _ from 'lodash';
import path from 'path';
import QuestionGroup from '../models/question-group';
import mongoose from 'mongoose';
import q from 'q';

mongoose.Promise = Promise;

function handleError(err) {
  return err;
}

const QuestionGroupController = {

  getAll: function getAll() {
    return QuestionGroup.find()
        .exec()
        .then((res) => {
          return res;
        })
        .catch(handleError);
  },

  create: function create(req) {
    const dfrd = q.defer();
    const questionGroup = new QuestionGroup(req.body);

    questionGroup.save(function (err){
      if (err) return dfrd.reject(err);
      dfrd.resolve(questionGroup);
    });
    return dfrd.promise;
  },

  findById: function findById(req) {
    return QuestionGroup.findOne({_id: req.params.id})
        .exec()
        .then((res) => {
          return res;
        }).catch(handleError);
  },

  update: function update(req) {
    return QuestionGroup.findOne({_id: req.params.id})
        .exec()
        .then((QuestionGroup) => {
          return QuestionGroup.update(req.body)
              .then((res) => {
                return res;
              })
        }).catch(handleError);
  },

  destroy: function destroy(req) {
    return QuestionGroup.findOne({_id: req.params.id})
        .exec()
        .then((QuestionGroup) => {
          return QuestionGroup.update({'deletedAt': new Date()})
              .then((res)=>{
                return res;
              })
        }).catch(handleError)
  },

};

export default QuestionGroupController;