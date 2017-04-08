'use strict';

// const models = require('../models');
import _ from 'lodash';
import path from 'path';
import Exam from '../models/exam';
import QuestionGroup from '../models/question-group';
import TestQuestionController from '../controllers/test-question.controller';
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


  generateNewExam: function generateNewExam(req) {
    //Load the required Exam with the examDescription
    return Exam.findOne({_id: req.params.id})
        .populate('examDescription')
        .exec()
        .then((exam) => {
          //return question groups based on their examDesc matching the exam.examDesc._id
          return QuestionGroup.find({examDescription: exam.examDescription._id})
              .then((questions)=>{
              //  Array of questions returned
              //  loop through questions and push each one into exam.questionGroup array until counter stops
                let testQuestions = [];
                for(var i = 0; i < exam.examDescription.totalQuestions; i++){
                  let testQuestion = {
                    questionGroup:questions[i]._id,
                    correctAnswer:questions[i].correctAnswer,
                  };
                  testQuestions.push(testQuestion);
                }
                return TestQuestionController.create(testQuestions)
                    .then((tqs)=>{
                      console.log('the tqs....', tqs);
                      tqs.forEach((tq)=>{
                        exam.testQuestions.push(tq._id);
                      });
                      return exam.update(exam)
                          .then((res)=>{
                            console.log('the res.....', res);
                            return res;
                          });
                    });

              });

        }).catch(handleError)
  },

};

export default ExamController;