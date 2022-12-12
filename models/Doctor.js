const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const doctorSchema = new Schema (
    {
        fullName: { type: string, required: true },
        university: { type: string },
        age: { type: Number, required: true },
        patients: [{ type: mongoose.Types.ObjectId, ref: 'Patient' }],
        
    },{
        timestamps: true,
    }
)

const Doctor = mongoose.model('Doctor', doctorSchema);
module.exports = Doctor;