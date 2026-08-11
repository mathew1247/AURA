const mongoose = require("mongoose");

const onboardingSchema = new mongoose.Schema({
    status: { type: String, required: true },
    basic: {
        name: { type: String, required: true },
        age: { type: Number, required: true },
        state: { type: String, required: true },
        city: { type: String, required: true }
    },
    education: {
        level: { type: String },
        degree: { type: String },
        specialization: { type: String },
        currentYear: { type: String },
        graduationYear: { type: String }
    },
    skills: [{ type: String }],
    goal: {
        primary: { type: String },
        targetRole: { type: String }
    },
    preferences: {
        location: { type: String },
        workType: { type: String }
    },
    currentWork: {
        jobTitle: { type: String },
        industry: { type: String },
        experienceYears: { type: String },
        employmentType: { type: String },
        company: { type: String },
        desiredIndustry: { type: String },
        workMode: { type: String }
    },
    workExperience: {
        hasExperience: { type: String },
        previousJobTitle: { type: String },
        previousIndustry: { type: String },
        experienceYears: { type: String },
        previousWorkType: { type: String },
        preferredIndustry: { type: String }
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Onboarding", onboardingSchema);
