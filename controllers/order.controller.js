'use strict';

// const models = require('../models');
import _ from 'lodash';
import path from 'path';
import Answer from '../models/answer';
import mongoose from 'mongoose';
import q from 'q';
import async from 'async';

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

  sendPayment: function sendPayment(){

  }

};

export default OrderController;