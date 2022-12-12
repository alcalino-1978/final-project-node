const express = require('express');
const Insurance = require('../models/Insurance');

const router = express.Router();

//TODO
//TODO PONER EL MIDDLEWARE EN LAS PETICIONES GET DE ISAUTH 1:24:42 SEGUNDO VIDEO DÍA 10-12-2022

// viewAll=true
router.get('/', async (req, res, next) => {
  const { viewAll } = req.query;
  try {
    let insurances = [];
    if (viewAll === 'true') {
      insurances = await Insurance.find().populate('patients');
    } else {
      insurances = await Insurance.find();
    }
    return res.status(200).json(insurances);
  } catch (error) {
    return next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const newInsurance = new Insurance({
      fullName: req.body.fullName,
      age: req.body.age,
      gender: req.body.gender,
      phoneNumber: req.body.phoneNumber,
      email: req.body.email,
      insurance: req.body.insurance,
      patients: [],
      user: [],
    });
    const createdInsurance = await newInsurance.save();
    return res.status(201).json(createdInsurance);
  } catch (error) {
    next(error);
  }
});

module.exports = router;