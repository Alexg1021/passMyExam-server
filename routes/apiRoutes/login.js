// "use strict";
//
// import express from 'express';
// import UserController from '../../controllers/user.controller';
// import passport from 'passport';
// import jwt from 'jsonwebtoken';
// import fs from 'fs';
// const Encryption = require('../../encryption/passwordEncryption/password-encryption.js');
//
// const router = express.Router();
//
// router.post('/', (req, res) => {
//   UserController.findByEmail(req)
//       .then((user) => {
//         if (user != null) {
//           //current users hashed password
//           let hashedPassword = user.password;
//           console.log( 'user: ' + user);
//           if (user.isActivated) {
//             // login as normal
//             // check if the password from request matches the encrypted hashedPassword
//             Encryption.check(req.body.password, hashedPassword).then((resp) => {
//               console.log(resp);
//               if (resp) {
//                 user = user.toJSON();
//                 res.json({
//                   token: jwt.sign(user, process.env.JWT_SECRET),
//                   employee: user.Employee
//                 });
//               } else {
//                 res.json({error: 'Authentication error!'});
//               }
//             });
//           } else {
//             // user is not activated yet. redirect to reset password screen on the frontend
//             res.json({
//               error: 'First Login Attempt! Need password reset!',
//               token:hashedPassword,
//               resetPath:`/password-reset?hash=${hashedPassword}`
//             });
//           }
//         } else {
//           res.json({error: 'Authentication error! User not found!'});
//         }
//       }, (err) => {
//         res.json(err);
//       })
// });
//
// router.get('/logout', (req, res) => {
//   req.logout();
//   res.sendStatus(200);
// });
//
// //router.get('/refresh', jwt.protect, function (req, res) {
// //  UserController.refreshToken(req.current_user.dataValues).then(function (user) {
// //    res.json({
// //      user: user,
// //      token: jwt.sign(user)
// //    });
// //  }, function (err) {
// //    res.json(err);
// //  });
// //});
//
// export default router;