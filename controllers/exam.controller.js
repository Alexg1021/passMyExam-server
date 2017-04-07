'use strict';

// const models = require('../models');
import _ from 'lodash';
import path from 'path';
import Exam from '../models/exam';
import QuestionGroup from '../models/question-group';
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
        .populate('questionGroups')
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
                for(var i = 0; i < exam.examDescription.totalQuestions; i++){
                  console.log('inside the loop ', i);
                  exam.questionGroups.push(questions[i]._id);
                }

                //Save the exam with the appended test questions
                return exam.save()
                    .then((res)=>{
                      return res;
                    })
              })

        }).catch(handleError)
  },

};

export default ExamController;