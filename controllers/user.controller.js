'use strict';

// const models = require('../models');
import _ from 'lodash';
import path from 'path';
// const User = models.default.User;
import User from '../models/user';
import Order from '../models/order';
import Exam from '../models/exam';
import bcrypt from 'bcrypt-nodejs';

import mongoose from 'mongoose';
import q from 'q';
import Encryption from '../encryption/password-encryption';

import ExamController from './exam.controller';
import Emailer from '../mailer/mailer';

const clientURL = process.env.CLIENT_URL;

const saltRounds = bcrypt.genSalt(10, (err, result)=>{
  return result;
});

mongoose.Promise = Promise;

function handleError(err) {
  console.log('inside handleError');
  return err;
}

function validPassword(pass){
  let re = new RegExp("^(?=.*[0-9])(?=.*[A-Za-z])[a-zA-Z0-9!@#$%^&*]{8,15}$");
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
                  let newUser = {email: email, password: hash};
                  let user = new User(newUser);

                  user.save(function(err){
                    return errObject;
                  })
                });
          }
        });
  },

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


  confirmEmail: function confirmEmail(req) {
  return User.findOne({_id: req.params.id})
      .exec()
      .then((User) => {
        return User.update(req.body)
            .then((res) => {
              return res;
            })
      }).catch(handleError);
},


  purchaseExam: function purchaseExam(req) {
    //Create the new exam with examdescriptionId and userId
    //Return the created exam and push the id into the user purchased exams array
    //return the data
    let order = req.body;

    let data = {
      examDescription:order.examDescription,
      user:req.params.id,
      order:order._id
    };
    return ExamController.create(data)
        .then((exam)=>{
          return User.findOne({_id: req.params.id})
              .then((user)=>{
                user.examsPurchased.push(exam._id);
                return user.save()
                    .then((res)=>{
                      return Order.findById({_id: order._id})
                          .then((ord)=>{
                            return ord.update({exam:exam._id})
                                .then((data)=>{
                                  return data;
                                })
                          });
                    })
                    .catch(handleError);
              });
        });

  },

  getMyExams: function getMyExams(req){
    return User.findOne({_id: req.params.id})
        .populate({
          path:'examsPurchased',
          populate:{
            path:'examDescription',
            populate:{
              path:'examType'
            }
          }
        })
        .exec()
        .then((res)=>{
          return res.examsPurchased;
        })
        .catch(handleError);
  },


  getCompletedExams: function getCompletedExams(req){
    return Exam.find({user: req.params.id, completed:true})
        .populate('examResults')
        .populate({
          path:'examDescription',
          populate:{
            path:'examType'
          }
        })
        .sort({endTime:-1})
        .exec()
        .then((res)=>{
          return res;
        })
        .catch(handleError);
  },

  sendPasswordResetEmail:function sendPasswordResetEmail(req){
    return User.findOne({email: req.body.email})
        .select('+password')
        .exec()
        .then((user)=>{
          if (user){
            let hash = user.password;
            // send email to user specifying they should reset password.
            let mailOptions = {
              to: user.email,
              resetUrl:`${clientURL}authentication/reset-password?hash=${hash}`
            };
            return Emailer.sendPasswordResetToken(mailOptions)
                .then((sent)=>{
                  if(sent.error){
                    return {
                      status: 400,
                      error:'error',
                      data: "There was an issue sending your reset password link to the email you provided"
                    };
                  }else {
                    return {
                      status: 200,
                      message: "success",
                      data: "An email has been sent to you to reset your password."
                    };
                  }
                });

          }else{
            return {
              data: 'Reset password error! User not found!',
              status: 400,
              error:'error'
            };
          }
        })
  },

  resetPassword:function resetPassword(req){
    let bundle = req.body;
    return User.findOne({email: req.body.email})
        .select('+password')
        .exec()
        .then((user)=>{
          //Check if user is returned
          if(user){
            //Check if password matches hash
            if(bundle.oldPassHash == user.password){
              //check if the new password is valid
              if(validPassword(bundle.newPassword)){
                //Encrypt the new password
                return Encryption.encrypt(bundle.newPassword)
                    .then((hash)=>{
                      //Update the user with the new hashed password
                      user.password = hash;
                      return user.update(user)
                          .then((res)=>{
                            if(res.error){
                              return {
                                data: 'Reset password error!',
                                status: 400,
                                error:'error'
                              };
                            }else{
                              return {
                                status: 200,
                                message: "success",
                                data: "An email has been sent to you to reset your password."
                              };
                            }
                          });
                    });
              }else{
                return {
                  data: 'Reset password error!',
                  status: 400,
                  error:'error'
                };
              }
            }else{
              return {
                data: 'Reset password error!',
                status: 400,
                error:'error'
              };
            }

          }else{
            return {
              data: 'Reset password error! User not found!',
              status: 400,
              error:'error'
            };
          }
        })
  },

  //Not Being used, the save is happening inside of the route method
  updatePassword:function updatePassword(req){
    console.log('second location');
    return User.findOne({_id:req.params.id})
        .select('+password')
        .exec()
        .then((user)=>{
          console.log('third location');
          let creds = req.body;

            //True moves on to encrypting the new password then saving the updated password
            bcrypt.hash(creds.newPassword, saltRounds, null, (err, hash)=>{

              //update the new user with the new hash
              console.log('the hash', hash);
              if(hash !== user.password){
                User.findByIdAndUpdate(user._id, {$set: {password: hash}}, {new: false}, (err, res)=>{
                  console.log(' the res to go,', res);
                  return res;
                });
              }else{
                return {error: 'ERROR!'};
              }
            });
        });
  }

};

export default UserController;