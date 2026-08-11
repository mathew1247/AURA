const mongoose = require("mongoose");

const entrepreneurSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    businessName: { type: String, required: true },
    businessType: { type: String, enum: ["sole_proprietorship", "partnership", "llp", "private_limited", "public_limited", "cooperative", "ngo", "startup"] },
    registrationNumber: { type: String },
    gstin: { type: String },
    pan: { type: String },
    industry: { type: String },
    sector: { type: String },
    stage: { type: String, enum: ["idea", "validation", "early_stage", "growth", "mature", "expansion"] },
    description: { type: String },
    mission: { type: String },
    vision: { type: String },
    foundedDate: { type: Date },
    teamSize: { type: Number },
    location: {
        state: { type: String },
        district: { type: String },
        city: { type: String },
        address: { type: String }
    },
    funding: {
        stage: { type: String, enum: ["bootstrapped", "seed", "series_a", "series_b", "series_c", "pre_ipo", "ipo"] },
        totalRaised: { type: Number },
        currency: { type: String, default: "INR" },
        investors: [{
            name: { type: String },
            amount: { type: Number },
            date: { type: Date },
            type: { type: String }
        }]
    },
    revenue: {
        current: { type: Number },
        projected: { type: Number },
        currency: { type: String, default: "INR" },
        model: { type: String }
    },
    products: [{
        name: { type: String },
        description: { type: String },
        category: { type: String },
        stage: { type: String },
        price: { type: Number }
    }],
    skills: [{ type: mongoose.Schema.Types.ObjectId, ref: "Skill" }],
    mentors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Mentor" }],
    incubator: { type: String },
    accelerator: { type: String },
    awards: [{ type: String }],
    patents: [{ type: String }],
    website: { type: String },
    socialMedia: {
        linkedin: { type: String },
        twitter: { type: String },
        facebook: { type: String },
        instagram: { type: String }
    },
    supportNeeded: [{
        type: { type: String, enum: ["funding", "mentorship", "legal", "marketing", "technology", "hr", "operations", "networking"] },
        description: { type: String }
    }],
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Entrepreneur", entrepreneurSchema);