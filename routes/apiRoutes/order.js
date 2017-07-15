"use strict";

import express from 'express';
import OrderController from '../../controllers/order.controller';
import fs from 'fs';

const router = express.Router();

router.route('/')
    .get((req, res)=>{
      OrderController.getAll()
          .then((data)=>{
            res.json(data);
          }, (err) => {
            res.json(err)
          });
    })
    .post((req, res) => {
      OrderController.create(req)
          .then((data) => {
            res.json(data);
          },(err) =>{
            res.json(err);
          });
    });

router.route('/:id')
    .get((req, res) => {
      OrderController.findById(req).then((data)=>{
        res.json(data);
      }, (err) => {
        res.json(err);
      })
    })
    .put((req, res) => {
      OrderController.update(req)
          .then((data) => {
            res.json(data);
          }, (err) => {
            res.json(err);
          })
    })
    .delete((req, res) => {
      OrderController.destroy(req)
          .then((data) => {
            res.json(data);
          }, (err) => {
            res.json(err);
          });
    });

router.route('/send-payment')
    .post((req, res)=>{
      OrderController.sendPayment(req)
          .then((data) => {
            if (data.error) {
              res.json(data);
              res.status(data.status);
            }else{
              res.json(data);
            }
          });
    });

router.route('/request-paypal')
    .post((req, res)=>{
      OrderController.completePayPalTransaction(req)
          .then((data)=>{
            if(data.error){
              res.json(data);
              res.status(data.status);
            }else{
              res.json(data);
            }
          })
    });

export default router;