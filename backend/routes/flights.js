var express = require('express');
var router = express.Router();

const {checkFlight} = require('../validation/validation')
const {notFound, success} = require('../response/response')
const Flight = require('../models/Flight');
const User = require('../models/User');

router.post('/', ({body}, res, next) => {
  errors = checkFlight(body)

  console.log(body)

  if(errors.length > 0){
    res.status(400).json(errors)
  } else {
    Flight.create(body)
      .then(success(res, 201))
  }
});

router.delete('/:id', ({params}, res, next) => {
  Flight.findById(params.id)
    .then(notFound(res))
    .then(async (flight) => {
      if(flight == null) return null
      await flight.remove()

      const tourists = await User.find({flights: flight._id.toString()})
      if (tourists === undefined || tourists.length == 0) return flight

      tourists.forEach(async user => {
        user.flights = user.flights.filter((value, index, arr) => {
          return value != flight._id.toString();
        });

        await user.save()
      })
      return flight
    })
    .then(success(res, 204))
});

router.get('/', (req, res, next) => {
  Flight.find()
    .then(notFound(res))
    .then(success(res))
});

router.put('/add/:id_f/:id_t', async ({params}, res, next) => {
  let flight = undefined
  let user = undefined
  
  try {
    flight = await Flight.findById(params.id_f)
    user = await User.findById(params.id_t)
  } catch(e) {
    return res.status(404).end()
  }

  if(flight.tourists.findIndex(i => i._id == user._id.toString()) > 0) return res.status(400).json(['This user is already passenger of this flight'])
  if(flight.seats <= flight.tourists.length) return res.status(400).json(['This shuttle is full'])
  
  flight.tourists.push(user._id)
  user.flights.push(flight._id)

  await flight.save()
  await user.save()

  res.status(200).json(flight)
});

router.put('/remove/:id_f/:id_t', async ({params}, res, next) => {
  let flight = undefined
  let user = undefined
  
  try {
    flight = await Flight.findById(params.id_f)
    user = await User.findById(params.id_t)
  } catch(e) {
    return res.status(404).end()
  }

  if(flight.tourists.findIndex(i => i._id == user._id.toString()) < 0) return res.status(400).json(['This user is not on this flight'])
  
  flight.tourists = flight.tourists.filter((value, index, arr) => {
    return value != user._id.toString();
  });

  user.flights = user.flights.filter((value, index, arr) => {
    return value != flight._id.toString();
  });

  await flight.save()
  await user.save()

  res.status(200).json(flight)
});

router.get('/:id', ({params}, res, next) => {
  Flight.findById(params.id)
    .populate('users', 'name lastname')
    .exec((err, flight) => {
      if(err) res.status(404).end() 
      else return res.status(200).json(flight)
    })
});

module.exports = router;
