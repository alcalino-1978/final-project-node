const express = require('express');
const Doctor = require('../models/Doctor');

const router = express.Router();

//TODO
//TODO PONER EL MIDDLEWARE EN LAS PETICIONES GET DE ISAUTH 1:24:42 SEGUNDO VIDEO DÍA 10-12-2022

// viewAll=true
router.get('/', async (req, res, next) => {
  const { viewAll } = req.query;
  try {
    let doctors = [];
    if (viewAll === 'true') {
      doctors = await Doctor.find().populate('patients');
    } else {
      doctors = await Doctor.find();
    }
    return res.status(200).json(doctors);
  } catch (error) {
    return next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const newDoctor = new Doctor({
      fullName: req.body.fullName,
      age: req.body.age,
      gender: req.body.gender,
      phoneNumber: req.body.phoneNumber,
      email: req.body.email,
      insurance: req.body.insurance,
      patients: [],
      user: [],
    });
    const createdDoctor = await newDoctor.save();
    return res.status(201).json(createdDoctor);
  } catch (error) {
    next(error);
  }
});

module.exports = router;