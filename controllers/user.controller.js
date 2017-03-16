'use strict';

// const models = require('../models');
import _ from 'lodash';
import path from 'path';
// const User = models.default.User;
import User from '../models/user';
import mongoose from 'mongoose';
import q from 'q';

mongoose.Promise = Promise;

function handleError(err) {
  return err;
}

const UserController = {

  getAll: function getAll() {
    return User.find()
        .exec()
        .then((res) => {
          return res;
        })
        .catch(handleError);
  },

  create: function create(req) {
    const dfrd = q.defer();
    const user = new User(req.body);

    user.save(function (err){
      if (err) return dfrd.reject(err);
      dfrd.resolve(user);
      });
    return dfrd.promise;
  },

  findById: function findById(req) {
    return User.findOne({_id: req.params.id})
        .exec()
        .then((res) => {
          return res;
        }).catch(handleError);
  },

  update: function update(req) {
    return User.findOne({_id: req.params.id})
        .exec()
        .then((User) => {
          return User.update(req.body)
              .then((res) => {
                return res;
              })
        }).catch(handleError);
  },

  destroy: function destroy(req) {
    return User.findOne({_id: req.params.id})
        .exec()
        .then((User) => {
          return User.update({'deletedAt': new Date()})
              .then((res)=>{
                return res;
              })
        }).catch(handleError)
  },

};

export default UserController;