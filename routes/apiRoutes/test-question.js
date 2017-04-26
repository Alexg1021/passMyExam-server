"use strict";

import express from 'express';
import TestQuestionController from '../../controllers/test-question.controller';
import fs from 'fs';

const router = express.Router();

router.route('/')
    .get((req, res)=>{
      TestQuestionController.getAll()
          .then((data)=>{
            res.json(data);
          }, (err) => {
            res.json(err)
          });
    })
    .post((req, res) => {
      TestQuestionController.create(req)
          .then((data) => {
            res.json(data);
          },(err) =>{
            res.json(err);
            res.status(400);
          });
    });

router.route('/:id')
    .get((req, res) => {
      TestQuestionController.findById(req).then((data)=>{
        res.json(data);
      }, (err) => {
        res.json(err);
      })
    })
    .put((req, res) => {
      TestQuestionController.update(req)
          .then((data) => {
            res.json(data);
          }, (err) => {
            res.json(err);
          })
    })
    .delete((req, res) => {
      TestQuestionController.destroy(req)
          .then((data) => {
            res.json(data);
          }, (err) => {
            res.json(err);
          });
    });


router.route('/get-exam-question/:questionId')
    .put((req, res) => {
      TestQuestionController.getTestQuestion(req)
          .then((data)=>{
        res.json(data);
      }, (err) => {
        res.json(err);
      })
    });

router.route('/save-test-answer/:questionId')
    .put((req, res) => {
      TestQuestionController.saveTestAnswer(req)
          .then((data)=>{
            res.json(data);
          }, (err) => {
            res.json(err);
          })
    });

router.route('/flag-question/:questionId')
    .put((req, res) => {
      TestQuestionController.flagQuestion(req)
          .then((data)=>{
            res.json(data);
          }, (err) => {
            res.json(err);
          })
    });



export default router;