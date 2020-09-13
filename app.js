require('./config/config');
require('./models/db');

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const cors = require('cors');
const indexRoute = require('./routes/index.router');
const studentRoute = require('./routes/student.router');
const tutorRoute = require('./routes/tutor.router');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());
app.use('/index',indexRoute);
app.use('/student',studentRoute);
app.use('/tutor',tutorRoute);

module.exports = app;
