const mongoose = require("mongoose");

const financialProgramSchema = new mongoose.Schema({
    name: { type: String, required: true },
    provider: { type: String, required: true },
    type: { type: String, required: true, enum: ["loan", "grant", "subsidy", "scholarship", "insurance", "pension", "investment", "savings"] },
    category: { type: String, required: true, enum: ["education", "business", "housing", "healthcare", "agriculture", "women", "youth", "senior", "disability", "general"] },
    description: { type: String },
    eligibility: {
        minAge: { type: Number },
        maxAge: { type: Number },
        minIncome: { type: Number },
        maxIncome: { type: Number },
        category: [{ type: String }],
        gender: { type: String },
        location: { type: String },
        employmentStatus: { type: String },
        creditScore: { type: Number },
        otherCriteria: [{ type: String }]
    },
    benefits: {
        amount: {
            min: { type: Number },
            max: { type: Number }
        },
        currency: { type: String, default: "INR" },
        interestRate: { type: Number },
        tenure: {
            min: { type: Number },
            max: { type: Number },
            unit: { type: String, enum: ["months", "years"] }
        },
        subsidyPercentage: { type: Number },
        taxBenefits: [{ type: String }],
        otherBenefits: [{ type: String }]
    },
    repayment: {
        moratoriumPeriod: { type: Number },
        gracePeriod: { type: Number },
        prepaymentCharges: { type: Number },
        processingFee: { type: Number }
    },
    applicationProcess: {
        mode: { type: String, enum: ["online", "offline", "both"] },
        url: { type: String },
        documents: [{ type: String }],
        steps: [{ type: String }],
        timeline: { type: String },
        contactInfo: {
            phone: { type: String },
            email: { type: String },
            address: { type: String }
        }
    },
    isActive: { type: Boolean, default: true },
    launchDate: { type: Date },
    deadline: { type: Date },
    tags: [{ type: String }],
    source: { type: String },
    referenceUrl: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

financialProgramSchema.index({ type: 1, category: 1 });
financialProgramSchema.index({ isActive: 1, deadline: 1 });
financialProgramSchema.index({ name: "text", description: "text" });

module.exports = mongoose.model("FinancialProgram", financialProgramSchema);