const mongoose = require("mongoose");

const legalResourceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    type: { type: String, required: true, enum: ["act", "rule", "scheme", "judgment", "notification", "circular", "guideline", "form", "template", "faq"] },
    category: { type: String, required: true, enum: ["labor", "consumer", "property", "family", "criminal", "civil", "constitutional", "tax", "corporate", "environmental", "human_rights", "women", "child", "senior_citizen", "disability", "rti", "other"] },
    jurisdiction: { type: String, enum: ["central", "state", "district", "local"], default: "central" },
    state: { type: String },
    description: { type: String },
    summary: { type: String },
    keyProvisions: [{ type: String }],
    applicability: {
        who: [{ type: String }],
        when: { type: String },
        where: { type: String }
    },
    rights: [{ type: String }],
    obligations: [{ type: String }],
    penalties: [{ type: String }],
    forms: [{
        name: { type: String },
        description: { type: String },
        url: { type: String },
        format: { type: String }
    }],
    process: {
        steps: [{ type: String }],
        timeline: { type: String },
        authority: { type: String },
        fees: { type: Number },
        documents: [{ type: String }]
    },
    relatedResources: [{ type: mongoose.Schema.Types.ObjectId, ref: "LegalResource" }],
    schemes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Scheme" }],
    effectiveDate: { type: Date },
    lastAmended: { type: Date },
    isActive: { type: Boolean, default: true },
    language: { type: String, default: "English" },
    source: { type: String },
    referenceUrl: { type: String },
    tags: [{ type: String }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

legalResourceSchema.index({ category: 1, jurisdiction: 1 });
legalResourceSchema.index({ state: 1, category: 1 });
legalResourceSchema.index({ isActive: 1 });
legalResourceSchema.index({ title: "text", description: "text" });

module.exports = mongoose.model("LegalResource", legalResourceSchema);