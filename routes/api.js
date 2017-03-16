import {express, Router } from 'express';
import fs from 'fs';

// create array list of all files in apiRoutes directory
const routes = fs.readdirSync(__dirname + '/apiRoutes');

//loop through all routes and add them to the app to use
export default function APIRoutes(app) {
  routes.forEach(function (resource) {
    if (resource.substr(resource.lastIndexOf('.') + 1) !== 'js') return;
    var resourceName = resource.split('.')[0];
    app.use(`/api/${ resourceName}`, require(`./apiRoutes/${resource}`).default);
  });
};