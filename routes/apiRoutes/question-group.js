"use strict";

import express from 'express';
import QuestionGroupController from '../../controllers/question-group.controller';
import fs from 'fs';

const router = express.Router();

router.route('/')
    .get((req, res)=>{
      QuestionGroupController.getAll()
          .then((data)=>{
            res.json(data);
          }, (err) => {
            res.json(err)
          });
    })
    .post((req, res) => {
      QuestionGroupController.create(req)
          .then((data) => {
            res.json(data);
          },(err) =>{
            res.json(err);
            res.status(400);
          });
    });

router.route('/:id')
    .get((req, res) => {
      QuestionGroupController.findById(req).then((data)=>{
        res.json(data);
      }, (err) => {
        res.json(err);
      })
    })
    .put((req, res) => {
      QuestionGroupController.update(req)
          .then((data) => {
            res.json(data);
          }, (err) => {
            res.json(err);
          })
    })
    .delete((req, res) => {
      QuestionGroupController.destroy(req)
          .then((data) => {
            res.json(data);
          }, (err) => {
            res.json(err);
          });
    });

router.route('/exam-type-questions/:examTypeId')
    .get((req, res) => {
      QuestionGroupController.findExamTypeQuestions(req).then((data)=>{
        res.json(data);
      }, (err) => {
        res.json(err);
      })
    });

router.route('/update-question/:questionId')
    .put((req, res) => {
      QuestionGroupController.updateQuestion(req).then((data)=>{
        res.json(data);
      }, (err) => {
        res.json(err);
      })
    });


router.route('/upload-image')
    .post((req, res) => {
      QuestionGroupController.uploadImage(req).then((data)=>{
        res.json(data);
      }, (err) => {
        res.json(err);
      })
    });

export default router;