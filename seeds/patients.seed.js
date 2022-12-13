const mongoose = require("mongoose");
const { DB_URL } = require('../utils/db');



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
      doctor: "639847f704b335c55972c191"
    },
    {
      fullName: "Amelita Meachan",
      age: 16,
      gender: "Female",
      phoneNumber: "320-298-9349",
      email: "ameachan@example.com",
      insurance: "Asisa",
      illness: 'Covid',
      doctor: "639847f704b335c55972c194"
    },
    {
      fullName: "West Mate",
      age: 26,
      gender: "Male",
      phoneNumber: "490-981-5560",
      email: "wmate@example.com",
      insurance: "Adeslas",
      illness: 'Diarrhea',
      doctor: "639847f704b335c55972c193"
    },
    {
      fullName: "Staci Varnam",
      age: 15,
      gender: "Female",
      phoneNumber: "370-798-4092",
      email: "svarnam@example.com",
      insurance: "DKV",
      illness: 'Mononucleosis',
      doctor: "639847f704b335c55972c192"
    },
    {
      fullName: "Cary Lassells",
      age: 83,
      gender: "Male",
      phoneNumber: "313-841-1038",
      email: "classells@example.com",
      insurance: "Maphre",
      illness: 'Pneumonia',
      doctor: "639847f704b335c55972c194"
    },
    {
      fullName: "Paxon Butlin",
      age: 25,
      gender: "Male",
      phoneNumber: "421-755-7905",
      email: "pbutlin@example.com",
      insurance: "Asisa",
      illness: 'Lupus',
      doctor: "639847f704b335c55972c193"
    },
    {
      fullName: "Denni Oury",
      age: 14,
      gender: "Female",
      phoneNumber: "877-554-9374",
      email: "doury@example.com",
      insurance: "Sanitas",
      illness: 'Lupus',
      doctor: "639847f704b335c55972c191"
    },
    {
      fullName: "Johnna Olver",
      age: 7,
      gender: "Female",
      phoneNumber: "658-601-2777",
      email: "jolver@example.com",
      insurance: "Otros",
      illness: 'Covid',
      doctor: "639847f704b335c55972c192"
    },
    {
      fullName: "Steve Costerd",
      age: 25,
      gender: "Male",
      phoneNumber: "877-895-0637",
      email: "scosterd@example.com",
      insurance: "DKV",
      illness: 'Lupus',
      doctor: "639847f704b335c55972c191"
    },
    {
      fullName: "Thebault Moan",
      age: 28,
      gender: "Male",
      phoneNumber: "930-436-3777",
      email: "tmoan@example.com",
      insurance: "Adeslas",
      illness: 'Pneumonia',
      doctor: "639847f704b335c55972c194"
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
