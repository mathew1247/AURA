const mongoose = require("mongoose");

const schemeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    category: { type: String, required: true, enum: ["education", "employment", "healthcare", "financial", "housing", "skill_development", "women_empowerment", "youth", "senior_citizen", "disability", "agriculture", "entrepreneurship", "other"] },
    subCategory: { type: String },
    state: { type: String, required: true },
    district: { type: String },
    applicableTo: { type: String, enum: ["all", "state", "district", "national"] },
    eligibility: {
        minAge: { type: Number },
        maxAge: { type: Number },
        minIncome: { type: Number },
        maxIncome: { type: Number },
        education: [{ type: String }],
        category: [{ type: String }],
        gender: { type: String },
        disabilityRequired: { type: Boolean },
        employmentStatus: { type: String, enum: ["employed", "unemployed", "self_employed", "student", "any"] },
        location: { type: String },
        otherCriteria: [{ type: String }]
    },
    benefits: [{
        type: { type: String, enum: ["financial", "training", "employment", "healthcare", "housing", "education", "subsidy", "loan", "insurance", "other"] },
        description: { type: String },
        amount: { type: Number },
        frequency: { type: String, enum: ["one_time", "monthly", "quarterly", "yearly"] }
    }],
    documents: [{ type: String }],
    applicationProcess: {
        mode: { type: String, enum: ["online", "offline", "both"] },
        url: { type: String },
        officeAddress: { type: String },
        contactNumber: { type: String },
        email: { type: String },
        steps: [{ type: String }]
    },
    deadline: { type: Date },
    isActive: { type: Boolean, default: true },
    launchDate: { type: Date },
    tags: [{ type: String }],
    source: { type: String },
    referenceUrl: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

schemeSchema.index({ state: 1, category: 1 });
schemeSchema.index({ isActive: 1, deadline: 1 });
schemeSchema.index({ name: "text", description: "text" });

module.exports = mongoose.model("Scheme", schemeSchema);