const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const jwt = require('jsonwebtoken');
const cors = require('cors')

const usersRouter = require('./routes/users');
const flightsRouter = require('./routes/flights');

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/LotyDatabase');

const app = express();

app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', usersRouter);
app.use('/flights', flightsRouter);

app.set('port', (process.env.PORT || 3001));
app.listen(app.get('port'), () => {
    console.log('Server started on port ' + app.get('port'));
});

module.exports = app;
