"use strict";

import express from 'express';
import UserController from '../../controllers/user.controller';
import jwt from 'jsonwebtoken';
import fs from 'fs';
const Encryption = require('../../encryption/password-encryption.js');
import User from '../../models/user';
import Mailgun from 'mailgun-js';
const router = express.Router();

function validPassword(pass){
  let re = new RegExp("^(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*)[0-9a-zA-Z]{8,15}$");
  return !!re.test(pass);
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
            Encryption.check(req.body.password, hashedPassword).then((resp) => {
              if (resp) {
                user = user.toJSON();
                res.json({
                  token: jwt.sign(user, process.env.JWT_SECRET),
                  isAdmin: user.isAdmin
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
          res.json({status: 400, error: 'Authentication error! User not found!'});
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

  return User.findOne({email: email})
      .then((isUser)=>{
        if(isUser){
          res.json({status: 400, error:'User already exists'});
          res.sendStatus(400);
        }else if(!validPassword(password)){
          res.json({status: 400, error:'Invalid Password'});
          res.sendStatus(400);
        }
        Encryption.encrypt(password)
            .then((hash)=>{

              let user = new User({email: email, password:hash, firstName: firstName, lastName: lastName});
              return user.save(function(data){

                let mailgun = new Mailgun({apiKey:process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN});

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
                  // console.log(`this is the error ${err} and this is the body: ${body}`);
                  //If there is an error, render the error page
                  if (err) {
                    res.render('error', {error : err});
                  }
                  //Else we can greet    and leave
                  else {
                    //Here "submitted.jade" is the view file for this landing page
                    //We pass the variable "email" from the url parameter in an object rendered by Jade
                    // res.render('submitted', { email : req.params.mail });
                    //omit the users new password
                    user.password = '¯|_(ツ)_/¯';
                    res.json(user);
                    res.status(200);
                  }
                });
              }, function(err){
                res.json({status: 500, error: `There was an error saving the user: ${err}`});
                res.status(500);
              });
            });
      });
});


/*
 var mg = new Mailgun(process.env.MAILGUN);
 mg.sendText('admin@westhillsfinancial.com', [user.email],
 "You've been added to the Farm Foreman Application",
 'You have been added as a user to the Farm Foreman application.  Your password is ' + generatedPassword +
 '.  You can login to the application at ' + process.env.APPURL + '.  Thanks!', 'noreply@westhillsfinancial.com',
 {}, function (err) {
 if (err) return res.status(400).json(err);
 res.json(user);
 });


* send email to user specifying they should reset password.
 let text = `Password reset.`,
 html = `Password reset. Go to ${clientURL}/#/password-reset?hash=${hash} to reset password.`; //auth == hash
 Emailer.send(`${testEmail}`, 'Password Reset', text, html); // replace testEmail with email
 // also include the hash as verification
 return res;
* */



router.get('/logout', (req, res) => {
  req.logout();
  res.sendStatus(200);
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