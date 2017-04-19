'use strict';

// const models = require('../models');
import _ from 'lodash';
import path from 'path';
import ExamResult from '../models/exam-result';
import Exam from "../models/exam";
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

  //Method to get all exams from user with test results
  getExamResults: function getExamResults(req) {
    return Exam.find({user: req.params.userId, completed: true})
        .populate({
          path: 'examDescription',
          populate:{
            path:'examType'
          }
        })
        .populate({
          path: 'testQuestions',
          populate:{
            path:'questionGroup',
            populate:{
              path:'answers'
            },
          },
        })
        .populate({
          path: 'testQuestions',
          populate:{
            path:'answerGiven'
          },
        })
        .populate({
          path: 'testQuestions',
          populate:{
            path:'correctAnswer'
          },
        })
        .populate('examResults')
        .exec()
        .then((res) => {
          return res;
        }).catch(handleError);
  },

  //Method to get single exam result
  getExamResult: function getExamResult(req) {
    return Exam.findOne({_id: req.params.examId})
        .populate({
          path: 'examDescription',
          populate:{
            path:'examType'
          }
        })
        .populate({
          path: 'testQuestions',
          populate:{
            path:'questionGroup',
            populate:{
              path:'answers'
            }
          }
        })
        .populate({
          path: 'testQuestions',
          populate:{
            path:'answerGiven'
          },
        })
        .populate({
          path: 'testQuestions',
          populate:{
            path:'correctAnswer'
          },
        })
        .populate('examResults')
        .exec()
        .then((res) => {
          return res;
        }).catch(handleError);
  },



};

export default ExamResultController;