const mongoose = require("mongoose");

const ngoSchema = new mongoose.Schema({
    name: { type: String, required: true },
    registrationNumber: { type: String, required: true },
    registrationType: { type: String, enum: ["trust", "society", "section_8", "other"] },
    darpanId: { type: String },
    fcrNumber: { type: String },
    pan: { type: String },
    tan: { type: String },
    gstin: { type: String },
    description: { type: String },
    mission: { type: String },
    vision: { type: String },
    focusAreas: [{ type: String, enum: ["education", "healthcare", "women_empowerment", "child_welfare", "elderly_care", "disability", "environment", "livelihood", "rural_development", "urban_development", "disaster_relief", "human_rights", "legal_aid", "skill_development", "other"] }],
    targetBeneficiaries: [{
        group: { type: String },
        ageRange: { type: String },
        location: { type: String },
        count: { type: Number }
    }],
    location: {
        headOffice: {
            state: { type: String },
            district: { type: String },
            city: { type: String },
            address: { type: String }
        },
        operationalAreas: [{
            state: { type: String },
            district: { type: String },
            city: { type: String }
        }]
    },
    contact: {
        phone: { type: String },
        email: { type: String },
        website: { type: String },
        contactPerson: { type: String }
    },
    teamSize: {
        fullTime: { type: Number },
        partTime: { type: Number },
        volunteers: { type: Number }
    },
    funding: {
        sources: [{ type: String }],
        annualBudget: { type: Number },
        currency: { type: String, default: "INR" },
        grants: [{
            name: { type: String },
            amount: { type: Number },
            year: { type: Number },
            donor: { type: String }
        }]
    },
    programs: [{
        name: { type: String },
        description: { type: String },
        focusArea: { type: String },
        beneficiaries: { type: Number },
        status: { type: String, enum: ["active", "completed", "planned"] },
        startDate: { type: Date },
        endDate: { type: Date }
    }],
    certifications: [{ type: String }],
    awards: [{ type: String }],
    partnerships: [{
        name: { type: String },
        type: { type: String },
        description: { type: String }
    }],
    socialMedia: {
        facebook: { type: String },
        twitter: { type: String },
        linkedin: { type: String },
        instagram: { type: String },
        youtube: { type: String }
    },
    documents: [{
        name: { type: String },
        url: { type: String },
        type: { type: String }
    }],
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("NGO", ngoSchema);