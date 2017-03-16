"use strict";

import express from 'express';
import ExamTypeController from '../../controllers/exam-type.controller';
import fs from 'fs';

const router = express.Router();

router.route('/')
    .get((req, res)=>{
      ExamTypeController.getAll()
          .then((data)=>{
            res.json(data);
          }, (err) => {
            res.json(err)
          });
    })
    .post((req, res) => {
      ExamTypeController.create(req)
          .then((data) => {
            res.json(data);
          },(err) =>{
            res.json(err);
          });
    });

router.route('/:id')
    .get((req, res) => {
      ExamTypeController.findById(req).then((data)=>{
        res.json(data);
      }, (err) => {
        res.json(err);
      })
    })
    .put((req, res) => {
      ExamTypeController.update(req)
          .then((data) => {
            res.json(data);
          }, (err) => {
            res.json(err);
          })
    })
    .delete((req, res) => {
      ExamTypeController.destroy(req)
          .then((data) => {
            res.json(data);
          }, (err) => {
            res.json(err);
          });
    });
export default router;