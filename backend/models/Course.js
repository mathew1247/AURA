const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    provider: { type: String, required: true },
    description: { type: String },
    category: { type: String, required: true },
    subCategory: { type: String },
    level: { type: String, enum: ["beginner", "intermediate", "advanced", "all_levels"] },
    mode: { type: String, enum: ["online", "offline", "hybrid"] },
    duration: {
        value: { type: Number },
        unit: { type: String, enum: ["hours", "days", "weeks", "months"] }
    },
    curriculum: [{
        module: { type: String },
        topics: [{ type: String }],
        duration: { type: String }
    }],
    prerequisites: [{ type: String }],
    skillsGained: [{ type: String }],
    certification: {
        provided: { type: Boolean, default: false },
        name: { type: String },
        validity: { type: String },
        recognizedBy: [{ type: String }]
    },
    cost: {
        amount: { type: Number, default: 0 },
        currency: { type: String, default: "INR" },
        isFree: { type: Boolean, default: true },
        scholarshipAvailable: { type: Boolean, default: false }
    },
    eligibility: {
        minEducation: { type: String },
        minAge: { type: Number },
        maxAge: { type: Number },
        otherRequirements: [{ type: String }]
    },
    schedule: {
        startDate: { type: Date },
        endDate: { type: Date },
        timings: { type: String },
        timezone: { type: String }
    },
    location: {
        state: { type: String },
        district: { type: String },
        city: { type: String },
        venue: { type: String },
        isOnline: { type: Boolean, default: true }
    },
    instructor: {
        name: { type: String },
        qualifications: { type: String },
        experience: { type: Number }
    },
    ratings: {
        average: { type: Number, default: 0 },
        count: { type: Number, default: 0 }
    },
    enrollmentCount: { type: Number, default: 0 },
    maxEnrollment: { type: Number },
    isActive: { type: Boolean, default: true },
    applicationDeadline: { type: Date },
    tags: [{ type: String }],
    language: { type: String, default: "English" },
    source: { type: String },
    referenceUrl: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

courseSchema.index({ category: 1, level: 1 });
courseSchema.index({ isActive: 1, applicationDeadline: 1 });
courseSchema.index({ title: "text", provider: "text", description: "text" });

module.exports = mongoose.model("Course", courseSchema);