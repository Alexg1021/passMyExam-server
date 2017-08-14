"use strict";

import express from 'express';
import UserController from '../../controllers/user.controller';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import bcrypt from 'bcrypt-nodejs';
const Encryption = require('../../encryption/password-encryption.js');
import User from '../../models/user';
import Mailgun from 'mailgun-js';
import moment from 'moment';
const router = express.Router();
const saltRounds = bcrypt.genSalt(10, (err, result)=>{
  return result;
});


function checkExpiration (time) {
  return moment().isBefore(time);
}

function validPassword(pass){
  let re = new RegExp("^(?=.*[0-9])(?=.*[A-Za-z])[a-zA-Z0-9!@#$%^&*]{8,15}$");
  return !!re.test(pass);
}

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
                res.send({status: 400, error:'Password does not match'});
                res.statusCode = 400;
                // res.json({status: 400, error: 'Authentication error!'});

              }
            });
          } else {
            // user is not activated.
            res.send({
              status: 400,
              error: 'User is no longer Active. Please contact Pass-myExam to correct the issue!'
              // resetPath:`/password-reset?hash=${hashedPassword}`
            });
            res.statusCode = 400;
          }
        } else {
          //Authentication Error: trouble logging in
          res.send({status: 400, error: 'Authentication error! The user credentials were not found! Please try again.'});
          res.statusCode = 400;
        }
      }, (err) => {
        res.send({status: 400, error:'Authentication Error!'});
        res.statusCode = 400;
      })
});

router.post('/new-user', (req, res) =>{

  const password = req.body.password;
  const email = req.body.email;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const userName = req.body.userName;


  return User.findOne({email: new RegExp(email, 'i')})
      .then((isUser)=>{
        if(isUser){
          res.send({status: 400, data:'A user by this email already exists!', error: 'email'});
          res.statusCode = 400;
        }else {
          return User.findOne({userName: new RegExp(userName, 'i')})
              .then((hasUserName)=>{
                if(hasUserName){
                  res.send({status: 400, data:'This username already exists! Please choose a different username.', error: 'userName'});
                  res.statusCode = 400;
                }else{

                  bcrypt.hash(password, saltRounds, null, (err, hash)=>{

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
                        subject: 'Thanks for registering!',
                        html: `Hello ${newUser.firstName} ${newUser.lastName},<br/><br/> Your new account has been created! You can begin using our application at 
                    <a href="${process.env.CLIENT_URL}">${process.env.CLIENT_URL}</a>. Best of luck on your Professional Engineering Exams and welcome to Pass-MyExam.<br/><br/>
                    Sincerely,<br/>The Pass-MyExam Team<br/><br/>
                    <small style="font-style: italic;">If you feel you have received this email by mistake please contact us at immediately myexam.pe@gmail.com. Thank you.</small>`
                      };

                      //Verify Account with this
                      //<a href="${process.env.CLIENT_URL}dashboard">Click here to verify your account</a>

                      //Invokes the method to send emails given the above data with the helper library
                      mailgun.messages().send(sendData, function (err, body) {
                        if (err) {
                          console.log('error', err);
                          res.json({
                            token: jwt.sign(newUser, process.env.JWT_SECRET)
                          });
                        }
                        else {
                          res.json({
                            token: jwt.sign(newUser, process.env.JWT_SECRET)
                          });
                        }
                      });
                    }, function (err) {
                      res.send({status: 500, error: `There was an error saving the user: ${err}`});
                      res.statusCode = 500;
                    });


                  });
                }
              }).catch((err)=>{
                res.send({status: 400, error:'Error!', err:err});
                res.statusCode = 400;
              })
        }
      }).catch((err)=>{
        res.send({status: 400, error:'Error!', err:err});
        res.statusCode = 400;
      });
});

router.get('/logout', (req, res) => {
  req.logout();
  res.sendStatus(200);
});


/*
* Forgot password request
* */
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


/*
* Reset Password request
*
* */
router.route('/reset-password')
    .post((req, res)=> {
      let bundle = req.body;

      User.findOne({email: bundle.email})
          .select('+password')
          .exec()
          .then((user)=>{

            if(user){
              if(bundle.oldPassHash == user.password && checkExpiration(user.passwordReset.exp)){
                if(validPassword(bundle.newPassword)){
                  bcrypt.hash(bundle.newPassword, saltRounds, null, (err, hash)=>{
                    if(hash){
                      user.password = hash;
                      user.passwordReset.exp = null;
                      return user.update(user)
                          .then((response)=>{
                            res.json({
                              status: 200,
                              message: "success",
                              data: "An email has been sent to you to reset your password."
                            });
                          })
                    }else{
                      return res.json({data: 'There was an issue resetting your password. Please ensure the email was correct and try again.', status: 400, error:'error'});
                    }
                  })
                }else{
                //  Send invalid password
                  res.json({data: 'There was an issue resetting your password. Please ensure the email was correct and try again.', status: 400, error:'error'});
                  res.sendStatus(400);
                }
              }else{
              //  Send expired or wrong token error
                console.log('should be expired');
                res.json({data: 'Error! The reset token is incorrect or has expired, please request a new password token and try again.', status: 400, error:'error'});
                res.sendStatus(400);
              }
            }else{
            //  Send No user found error
              res.json({data: 'Reset password error! No User with this email was found. Check your email and try again.', status: 400, error:'error'});
              res.sendStatus(400);
            }
          });
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

export default router;