const mongoose = require("mongoose");
const { DB_URL } = require('../utils/db');
const Doctor = require('../models/Doctor');



const Patient = require("../models/Patient");

const patientsList = [
    {
      fullName: "Mariel Linskill",
      age: 48,
      gender: "Female",
      phoneNumber: "982-948-8357",
      email: "mlinskill@example.com",
      insurance: "Sanitas",
      registered: false,
      illness: 'Lupus',
    },
    {
      fullName: "Amelita Meachan",
      age: 16,
      gender: "Female",
      phoneNumber: "320-298-9349",
      email: "ameachan@example.com",
      insurance: "Asisa",
      illness: 'Covid',
    },
    {
      fullName: "West Mate",
      age: 26,
      gender: "Male",
      phoneNumber: "490-981-5560",
      email: "wmate@example.com",
      insurance: "Adeslas",
      illness: 'Diarrhea',
    },
    {
      fullName: "Staci Varnam",
      age: 15,
      gender: "Female",
      phoneNumber: "370-798-4092",
      email: "svarnam@example.com",
      insurance: "DKV",
      illness: 'Mononucleosis',
    },
    {
      fullName: "Cary Lassells",
      age: 83,
      gender: "Male",
      phoneNumber: "313-841-1038",
      email: "classells@example.com",
      insurance: "Maphre",
      illness: 'Pneumonia',
    },
    {
      fullName: "Paxon Butlin",
      age: 25,
      gender: "Male",
      phoneNumber: "421-755-7905",
      email: "pbutlin@example.com",
      insurance: "Asisa",
      illness: 'Lupus',
    },
    {
      fullName: "Denni Oury",
      age: 14,
      gender: "Female",
      phoneNumber: "877-554-9374",
      email: "doury@example.com",
      insurance: "Sanitas",
      illness: 'Lupus',
    },
    {
      fullName: "Johnna Olver",
      age: 7,
      gender: "Female",
      phoneNumber: "658-601-2777",
      email: "jolver@example.com",
      insurance: "Otros",
      illness: 'Covid',
    },
    {
      fullName: "Steve Costerd",
      age: 25,
      gender: "Male",
      phoneNumber: "877-895-0637",
      email: "scosterd@example.com",
      insurance: "DKV",
      illness: 'Lupus',
    },
    {
      fullName: "Thebault Moan",
      age: 28,
      gender: "Male",
      phoneNumber: "930-436-3777",
      email: "tmoan@example.com",
      insurance: "Adeslas",
      illness: 'Pneumonia',
    }
  ]
  ;

const patientsDocuments = patientsList.map((patient) => new Patient(patient));

mongoose
  .connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    const allPatients = await Patient.find();
    if (allPatients.length) {
        await Patient.collection.drop();
    }
    const allDoctors = await Doctor.find();
    patientsDocuments.forEach(async patient => {
      const random = Math.floor(Math.random() * allDoctors.length);
      const doctor = allDoctors[random];
      patient.doctor = doctor.id;

      await Doctor.findByIdAndUpdate(
        doctor._id,
        { $push: { patients: patient._id , } },
        { new: true }
        ); 
    });

})
.catch((err) => console.log(`Error deleting data: ${err}`))
.then(async () => {
    console.log(patientsDocuments)
    await Patient.insertMany(patientsDocuments);
  })
  .catch((err) => console.log(`Error creating data: ${err}`))
  .finally(() => mongoose.disconnect());
