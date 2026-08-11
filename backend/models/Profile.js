const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ["male", "female", "other", "prefer_not_to_say"] },
    phone: { type: String },
    alternatePhone: { type: String },
    address: {
        street: { type: String },
        city: { type: String },
        district: { type: String },
        state: { type: String },
        pincode: { type: String }
    },
    aadhaarNumber: { type: String },
    panNumber: { type: String },
    bankDetails: {
        accountNumber: { type: String },
        ifscCode: { type: String },
        bankName: { type: String },
        branchName: { type: String }
    },
    familyDetails: [{
        name: { type: String },
        relation: { type: String },
        age: { type: Number },
        occupation: { type: String }
    }],
    disability: {
        hasDisability: { type: Boolean, default: false },
        type: { type: String },
        percentage: { type: Number }
    },
    category: { type: String, enum: ["general", "obc", "sc", "st", "ews"] },
    annualIncome: { type: Number },
    occupation: { type: String },
    employerName: { type: String },
    workExperience: { type: Number },
    languages: [{ type: String }],
    emergencyContact: {
        name: { type: String },
        phone: { type: String },
        relation: { type: String }
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Profile", profileSchema);