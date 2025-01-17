'use strict';

// const models = require('../models');
import _ from 'lodash';
import path from 'path';
import Exam from '../models/exam';
import ExamResult from '../models/exam-result';
import QuestionGroup from '../models/question-group';
import TestQuestionController from '../controllers/test-question.controller';
import mongoose from 'mongoose';
import q from 'q';
import moment from 'moment';

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

  beginExam: function beginExam(req) {
    let exam = req.body;
    exam.active = true;
    exam.startTime = new Date();
    exam.endTime = moment(exam.startTime).add(exam.examDescription.timeAllowed[0], 'm').add(2,'s');

    // moment(oldDateObj).add(30, 'm');
    return Exam.findOne({_id: req.params.id})
        .exec()
        .then((ex) => {
          return ex.update(exam)
              .then((res) => {
                return Exam.findOne({_id:exam._id})
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
                    .then((updatedExam)=>{
                      return updatedExam;
                    })
              })
        }).catch(handleError);
  },


  generateNewExam: function generateNewExam(req) {
    //Load the required Exam with the examDescription
    return Exam.findOne({_id: req.params.id})
        .populate('examDescription')
        .exec()
        .then((exam) => {
          //return question groups based on their examDesc matching the exam.examDesc._id
          return QuestionGroup.find({examType: exam.examDescription.examType})
              .then((questions)=>{
              //  Array of questions returned
              //  loop through questions and push each one into exam.questionGroup array until counter stops
                //randomize the questions array with lodash shuffle function
                questions = _.shuffle(questions);

                let testQuestions = [];
                for(var i = 0; i < exam.examDescription.totalQuestions; i++){
                  let testQuestion = {
                    questionNumber:i + 1,
                    exam:exam._id,
                    questionGroup:questions[i]._id,
                    correctAnswer:questions[i].correctAnswer,
                  };
                  testQuestions.push(testQuestion);
                }
                return TestQuestionController.create(testQuestions)
                    .then((tqs)=>{
                      tqs.forEach((tq)=>{
                        exam.testQuestions.push(tq._id);
                      });
                      return exam.update(exam)
                          .then((res)=>{
                            return Exam.findOne({_id:exam._id})
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
                                .then((pmeExam)=>{
                                  return pmeExam;
                                });
                          });

                    });

              });

        }).catch(handleError)
  },

  saveAndSubmit: function saveAndSubmit(req) {
    return Exam.findOne({_id: req.params.id})
        .populate('testQuestions')
        .populate('examDescription')
        .exec()
        .then((exam) => {
          //Calculate results for the completed exam
          let answeredQs = [],
              answeredCorrectly=[];
          exam.testQuestions.forEach((tq)=>{
            if(tq.answered){
              answeredQs.push(tq);
              if(tq.answeredCorrectly){
                answeredCorrectly.push(tq);
              }
            }
          });
          let examResult={
            exam: exam._id,
            answeredQuestions:answeredQs.length,
            totalQuestions:exam.examDescription.totalQuestions,
            answeredCorrectly:answeredCorrectly.length,
            answeredIncorrectly:answeredQs.length - answeredCorrectly.length
          };

          //Then create and save the exam results
          examResult = new ExamResult(examResult);
          return examResult.save(examResult)
              .then((examRes)=>{
                //return the exam results _id and save to the exam
                exam.endTime = new Date();
                exam.completed = true;
                exam.active = false;
                exam.examResults = examRes._id;
                return exam.update(exam)
                    .then((res)=>{
                      return res;
                    });
              });
        }).catch(handleError);
  },

  getExamResults: function getExamResults(req) {
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
        .populate('examResults')
        .exec()
        .then((res) => {
          return res;
        }).catch(handleError);
  },

};

export default ExamController;