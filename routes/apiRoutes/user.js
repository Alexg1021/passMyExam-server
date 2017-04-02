"use strict";

import express from 'express';
import UserController from '../../controllers/user.controller';
import jwt from 'jsonwebtoken';

import fs from 'fs';

const router = express.Router();

router.route('/')
    .get((req, res)=>{
      UserController.getAll()
          .then((data)=>{
            res.json(data);
          }, (err) => {
            res.json(err)
          });
    })
    .post((req, res) => {
      UserController.create(req)
          .then((data) => {
            res.json(data);
          },(err) =>{
            res.json(err);
          });
    });

router.route('/:id')
    .get((req, res) => {
      UserController.findById(req).then((data)=>{
        res.json(data);
      }, (err) => {
        res.json(err);
      })
    })
    .put((req, res) => {
      UserController.update(req)
          .then((data) => {
            res.json(data);
          }, (err) => {
            res.json(err);
          })
    })
    .delete((req, res) => {
      UserController.destroy(req)
          .then((data) => {
            res.json(data);
          }, (err) => {
            res.json(err);
          });
    });

router.route('/reset-password')
    .post((req, res)=> {
      UserController.resetPassword(req)
          .then((data)=> {
            res.json(data)
          }, (err)=> {
            res.json(err);
          })
    });


router.route('/confirm-email/:id')
    .put((req, res)=> {
      UserController.confirmEmail(req)
          .then((data)=> {
            res.json({
              token: jwt.sign(req.body, process.env.JWT_SECRET)
            });
            res.sendStatus(200);
          }, (err)=> {
            res.json(err);
          })
    });


//route for saving purchased exams
router.route('/purchase-exam/:id')
    .put((req, res)=> {
      UserController.purchaseExam(req)
          .then((data)=> {
            res.json(data);
          }, (err)=> {
            res.json(err);
          })
    });

export default router;