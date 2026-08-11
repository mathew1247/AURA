const mongoose = require("mongoose");

const certificationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    issuingOrganization: { type: String, required: true },
    description: { type: String },
    category: { type: String, required: true },
    skills: [{ type: mongoose.Schema.Types.ObjectId, ref: "Skill" }],
    level: { type: String, enum: ["entry", "associate", "professional", "expert", "specialist"] },
    prerequisites: [{ type: String }],
    examDetails: {
        format: { type: String, enum: ["online", "offline", "both"] },
        duration: { type: String },
        passingScore: { type: Number },
        cost: { type: Number },
        currency: { type: String, default: "INR" },
        retakePolicy: { type: String }
    },
    validity: {
        years: { type: Number },
        renewalRequired: { type: Boolean, default: false },
        renewalCost: { type: Number },
        renewalRequirements: [{ type: String }]
    },
    recognition: {
        global: { type: Boolean, default: false },
        countries: [{ type: String }],
        industries: [{ type: String }],
        employers: [{ type: String }]
    },
    careerImpact: {
        salaryIncrease: { type: Number },
        jobRoles: [{ type: String }],
        demandLevel: { type: String, enum: ["low", "medium", "high"] }
    },
    preparationResources: [{
        title: { type: String },
        type: { type: String },
        url: { type: String },
        cost: { type: Number }
    }],
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Certification", certificationSchema);