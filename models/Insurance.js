const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const insuranceSchema = new Schema (
    {
        company: { type: String, required: true },
        patients: [{ type:mongoose.Schema.Types.ObjectId, ref: "Patient", required: true }],
        doctors: [{ type:mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true }],
    },
    {
        timestamps: true
    }
)

const Insurance = mongoose.model('Insurance', insuranceSchema);
module.exports = Insurance;