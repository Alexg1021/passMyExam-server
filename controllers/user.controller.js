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

  /**
  create: function create(req) {
    let bundle = req.body;
    const email = bundle.email;
    const password = bundle.password;
    const employeeId = bundle.employeeId;
    return Encryption.encrypt(password).then((hash) => {
      let user = {
        email: email,
        password: hash,
        employeeId: employeeId,
        isActivated: false // initially set to false
      };
      // create a user with the encrypted hash as password
      return User.create(user)
          .then((res) => {
            // send email to user specifying they should reset password.
            let text = `Password reset.`,
                html = `Password reset. Go to ${clientURL}/#/password-reset?hash=${hash} to reset password.`; //auth == hash
            Emailer.send(`${testEmail}`, 'Password Reset', text, html); // replace testEmail with email
            // also include the hash as verification
            return res;
          }).catch(handleError);
    });
  },
   **/

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