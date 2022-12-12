const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const doctorSchema = new Schema (
    {
        fullName: { type: String, required: true },
        age: { type: Number, required: true },
        gender: { 
            type: String, 
            required: true,
            enum:['Male', 'Female']
        },
        phoneNumber: { type: String },
        email: { type: String, required: true  },
        insurance: { 
            type: String,
            required: true,
            enum:['Sanitas', 'Asisa', 'Adeslas', 'DKV', 'Maphre', 'Otros']
        },
        patients: [{ type:mongoose.Schema.Types.ObjectId, ref: "Patient", required: true }],
        user: [{ type:mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
    },
    {
        timestamps: true
    }
)

const Doctor = mongoose.model('Doctor', doctorSchema);
module.exports = Doctor;