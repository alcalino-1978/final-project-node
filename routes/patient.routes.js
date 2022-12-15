const express = require('express');
const mongoose = require('mongoose');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const { isAuth } = require('../auth/jwt');

const fileMiddleware = require('../middlewares/file.middleware');
const router = express.Router();

// Get alls patient
//router.get('/', [isAuth], async (req, res, next) => {
router.get('/',  async (req, res, next) => {
  const { illnessQuery, insuranceQuery } = req.query;
  let patients = [];
  try {
    if (illnessQuery) {
      patients = await Patient.find({illness: illnessQuery});
      if (patients.length === 0) {
        return res.status(404).json(`${illnessQuery} not exist in Database`);
      }
    } else if(insuranceQuery) {
      patients = await Patient.find({insurance: insuranceQuery});
      if (patients.length === 0) {
        return res.status(404).json(`${insuranceQuery} not exist in Database`);
      }
    } else {
      patients = await Patient.find().populate('doctor');
    }
    return res.status(200).json(patients);
  } catch {
    return next(err);
  }
})

// Get patient by id

router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const idObject = mongoose.Types.ObjectId(id);
    const patient = await Patient.findById(idObject);
    if (patient) {
      return res.status(200).json(patient);
    } else {
      return res.status(404).json('No patient found by this id');
    }

  } catch (err) {
    return next(err);
  }

})

// Post patient
router.post('/', [fileMiddleware.upload.single('picture'), fileMiddleware.uploadToCloudinary], async (req, res, next) => {
  const cloudinaryUrl = req.file_url ? req.file_url : null;
  const { fullName, age, gender, phoneNumber, email, insurance, registered, password, illness, doctor = 'Julius Hibbert' } = req.body;
  const patient = {
    fullName,
    age,
    gender,
    phoneNumber,
    email,
    insurance,
    registered,
    password,
    illness,
    doctor,
    picture: cloudinaryUrl
  }
  try {
    const newPatient = new Patient(patient);

    // Check If patient exists
    const result = await Patient.exists({ fullName: newPatient.fullName });
    if (result) {
      return res.status(404).json('This patient fullName already exists');
    } else {
      console.log(newPatient.fullName);
      const createdPatient = await newPatient.save();
      return res.status(201).json(createdPatient);
    }
  } catch (error) {
    next(error);
  }
})

// Delete Patient
router.delete('/:id', [isAuth], async (req, res, next) => {
  try {
    const { id } = req.params;
    const namePatient = await Patient.findById(id).lean();
    console.log(namePatient.fullName);
    
    const patientRelations = await Doctor.find({}).select('patients -_id');
    console.log(patientRelations);
    patientRelations.forEach(async patient => {
      console.log(patient);
      // for (const iterator of patient) {
      //   if (iterator._id === id) {
      //     iterator.remove();
      //   }
        
      // }
    });

    await Patient.findByIdAndDelete(id);
    return res.status(200).json(`Patient ${namePatient.fullName} has been deleted sucessfully!`)
  } catch (error) {
    next(error);
  }
})

// Put Update by ID

router.put('/:id', [isAuth], async (req, res, next) => {
  try {
    const { id } = req.params;
    const patientModify = new Patient(req.body);
    patientModify._id = id;
    const patient = await Patient.findByIdAndUpdate(id, patientModify);
    if (patient) {
      return res.status(200).json(patientModify);
    } else {
      return res.status(404).json('Patient by this ID it is not found');
    }
  } catch (error) {
    next(error);
  }
})

module.exports = router;
