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
    return ExamDescription.find({deletedAt:null, "isActive":true})
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

  // updateExamDescription:function updateExamDescription(req){
  //   let newPrimaryImage = req.body.newImage;
  //   console.log(newPrimaryImage);
  //   return new Promise((resolve)=> {
  //     return ExamDescription.findOne({_id:req.params.id})
  //         .exec()
  //         .then((description)=>{
  //           if (newPrimaryImage) {
  //             return photoUploader(newPrimaryImage, ({err, versions})=> {
  //               if (err) {
  //                 return err;
  //               } else {
  //                 let thumb = _.find(versions, {"suffix": '-thumb'});
  //                 let original = _.find(versions, {"original": true});
  //                 let medium = _.find(versions, {"suffix": "-medium"});
  //
  //                 description.image = {
  //                   thumb: thumb.url,
  //                   medium: medium.url,
  //                   original: original.url
  //                 };
  //                 return description.update(description)
  //                     .then((res)=>{
  //                       resolve(res);
  //                     });
  //               }
  //             })
  //           }else{
  //             return description.update(description)
  //                 .then((res)=>{
  //                   resolve(res);
  //                 })
  //           }
  //         });
  //   });
  // },
  //

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

  getFeaturedExams:function getFeaturedExams(req){
    return ExamDescription.find({'featured':true})
        .populate({path: 'examType', populate:{path: 'industry'}})
        .sort({createdAt:-1})
        .exec()
        .then((exams)=>{
          return exams;
        }).catch(handleError);
  }

};

export default ExamDescriptionController;