'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
var knex = require('../knex');

router.post('/organizations', function(req,res,next){
  var newOrg = req.body;
  knex('organizations')
  .select('id')
  .where('name', newOrg.name)
  .then(function(data){
    if(data.length > 0){
      res.setHeader('Content-Type', 'text/plain');
      return res.status(400).send('Email already exists');
    }
    knex('organizations')
    .insert(newOrg, '*' )
    .then(function(data){
      res.setHeader('Content-Type', 'application/json');
      return res.send(data[0]);
    });
  });
});


module.exports = router;
