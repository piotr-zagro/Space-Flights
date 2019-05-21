var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');

const {protectedRoute} = require('../auth/auth')
const {checkTourist} = require('../validation/validation')
const {notFound, success} = require('../response/response')
const User = require('../models/User');
const Flight = require('../models/Flight');

const config = require('../config')

router.post('/', ({body}, res, next) => {
  console.log(body)
  errors = checkTourist(body)

  if(errors.length > 0){
    console.log(errors)
    res.status(400).json(errors)
  } else {
    User.create(body)
      .then(success(res, 201))
  }
});

router.delete('/:id', ({params}, res, next) => {
  User.findById(params.id)
    .then(notFound(res))
    .then(async (user) => {
      if(user == null) return null
      await user.remove()

      const flights = await Flight.find({tourists: user._id.toString()})
      if (flights === undefined || flights.length == 0) return user 

      flights.forEach(async flight => {
        flight.tourists = flight.tourists.filter((value, index, arr) => {
          return value != user._id.toString();
        });

        await flight.save()
      })
      return user
    })
    .then(success(res, 204))
});

router.get('/', protectedRoute, (req, res, next) => {
  User.find().select({"flights": 0})
    .then(notFound(res))
    .then(success(res))
});

router.get('/:id', ({params}, res, next) => {
  User.findById(params.id)
    .populate('flights')
    .exec((err, user) => {
      if(err) res.status(404).end() 
      else return res.status(200).json(user)
    })
});

router.post('/login', ({body}, res, next) => {
  User.find({username: body.username, password: body.password})
    .then(notFound(res))
    .then((user) => {      
      const payload = {
        check:  true
      }

      const token = jwt.sign(payload, config.secretKey, {
        expiresIn: 1440
      })

      res.status(200).json({token});
    })
});

module.exports = router;
