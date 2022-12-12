const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const patientSchema = new Schema (
    {
        fullName: { type: String, required: true },
        age: { type: Number, required: true },
        gender: { 
            type: String, 
            required: true,
            enum:['Male', 'Female']
        },
        phoneNumber: { type: String },
        email: { type: String, required: true },
        insurance: { type: String, required: true },
        illness: { 
            type: String,
            required: true,
            enum:['Lupus', 'Covid', 'Diarrhea', 'Mononucleosis', 'Pneumonia']
        },
        doctor: {
            type: String,
            required: true,
            enum:['Julius Hibbert', 'Gregory House', 'Meredith Grey', 'Nick Riviera']
        },
    },
    {
        timestamps: true
    }
)

const Patient = mongoose.model('Patient', patientSchema);
module.exports = Patient;
