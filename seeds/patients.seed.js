const mongoose = require("mongoose");
const { DB_URL } = require('../utils/db');



const Patient = require("../models/Patient");

const patientsList = [
    {
      fullName: "Mariel Linskill",
      age: 48,
      gender: "Female",
      insurance: "Sanitas",
      illness: 'Lupus',
      phoneNumber: "982-948-8357",
      doctor: "Meredith Grey"
    },
    {
      fullName: "Amelita Meachan",
      age: 16,
      gender: "Female",
      insurance: "Asisa",
      illness: 'Covid',
      phoneNumber: "320-298-9349",
      doctor: "Gregory House"
    },
    {
      fullName: "West Mate",
      age: 26,
      gender: "Male",
      insurance: "Adeslas",
      illness: 'Diarrhea',
      phoneNumber: "490-981-5560",
      doctor: "Nick Riviera"
    },
    {
      fullName: "Staci Varnam",
      age: 15,
      gender: "Genderqueer",
      insurance: "DKV",
      illness: 'Mononucleosis',
      phoneNumber: "370-798-4092",
      doctor: "Julius Hibbert"
    },
    {
      fullName: "Cary Lassells",
      age: 83,
      gender: "Genderfluid",
      insurance: "Maphre",
      illness: 'Pneumonia',
      phoneNumber: "313-841-1038",
      doctor: "Gregory House"
    },
    {
      fullName: "Paxon Butlin",
      age: 25,
      gender: "Male",
      insurance: "Asisa",
      illness: 'Lupus',
      phoneNumber: "421-755-7905",
      doctor: "Nick Riviera"
    },
    {
      fullName: "Denni Oury",
      age: 14,
      gender: "Female",
      insurance: "Sanitas",
      illness: 'Lupus',
      phoneNumber: "877-554-9374",
      doctor: "Meredith Grey"
    },
    {
      fullName: "Johnna Olver",
      age: 7,
      gender: "Female",
      insurance: "Private",
      illness: 'Covid',
      phoneNumber: "658-601-2777",
      doctor: "Julius Hibbert"
    },
    {
      fullName: "Steve Costerd",
      age: 25,
      gender: "Male",
      insurance: "DKV",
      illness: 'Lupus',
      phoneNumber: "877-895-0637",
      doctor: "Meredith Grey"
    },
    {
      fullName: "Thebault Moan",
      age: 28,
      gender: "Male",
      insurance: "Adeslas",
      illness: 'Pneumonia',
      phoneNumber: "930-436-3777",
      doctor: "Gregory House"
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
})
.catch((err) => console.log(`Error deleting data: ${err}`))
.then(async () => {
    console.log(patientsDocuments)
    await Patient.insertMany(patientsDocuments);
  })
  .catch((err) => console.log(`Error creating data: ${err}`))
  .finally(() => mongoose.disconnect());
