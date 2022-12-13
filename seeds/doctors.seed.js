const mongoose = require("mongoose");
const { DB_URL } = require('../utils/db');



const Doctor = require("../models/Doctor");

const doctorsList = [
    {
      fullName: "Meredith Grey",
      age: 44,
      gender: "Female",
      phoneNumber: "982-948-8357",
      email: "mgrey@example.com",
      insurance: "Sanitas",
      registered: false,
      patients: [],
      user: []
    },
    {
      fullName: "Julius Hibbert",
      age: 44,
      gender: "Male",
      phoneNumber: "955-333-666",
      email: "jhibbert@example.com",
      insurance: ["DKV", "Otros"],
      registered: false,
      patients: [],
      user: []
    },
    {
      fullName: "Nick Riviera",
      age: 32,
      gender: "Male",
      phoneNumber: "935-363-686",
      email: "nriviera@example.com",
      insurance: ["Asisa", "Adeslas"],
      registered: false,
      patients: [],
      user: []
    },
    {
      fullName: "Gregory House",
      age: 53,
      gender: "Male",
      phoneNumber: "402-377-006",
      email: "ghouse@example.com",
      insurance: ["Maphre", "Adeslas", "Asisa"],
      registered: false,
      patients: [],
      user: []
    },
    
  ]
  ;

const doctorsDocuments = doctorsList.map((doctor) => new Doctor(doctor));

mongoose
  .connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    const allDoctors = await Doctor.find();
    if (allDoctors.length) {
        await Doctor.collection.drop();
    }
})
.catch((err) => console.log(`Error deleting data: ${err}`))
.then(async () => {
    console.log(doctorsDocuments)
    await Doctor.insertMany(doctorsDocuments);
  })
  .catch((err) => console.log(`Error creating data: ${err}`))
  .finally(() => mongoose.disconnect());
