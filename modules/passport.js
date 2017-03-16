'use strict';


import models from '../models';
import express from 'express';
import passport from 'passport';
import Strategy  from 'passport-local';

let User = models.User;

passport.use('local', new Strategy({
      usernameField: 'email',
      passwordField: 'password'
    },function(email, password, done) {
      User.findOne({email: email})
          .then(function(user) {
            if (!user) {
              return done(null, false, { message: 'Incorrect username.' });
            }
            user.validPassword(password, function(err, isMatch){
              if (err) return done(err);
              if (!isMatch) return done(null, false, {message: 'Incorrect Password'});
              return done(null, user);
            });
          });
    }
));
export default passport;