'use strict';

// const models = require('../models');
import _ from 'lodash';
import path from 'path';
import Answer from '../models/answer';
import mongoose from 'mongoose';
import q from 'q';
import async from 'async';

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

  create: function create(answers) {
    const dfrd = q.defer();

    async.map(answers, function (answer, callback){
      var ans = new Answer(answer);

      ans.save(function(err){
        if(err) return dfrd.reject(err);
        callback(null, ans);
      });
    }, function (err, result){
      if(err) return dfrd.reject(err);
      dfrd.resolve(result);
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

  updateAnswers:function updateAnswers(answers){
    const dfrd = q.defer();
    return new Promise((resolve)=>{
     answers.map((answer)=>{
      return Answer.findOne({_id:answer._id})
          .then((ans)=>{
            return ans.update(answer)
                .then((res)=>{
                  return res;
                })
          })
      });
      resolve(answers);
    });
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