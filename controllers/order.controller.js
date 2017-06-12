'use strict';

// const models = require('../models');
import _ from 'lodash';
import path from 'path';
import Order from '../models/order';
import mongoose from 'mongoose';
import q from 'q';
import async from 'async';
import uuid from 'uuid';
import Emailer from '../mailer/mailer';
var stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

mongoose.Promise = Promise;

function handleError(err) {
  return err;
}

const OrderController = {

  getAll: function getAll() {
    return Order.find()
        .exec()
        .then((res) => {
          return res;
        })
        .catch(handleError);
  },

  create: function create(orders) {
    const dfrd = q.defer();

    async.map(orders, function (order, callback){
      var ans = new Order(order);

      ans.save(function(err){
        if(err) return dfrd.reject(err);
        callback(null, ans);
      });
    }, function (err, result){
      if(err) return dfrd.reject(err);
      dfrd.resolve(result);
    });
    return dfrd.promise;
  },

  findById: function findById(req) {
    return Order.findOne({_id: req.params.id})
        .populate('user')
        .populate('examDescription')
        .exec()
        .then((res) => {
          return res;
        }).catch(handleError);
  },

  update: function update(req) {
    return Order.findOne({_id: req.params.id})
        .exec()
        .then((Order) => {
          return Order.update(req.body)
              .then((res) => {
                return res;
              })
        }).catch(handleError);
  },

  updateOrders:function updateOrders(orders){
    const dfrd = q.defer();
    return new Promise((resolve)=>{
      orders.map((order)=>{
        return Order.findOne({_id:order._id})
            .then((ord)=>{
              return ord.update(order)
                  .then((res)=>{
                    return res;
                  })
            })
      });
      resolve(orders);
    });
  },

  destroy: function destroy(req) {
    return Order.findOne({_id: req.params.id})
        .exec()
        .then((Order) => {
          return Order.update({'deletedAt': new Date()})
              .then((res)=>{
                return res;
              })
        }).catch(handleError)
  },

  sendPayment: function sendPayment(req){
    let stripeToken = req.body.token.id;
    let orderId = uuid.v4().split('-').pop();
    let bundle = req.body;

    let order = {
      amount: bundle.price, // amount in cents, again
      currency: "usd",
      card: stripeToken,
      metadata: {'orderId': orderId},
      description: `Charge for ${bundle.user.email}`
    };
    return stripe.charges.create(order)
        .then((data)=>{
            //If successful then should save this as a new order in db and return the orderId
          let newOrder = new Order({
            user:bundle.user._id,
            orderId:orderId,
            source:data.source,
            totalAmount:bundle.price,
            examDescription: bundle.examDescription._id
          });
          return newOrder.save()
              .then((ord)=>{

                let orderOptions = {
                  order:ord,
                  examDescription:bundle.examDescription,
                  user:bundle.user,
                  paymentOptions:data.source
                };
                // console.log('the order options', orderOptions);
                return Emailer.purchaseConfirmation(orderOptions)
                    .then((res)=>{

                      return ord;
                    });
              });
        }, (err)=>{
          let newErr = {status: err.statusCode, type: err.type, message: err.message, error:true};
          return newErr;
        });

  }

};

export default OrderController;