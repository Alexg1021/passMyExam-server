'use strict';

// const models = require('../models');
import _ from 'lodash';
import path from 'path';
import TestQuestion from '../models/test-question';
import Answer from '../models/answer';
import Exam from '../models/exam';
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

  destroy:function destroy(req){
    return TestQuestion.findOne({_id: req.params.id})
        .exec()
        .then((testQuestion) => {
          return testQuestion.update({'deletedAt': new Date()})
              .then((res)=>{
                return res;
              })
        }).catch(handleError)
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

  getTestQuestion: function getTestQuestion(req) {
    return TestQuestion.findOne({_id: req.params.questionId})
        .exec()
        .then((testQuestion) => {
          if(!testQuestion.active){
            testQuestion.active=true;
            testQuestion.startTime = new Date();
          }
          return testQuestion.update(testQuestion)
              .then((res)=>{
                return  TestQuestion.findOne({_id:testQuestion._id})
                    .populate({path:'questionGroup',populate:{path: 'answers'}})
                    .then((tq)=>{
                      return tq;
                    });
              });

        }).catch(handleError)
  },

  saveTestAnswer: function saveTestAnswer(req){
    let tq = req.body;
      tq.answeredCorrectly =  tq.answerGiven == tq.correctAnswer;
      tq.endTime = new Date();
      tq.answered = true;
    return TestQuestion.findOne({_id:req.params.questionId})
        .exec()
        .then((question)=>{
          return question.update(tq)
              .then((res)=>{

                return TestQuestion.findOne({_id:tq._id})
                    .populate({path:'questionGroup',populate:{path: 'answers'}})
                    .then((testQuestion)=>{
                      return testQuestion;
                    });
              });
        });
  },

  flagQuestion: function flagQuestion(req){
    let tq = req.body;
    return TestQuestion.findOne({_id:req.params.questionId})
        .exec()
        .then((question)=>{
          return question.update(tq)
              .then((res)=>{
                return TestQuestion.findOne({_id:tq._id})
                    .populate({path:'questionGroup',populate:{path: 'answers'}})
                    .then((testQuestion)=>{
                      return testQuestion;
                    });
              });
        });
  }

};

export default TestQuestionController;