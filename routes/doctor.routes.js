const express = require('express');
const mongoose = require('mongoose');
const { isAuth } = require('../auth/jwt');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');

const router = express.Router();

// viewAll=true
router.get('/', async (req, res, next) => {
  const { fullInfo, insuranceQuery } = req.query;
  try {
    let doctors = [];
    if (fullInfo === 'true') {
      console.log(doctors);
      doctors = await Doctor.find().populate('patients');
    } else if(insuranceQuery) {
      doctors = await Doctor.find({insurance: insuranceQuery});
      if (doctors.length === 0) {
        return res.status(404).json(`${insuranceQuery} not exist in Database`);
      }
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
    const doctor = await Doctor.findById(idObject).populate('patients');
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
router.post('/', [isAuth], async (req, res, next) => {
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
router.delete('/:id', [isAuth], async (req, res, next) => {
  try {
    const { id } = req.params;
    const nameDoctor = await Doctor.findById(id).lean();
    console.log(nameDoctor.fullName);

    // Para borrar las referencias del doctor en todos los pacientes
    await Patient.updateMany(
      {doctor: id}, // filtro de búsqueda
      {$unset:  {doctor: 1}} // Con esto borramos el field doctor que concuerda con el filtro de búsqueda
    );
    await Doctor.findByIdAndDelete(id); // Borrado del doctor en la colección principal
    return res.status(200).json(`Doctor ${nameDoctor.fullName} has been deleted sucessfully!`)
  } catch (error) {
    next(error);
  }
})

// Put Update by ID

router.put('/:id', [isAuth], async (req, res, next) => {
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