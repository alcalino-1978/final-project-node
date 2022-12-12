const express = require('express');
const mongoose = require('mongoose');
const Patient = require('../models/Patient');

const router = express.Router();

// Get alls patient
router.get('/', async (req, res, next) => {
    let patients = [];
    try {
        patients = await Patient.find();
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
        const patient = await Patient.findById(id);
		if (patient) {
			return res.status(200).json(patient);
		} else {
			return res.status(404).json('No patient found by this id');
		}

    } catch {

    }
})

// Post patient
router.post('/', async (req, res, next) => {
    const { fullName, age, gender, phoneNumber, email, insurance, illness, doctor = 'Julius Hibbert' } = req.body;
    const patient = {
        fullName,
        age,
        gender,
        phoneNumber,
        email,
        insurance,
        illness,
        doctor,
    }
    try {
        const newPatient = new Patient(patient);
        const createdPatient = await newPatient.save();
        return res.status(201).json(createdPatient);
    } catch (error) {
        next(error);
    }
})

// Delete Patient
router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const namePatient = await Patient.findById(id).lean();
        console.log(namePatient.fullName);
        await Patient.findByIdAndDelete(id);
        return res.status(200).json(`Patient ${namePatient.fullName} has been deleted sucessfully!`)
    } catch (error) {
        next(error);
    }
})

// Put Update by ID

router.put('/:id', async (req, res, next) => {
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