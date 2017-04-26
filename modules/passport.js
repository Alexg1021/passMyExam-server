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

// passport.use(new LocalStrategy({usernameField: 'email'}, function (email, password, next) {
//
//   let User = models.User;
//
//   User.findOne({email: email, deleted_at: null}, function (err, user) {
//     if (err) return next(err);
//     if (!user) return next(null, false, {message: 'Incorrect username.'});
//
//     user.validPassword(password, function (err, isMatch) {
//       if (err) return next(err);
//       if (!isMatch) return next(null, false);
//       return next(null, user);
//     });
//   });
// }));
