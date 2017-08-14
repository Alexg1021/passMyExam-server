'use strict';

// const models = require('../models');
import _ from 'lodash';
import path from 'path';
import Order from '../models/order';
import Promo from '../models/promo';
import mongoose from 'mongoose';
import q from 'q';
import async from 'async';
import uuid from 'uuid';
import Emailer from '../mailer/mailer';
import moment from 'moment';
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
            totalAmount:bundle.price / 100,
            examDescription: bundle.examDescription._id
          });

         if(bundle.promo){
           newOrder.promo.push(bundle.promo._id);
         }

          return newOrder.save()
              .then((ord)=>{

                let orderOptions = {
                  order:ord,
                  examDescription:bundle.examDescription,
                  user:bundle.user,
                  paymentOptions:data.source,
                  totalPaid:bundle.price / 100
                };


                if(bundle.promo){
                  orderOptions.promo = bundle.promo;
                }
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

  },

  completePayPalTransaction: function completePayPalTransaction (req){

    let orderId = uuid.v4().split('-').pop();
    let bundle = req.body;
    bundle.orderId = orderId;
    let user = bundle.user;
    bundle.user = bundle.user._id;

    let newOrder = new Order(bundle);

    if(bundle.promo){
      newOrder.promo.push(bundle.promo._id);
    }

    return newOrder.save()
        .then((ord)=>{

          let orderOptions = {
            order:ord,
            examDescription:bundle.examDescription,
            user:user,
            paymentOptions:bundle.source,
            totalPaid: bundle.totalAmount
          };

          if(bundle.promo){
            orderOptions.promo = bundle.promo;
          }
          // console.log('the order options', orderOptions);
          return Emailer.purchaseConfirmation(orderOptions)
              .then((res)=>{

                return ord;
              }, (err)=>{
                let newErr = {status: err.statusCode, type: err.type, message: err.message, error:true};
                return newErr;
              });
        },(err)=>{
      let newErr = {status: err.statusCode, type: err.type, message: err.message, error:true};
      return newErr;
    });



  //  make the request to use paypal
  //  Send back the id for success

  },

  createPromo: function createPromo(req){

    let promo = new Promo(req.body);

    return promo.save()
        .then((pro)=>{
          return pro;
        }, (err)=>{
          let newErr = {status: err.statusCode, type: err.type, message: err.message, error:true};
          return newErr;
        });
  },

  checkPromoCode: function checkPromoCode(req){
    let today = moment();

    return Promo.findOne({code:req.body.code})//new RegExp to check for lower or uppercase
        .exec()
        .then((promo)=>{

          if(!promo){

            let badPromo = {code:null, error: true, message:'The promotion code you have entered is invalid. Please verify the code and try again.'};
            return badPromo;

          }else if(promo.expiration && today > promo.expiration){

            let badPromo = {code:promo.code, error: true, message:'The promotion code you have entered has expired. Please use a different code.'};
            return badPromo;

          }else{
            return promo;
          }
        }, (err)=>{
          let newErr = {status: err.statusCode, type: err.type, message: err.message, error:true};
          return newErr;
        })
  },



};

export default OrderController;