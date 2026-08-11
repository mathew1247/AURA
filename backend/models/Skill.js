const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    subCategory: { type: String },
    description: { type: String },
    demandLevel: { type: String, enum: ["low", "medium", "high", "critical"], default: "medium" },
    relatedSkills: [{ type: mongoose.Schema.Types.ObjectId, ref: "Skill" }],
    careerPaths: [{ type: String }],
    learningResources: [{
        title: { type: String },
        type: { type: String, enum: ["course", "certification", "book", "video", "article", "bootcamp"] },
        url: { type: String },
        provider: { type: String },
        cost: { type: Number },
        duration: { type: String }
    }],
    averageSalary: {
        entry: { type: Number },
        mid: { type: Number },
        senior: { type: Number },
        currency: { type: String, default: "INR" }
    },
    marketTrend: { type: String, enum: ["growing", "stable", "declining"], default: "stable" },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Skill", skillSchema);