'use strict';

// const models = require('../models');
import _ from 'lodash';
import path from 'path';
import QuestionGroup from '../models/question-group';
import Answer from '../models/answer';
import mongoose from 'mongoose';
import q from 'q';
import AnswerController from '../controllers/answer.controller';

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
    // const dfrd = q.defer();
    let answers = req.body.answers;

    req.body.answers = [];

    let questionGroup = new QuestionGroup(req.body);

    return questionGroup.save()
        .then((question)=> {
          //  After saving question loop through answers add questionId to assocate it to an answer
          answers.forEach((a)=>{
            a.questionGroup = question._id;
          });

         // Send Answers array to create in bulk
         //  console.log('question...', questionGroup);
         return AnswerController.create(answers)
              .then((res)=> {

                //After Saving Answers set correct answer id to questionGroup
                let correctAnswer = _.find(res, {correctAnswer: true});

                //Push each answerId into the answers array
                res.forEach((o)=>{
                  question.answers.push(o._id);
                });

                //Set correct answer on questionGroup
                question.correctAnswer = correctAnswer._id;


                //update the question with the answers array and correct answer
                return question.save()
                    .then((response)=> {
                      //Send final response to client
                      return response;
                    });
              });

        }).catch(handleError);
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
          return QuestionGroup.remove()
              .then((res)=>{
                return res;
              })
        }).catch(handleError)
  },

  findExamTypeQuestions:function findExamTypeQuestions(req){
    return QuestionGroup.find({examType:req.params.examTypeId})
        .populate('answers')
        .exec()
        .then((questions)=>{
          return questions;
        })
        .catch(handleError);
  }

};

export default QuestionGroupController;