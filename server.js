'use strict';

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');

app.use(bodyParser.json());
app.use(express.static(path.join('public')));
app.use(cookieParser());

const users = require('./routes/users');
const organizations = require('./routes/organizations');
const roles = require('./routes/roles');

const eventRoles = require('./routes/event_roles');
const events = require('./routes/events');
const userEventRoles = require('./routes/user_event_roles');

const token = require('./routes/token');
const jwt = require('jsonwebtoken');



app.use(users);
app.use(organizations);
app.use(token);

app.use(function (req,res,next) {
  if (req.cookies.token) {
    jwt.verify(req.cookies.token,process.env.JWT_SECRET, function (err,decoded) {
      if (err) {
        res.clearCookie('token');
        next(err);
      }
      req.user = decoded;
      next();
    });
  }
  else {
    return res.redirect('/index.html');
  }
});

app.use(express.static(path.join('secure')));

app.use(roles);
app.use(eventRoles);
app.use(events);
app.use(userEventRoles);

app.use((_req, res) => {
  res.sendStatus(404);
});

app.use((err, _req, res, _next) => {
  if (err.output && err.output.statusCode) {
    return res
      .status(err.output.statusCode)
      .set('Content-Type', 'text/plain')
      .send(err.message);
  }
  console.error(err.stack);
  res.sendStatus(500);
});


const port = process.env.PORT || 3000;

app.listen(port);
