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
        registered: { type: Boolean },
        password: { 
            type: String,
            required: () => {
                return this.registered === true;
            }
         },
        illness: { 
            type: String,
            required: true,
            enum:['Lupus', 'Covid', 'Diarrhea', 'Mononucleosis', 'Pneumonia']
        },
        doctor: [{ type:mongoose.Schema.Types.ObjectId, ref: "Doctor" }]
    },
    {
        timestamps: true
    }
)

const Patient = mongoose.model('Patient', patientSchema);
module.exports = Patient;
