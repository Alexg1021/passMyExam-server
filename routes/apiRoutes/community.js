"use strict";

import express from 'express';
import CommunityController from '../../controllers/community.controller';
import fs from 'fs';

const router = express.Router();

router.route('/badges')
    .get((req, res)=>{
      CommunityController.getBadges()
          .then((data)=>{
            res.json(data);
          }, (err) => {
            res.json(err)
          });
    })
    .post((req, res) => {
      CommunityController.createBadge(req)
          .then((data) => {
            res.json(data);
          },(err) =>{
            res.json(err);
          });
    });

router.route('/badges/:id')
    .get((req, res) => {
      CommunityController.findBadge(req)
          .then((data)=>{
        res.json(data);
      }, (err) => {
        res.json(err);
      })
    })
    .put((req, res) => {
      CommunityController.updateBadge(req)
          .then((data) => {
            res.json(data);
          }, (err) => {
            res.json(err);
          })
    })
    .delete((req, res) => {
      CommunityController.destroyBadge(req)
          .then((data) => {
            res.json(data);
          }, (err) => {
            res.json(err);
          });
    });
export default router;