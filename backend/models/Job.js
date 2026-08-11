const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    company: { type: String, required: true },
    description: { type: String },
    category: { type: String, enum: ["government", "private", "ngo", "startup", "internship", "apprenticeship"] },
    type: { type: String, enum: ["full_time", "part_time", "contract", "internship", "freelance", "remote"] },
    location: {
        state: { type: String, required: true },
        district: { type: String },
        city: { type: String },
        isRemote: { type: Boolean, default: false }
    },
    salary: {
        min: { type: Number },
        max: { type: Number },
        currency: { type: String, default: "INR" },
        period: { type: String, enum: ["monthly", "yearly", "hourly"], default: "monthly" },
        isNegotiable: { type: Boolean, default: false }
    },
    eligibility: {
        minEducation: { type: String },
        minExperience: { type: Number },
        skills: [{ type: String }],
        certifications: [{ type: String }],
        ageLimit: { type: Number },
        gender: { type: String }
    },
    benefits: [{ type: String }],
    applicationProcess: {
        mode: { type: String, enum: ["online", "offline", "both"] },
        url: { type: String },
        email: { type: String },
        contactNumber: { type: String },
        documents: [{ type: String }],
        deadline: { type: Date }
    },
    vacancies: { type: Number, default: 1 },
    isActive: { type: Boolean, default: true },
    postedDate: { type: Date, default: Date.now },
    expiryDate: { type: Date },
    tags: [{ type: String }],
    source: { type: String },
    referenceUrl: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

jobSchema.index({ "location.state": 1, category: 1 });
jobSchema.index({ isActive: 1, expiryDate: 1 });
jobSchema.index({ title: "text", company: "text", description: "text" });

module.exports = mongoose.model("Job", jobSchema);