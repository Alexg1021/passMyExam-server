"use strict";

import express from 'express';
import UserController from '../../controllers/user.controller';
import jwt from 'jsonwebtoken';
import User from '../../models/user';
import bcrypt from 'bcrypt-nodejs';

const saltRounds = bcrypt.genSalt(10, (err, result)=>{
  return result;
});

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
    .post((req, res)=> {
      UserController.purchaseExam(req)
          .then((data)=> {
            res.json(data);
          }, (err)=> {
            res.json(err);
          })
    });

//route for saving purchased exams
router.route('/get-my-exams/:id')
    .get((req, res)=> {
      UserController.getMyExams(req)
          .then((data)=> {
            res.json(data);
          }, (err)=> {
            res.json(err);
          })
    });

//route for saving purchased exams
router.route('/get-completed-exams/:id')
    .get((req, res)=> {
      UserController.getCompletedExams(req)
          .then((data)=> {
            res.json(data);
          }, (err)=> {
            res.json(err);
          })
    });


//route for saving purchased exams
router.route('/update-password/:id')
    .put((req, res)=> {
      let creds = req.body;
      return User.findOne({_id:req.params.id})
          .select('+password')
          .exec()
          .then((user)=>{
            console.log('the user', user);
            bcrypt.compare(creds.password, user.password, (err, resp)=>{
              console.log('the resp', resp);
              if (resp){
                bcrypt.hash(creds.newPassword, saltRounds, null, (err, hash)=>{
                  console.log('the hash', hash);
                  user.password = hash;
                  return user.update(user)
                      .then((response)=>{
                        console.log('the response', response);
                        res.json(response);
                      });
                });

              }else{
                res.json({status: 400, error:'The old password does not match our records'});
                res.sendStatus(400);
              }
            })
          });
    });


export default router;