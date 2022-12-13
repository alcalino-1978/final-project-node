const express = require('express');
const mongoose = require('mongoose');
const Doctor = require('../models/Doctor');

const router = express.Router();

// viewAll=true
router.get('/', async (req, res, next) => {
  const { viewAll } = req.query;
  try {
    let doctors = [];
    if (viewAll === 'true') {
      console.log(doctors);
      // doctors = await Doctor.find().populate('patients'
      doctors = await Doctor.find().populate({
        path: 'patients',
        select: 'doctor'
        }
      );
    } else {
      doctors = await Doctor.find();
    }
    console.log(doctors)
    return res.status(200).json(doctors);
  } catch (error) {
    return next(error);
  }
});

// Get Doctor by id

router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const idObject = mongoose.Types.ObjectId(id);
    console.log(idObject);
    const doctor = await Doctor.findById(idObject).populate({
      path: 'patients',
      select: 'doctor'
      }
    );
    console.log(doctor);
    if (doctor) {
      return res.status(200).json(doctor);
    } else {
      return res.status(404).json('No Doctor found by this id');
    }

  } catch (err) {
    return next(err);
  }
})

// Post Doctor
router.post('/', async (req, res, next) => {
  const { fullName, age, gender, phoneNumber, email, insurance, patients, user } = req.body;
  const doctor = {
    fullName,
    age,
    gender,
    phoneNumber,
    email,
    insurance,
    patients,
    user
  }
  try {
    const newDoctor = new Doctor(doctor);

    // Check If doctor exists
    const result = await Doctor.exists({ fullName: newDoctor.fullName });
    if (result) {
      return res.status(404).json('This doctor fullName already exists');
    } else {
      console.log(newDoctor.fullName);
      const createdDoctor = await newDoctor.save();
      return res.status(201).json(createdDoctor);
    }
  } catch (error) {
    next(error);
  }
});

// Delete Doctor
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const nameDoctor = await Doctor.findById(id).lean();
    console.log(nameDoctor.fullName);
    await Doctor.findByIdAndDelete(id);
    return res.status(200).json(`Doctor ${nameDoctor.fullName} has been deleted sucessfully!`)
  } catch (error) {
    next(error);
  }
})

// Put Update by ID

router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const doctorModify = new Doctor(req.body);
    doctorModify._id = id;
    const doctor = await Doctor.findByIdAndUpdate(id, doctorModify);
    if (doctor) {
      return res.status(200).json(doctorModify);
    } else {
      return res.status(404).json('Doctor by this ID it is not found');
    }
  } catch (error) {
    next(error);
  }
})
module.exports = router;