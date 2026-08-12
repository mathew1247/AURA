const mongoose = require("mongoose");

const onboardingSchema = new mongoose.Schema({
    user_id: { type: String },
    status: { type: String, required: true },
    basic: {
        name: { type: String, required: true },
        age: { type: Number, required: true },
        gender: { type: String },
        state: { type: String, required: true },
        district: { type: String }
    },
    education: {
        level: { type: String },
        degree: { type: String },
        specialization: { type: String },
        current_year: { type: String },
        graduation_year: { type: String }
    },
    employment: {
        role: { type: String },
        experience: { type: String },
        industry: { type: String },
        next_goal: { type: String }
    },
    unemployed: {
        previous_status: { type: String },
        looking_for: [{ type: String }]
    },
    entrepreneur: {
        stage: { type: String },
        support_needed: [{ type: String }]
    },
    career: {
        target_roles: [{ type: String }],
        goals: [{ type: String }]
    },
    skills: [
        {
            name: { type: String },
            status: { type: String }
        }
    ],
    financial: {
        income_range: { type: String }
    },
    preferences: {
        work_location: [{ type: String }],
        work_mode: [{ type: String }],
        learning_mode: [{ type: String }],
        learning_time: { type: String },
        learning_budget: { type: String }
    },
    support_interests: [{ type: String }],
    createdAt: { type: Date, default: Date.now }
}, { strict: false });

module.exports = mongoose.model("Onboarding", onboardingSchema);
