'use strict';

// const models = require('../models');
import _ from 'lodash';
import path from 'path';
import TestQuestion from '../models/test-question';
import Answer from '../models/answer';
import mongoose from 'mongoose';
import q from 'q';
import async from 'async';
import AnswerController from '../controllers/answer.controller';

mongoose.Promise = Promise;

function handleError(err) {
  return err;
}

const TestQuestionController = {

  getAll: function getAll() {
    return TestQuestion.find()
        .exec()
        .then((res) => {
          return res;
        })
        .catch(handleError);
  },

  create: function create(testQuestions) {
    const dfrd = q.defer();

    async.map(testQuestions, function (question, callback){
      var tq = new TestQuestion(question);

      tq.save(function(err){
        if(err) return dfrd.reject(err);
        callback(null, tq);
      });
    }, function (err, result){
      if(err) return dfrd.reject(err);
      dfrd.resolve(result);
    });
    return dfrd.promise;
  },

  findById: function findById(req) {
    return TestQuestion.findOne({_id: req.params.id})
        .exec()
        .then((res) => {
          return res;
        }).catch(handleError);
  },

  update: function update(req) {
    return TestQuestion.findOne({_id: req.params.id})
        .exec()
        .then((TestQuestion) => {
          return TestQuestion.update(req.body)
              .then((res) => {
                return res;
              })
        }).catch(handleError);
  },

  destroy: function destroy(req) {
    return TestQuestion.findOne({_id: req.params.id})
        .exec()
        .then((TestQuestion) => {
          return TestQuestion.update({'deletedAt': new Date()})
              .then((res)=>{
                return res;
              })
        }).catch(handleError)
  },

};

export default TestQuestionController;