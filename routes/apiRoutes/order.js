"use strict";

import express from 'express';
import OrderController from '../../controllers/order.controller';
import fs from 'fs';
var stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

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
    .post((req, res)=> {

      let stripeToken = req.body.token.id;

      let charge = stripe.charges.create({
        amount: req.body.price, // amount in cents, again
        currency: "usd",
        card: stripeToken,
        description: `Charge for ${req.body.user.email}`
      }, (err, charge)=> {
        if (err) {
          res.json({status: err.statusCode, type: err.type, message: err.message});
        }else{
          res.json(charge);
        }

      });
});

export default router;