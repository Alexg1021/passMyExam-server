"use strict";

import express from 'express';
import ExamResultController from '../../controllers/exam-result.controller';
import fs from 'fs';

const router = express.Router();

router.route('/')
    .get((req, res)=>{
      ExamResultController.getAll()
          .then((data)=>{
            res.json(data);
          }, (err) => {
            res.json(err)
          });
    })
    .post((req, res) => {
      ExamResultController.create(req)
          .then((data) => {
            res.json(data);
          },(err) =>{
            res.json(err);
          });
    });

router.route('/:id')
    .get((req, res) => {
      ExamResultController.findById(req).then((data)=>{
        res.json(data);
      }, (err) => {
        res.json(err);
      })
    })
    .put((req, res) => {
      ExamResultController.update(req)
          .then((data) => {
            res.json(data);
          }, (err) => {
            res.json(err);
          })
    })
    .delete((req, res) => {
      ExamResultController.destroy(req)
          .then((data) => {
            res.json(data);
          }, (err) => {
            res.json(err);
          });
    });

//Endpoint to return all exam results
router.route('/get-exam-results/:userId')
    .get((req, res) => {
      ExamResultController.getExamResults(req)
          .then((data)=>{
            res.json(data);
          }, (err) => {
            res.json(err);
          })
    });

//Endpoint to return single exam result
router.route('/get-exam-result/:examId')
    .get((req, res) => {
      ExamResultController.getExamResult(req)
          .then((data)=>{
        res.json(data);
      }, (err) => {
        res.json(err);
      })
    });

export default router;