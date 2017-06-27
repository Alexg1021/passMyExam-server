"use strict";

import express from 'express';
import UserController from '../../controllers/user.controller';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import bcrypt from 'bcrypt-nodejs';
const Encryption = require('../../encryption/password-encryption.js');
import User from '../../models/user';
import Mailgun from 'mailgun-js';
const router = express.Router();
const saltRounds = bcrypt.genSalt(10, (err, result)=>{
  return result;
});

function validPassword(pass){
  let re = new RegExp("^(?=.*[0-9])(?=.*[A-Za-z])[a-zA-Z0-9!@#$%^&*]{8,15}");
  return !!re.test(pass);
}

 function check(secretText, hash) {
   // Load hash from your password DB.
   bcrypt.compare(secretText, hash, (err, callback)=> {
     console.log('error', err);
     console.log('success', callback);
     return callback;
   });
 }


router.post('/login', (req, res) => {
  UserController.findByEmail(req.body)
      .then((user) => {
        if (user != null) {
          let hashedPassword = user.password;
          //current users hashed password

          if (user.isActive) {
            // login as normal
            // check if the password from request matches the encrypted hashedPassword

            bcrypt.compare(req.body.password, hashedPassword, (err, resp)=>{
              if (resp) {
                // let userName = user.firstName + ' ' + user.lastName;
                var data = {
                  firstName: user.firstName,
                  lastName: user.lastName,
                  _id: user._id,
                  isAdmin: user.isAdmin,
                  emailConfirmed:user.emailConfirmed,
                  email: user.email
                };

                res.json({
                  token: jwt.sign(data, process.env.JWT_SECRET)
                });
              } else {
                res.json({status: 400, error: 'Authentication error!'});
                res.sendStatus(400);
              }
            });
          } else {
            // user is not activated.
            res.json({
              status: 400,
              error: 'User is no longer Active. Please contact Pass-myExam to correct the issue!'
              // resetPath:`/password-reset?hash=${hashedPassword}`
            });
            res.sendStatus(400);
          }
        } else {
          //Authentication Error: trouble logging in
          res.json({status: 400, error: 'Authentication error! The user credentials were not found! Please try again.'});
          res.sendStatus(400);
        }
      }, (err) => {
        res.json(err);
      })
});

router.post('/new-user', (req, res) =>{

  const password = req.body.password;
  const email = req.body.email;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const userName = req.body.userName;


  return User.findOne({email: email})
      .then((isUser)=>{
        if(isUser){
          res.json({status: 400, data:'A user by this email already exists!', error: 'email'});
          res.sendStatus(400);
        }else {
          return User.findOne({userName: userName})
              .then((hasUserName)=>{
                if(hasUserName){
                  res.json({status: 400, data:'This username already exists! Please choose a different username.', error: 'userName'});
                  res.sendStatus(400);
                }else{

                  bcrypt.hash(password, saltRounds, null, (err, hash)=>{
                    console.log('the error', err);
                    console.log('the new hash', hash);

                    let user = new User({
                      email: email,
                      password: hash,
                      firstName: firstName,
                      lastName: lastName,
                      userName: userName
                    });
                    return user.save(function (data) {

                      // let userName = user.firstName + ' ' + user.lastName;
                      let newUser = {
                        firstName: user.firstName,
                        lastName: user.lastName,
                        userName: userName,
                        _id: user._id,
                        isAdmin: user.isAdmin,
                        emailConfirmed: user.emailConfirmed,
                        email: user.email
                      };

                      let mailgun = new Mailgun({apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN});

                      let sendData = {
                        //Specify email data
                        from: 'myexam.pe@gmail.com',
                        //The email to contact
                        to: user.email,
                        //Subject and text data
                        subject: 'Action Required: Confirm Your Account',
                        html: `Thanks for registering!<br/><br/> Please confirm your email ${user.email} by clicking the link below.  Best of luck on your Professional Engineering Exams and welcome to Pass-MyExam.<br/><a href="http://localhost:8080/#/dashboard">Click here to verify your account</a><br/><br/>Sincerely,<br/>The Pass-MyExam Team`
                      };
                      //Invokes the method to send emails given the above data with the helper library
                      mailgun.messages().send(sendData, function (err, body) {

                        if (err) {
                          res.render('error', {error: err});
                        }
                        else {
                          res.json({
                            token: jwt.sign(newUser, process.env.JWT_SECRET)
                          });
                        }
                      });
                    }, function (err) {
                      res.json({status: 500, error: `There was an error saving the user: ${err}`});
                      res.status(500);
                    });


                  });


                //   /******Current Encryptoin Method******/
                //   Encryption.encrypt(password)
                //       .then((hash)=> {
                //
                //
                //         let user = new User({
                //           email: email,
                //           password: hash,
                //           firstName: firstName,
                //           lastName: lastName,
                //           userName: userName
                //         });
                //         return user.save(function (data) {
                //
                //           // let userName = user.firstName + ' ' + user.lastName;
                //           let newUser = {
                //             firstName: user.firstName,
                //             lastName: user.lastName,
                //             userName: userName,
                //             _id: user._id,
                //             isAdmin: user.isAdmin,
                //             emailConfirmed: user.emailConfirmed,
                //             email: user.email
                //           };
                //
                //           let mailgun = new Mailgun({apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN});
                //
                //           let sendData = {
                //             //Specify email data
                //             from: 'myexam.pe@gmail.com',
                //             //The email to contact
                //             to: user.email,
                //             //Subject and text data
                //             subject: 'Action Required: Confirm Your Account',
                //             html: `Thanks for registering!<br/><br/> Please confirm your email ${user.email} by clicking the link below.  Best of luck on your Professional Engineering Exams and welcome to Pass-MyExam.<br/><a href="http://localhost:8080/#/dashboard">Click here to verify your account</a><br/><br/>Sincerely,<br/>The Pass-MyExam Team`
                //           };
                //           //Invokes the method to send emails given the above data with the helper library
                //           mailgun.messages().send(sendData, function (err, body) {
                //
                //             if (err) {
                //               res.render('error', {error: err});
                //             }
                //             else {
                //               res.json({
                //                 token: jwt.sign(newUser, process.env.JWT_SECRET)
                //               });
                //             }
                //           });
                //         }, function (err) {
                //           res.json({status: 500, error: `There was an error saving the user: ${err}`});
                //           res.status(500);
                //         });
                //
                //
                //       });
                //
                // /******Current Encryptoin Method******/


                }
              })
        }
      });
});

router.get('/logout', (req, res) => {
  req.logout();
  res.sendStatus(200);
});

router.route('/forgot-password')
    .post((req, res)=> {
      UserController.sendPasswordResetEmail(req)
          .then((data)=> {
            if(data.status != 200){
              res.json(data);
              res.sendStatus(400);
            }else{
              res.json(data);
            }
          })
    });

router.route('/reset-password')
    .post((req, res)=> {
      UserController.resetPassword(req)
          .then((data)=> {
            if(data.status != 200){
              res.json(data);
              res.sendStatus(400);
            }else{
              res.json(data);
            }
          })
    });

//router.get('/refresh', jwt.protect, function (req, res) {
//  UserController.refreshToken(req.current_user.dataValues).then(function (user) {
//    res.json({
//      user: user,
//      token: jwt.sign(user)
//    });
//  }, function (err) {
//    res.json(err);
//  });
//});


/******Current Method********/
// Encryption.check(req.body.password, hashedPassword)
//    .then((resp) => {
//      console.log(resp);
//   if (resp) {
//     // let userName = user.firstName + ' ' + user.lastName;
//     var data = {
//       firstName: user.firstName,
//       lastName: user.lastName,
//       _id: user._id,
//       isAdmin: user.isAdmin,
//       emailConfirmed:user.emailConfirmed,
//       email: user.email
//     };
//
//     res.json({
//       token: jwt.sign(data, process.env.JWT_SECRET)
//     });
//   } else {
//     res.json({status: 400, error: 'Authentication error!'});
//     res.sendStatus(400);
//   }
// });
//
/******Current Method********/

export default router;