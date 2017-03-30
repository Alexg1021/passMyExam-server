'use strict';

// const models = require('../models');
import _ from 'lodash';
import path from 'path';
// const User = models.default.User;
import User from '../models/user';
import mongoose from 'mongoose';
import q from 'q';
import Encryption from '../encryption/password-encryption';

mongoose.Promise = Promise;

function handleError(err) {
  console.log('inside handleError');
  return err;
}

function validPassword(pass){
  let re = new RegExp("^(?=.*[A-Za-z])(?=.*\d)([a-zA-Z0-9]){8,15}$");
  return !!re.test(pass);
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

  create: function create(req, res) {
    const email = req.body.email;
    const password = req.body.password;

    //Grab the email and check to see if it does not already exist
    return User.findOne({email: email})
        .exec()
        .then((isUser)=>{
          let errObject = {message: null, valid: null};
          if(isUser){
            errObject = {valid:false, message: 'A user by this email already exists!'};
            return errObject;
          }
          //Grab the password and validate it to make sure it has the right characters
          else if(validPassword(password) == false){
            errObject = {valid:false, message: 'The password does not contain the valid characters'};
            return errObject;
          }else{
            //if it passes then encrypt the password
            Encryption.encrypt(password)
                .then((hash)=>{
                  console.log('hashed pass: ', hash);
                  let newUser = {email: email, password: hash};
                  let user = new User(newUser);

                  user.save(function(err){
                    console.log(err);
                    console.log('saved user');
                    return errObject;
                  })
                });
          }
        });
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


  findByEmail: function findByEmail(req) {
    return User.findOne({email: req.email})
        .select('+password')
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