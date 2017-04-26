"use strict";

import express from 'express';
import ExamController from '../../controllers/exam.controller';
import fs from 'fs';

const router = express.Router();

router.route('/')
    .get((req, res)=>{
      ExamController.getAll()
          .then((data)=>{
            res.json(data);
          }, (err) => {
            res.json(err)
          });
    })
    .post((req, res) => {
      ExamController.create(req)
          .then((data) => {
            res.json(data);
          },(err) =>{
            res.json(err);
          });
    });

router.route('/:id')
    .get((req, res) => {
      ExamController.findById(req).then((data)=>{
        res.json(data);
      }, (err) => {
        res.json(err);
      })
    })
    .put((req, res) => {
      ExamController.update(req)
          .then((data) => {
            res.json(data);
          }, (err) => {
            res.json(err);
          })
    })
    .delete((req, res) => {
      ExamController.destroy(req)
          .then((data) => {
            res.json(data);
          }, (err) => {
            res.json(err);
          });
    });

//route for populating an exam with test questions
router.route('/begin-exam/:id')
    .put((req, res)=> {
      ExamController.beginExam(req)
          .then((data)=> {
            res.json(data);
          }, (err)=> {
            res.json(err);
            res.status(400);
          })
    });

//route for populating an exam with test questions
router.route('/generate-new-exam/:id')
    .put((req, res)=> {
      ExamController.generateNewExam(req)
          .then((data)=> {
            res.json(data);
          }, (err)=> {
            res.json(err);
            res.status(400);
          })
    });


//route for saving, submitting and generating exam results
router.route('/save-and-submit/:id')
    .put((req, res)=> {
      ExamController.saveAndSubmit(req)
          .then((data)=> {
            res.json(data);
          }, (err)=> {
            res.json(err);
            res.status(400);
          })
    });

//route for saving, submitting and generating exam results
router.route('/get-exam-results/:id')
    .get((req, res)=> {
      ExamController.getExamResults(req)
          .then((data)=> {
            res.json(data);
          }, (err)=> {
            res.json(err);
            res.status(400);
          })
    });


export default router;