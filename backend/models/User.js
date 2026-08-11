const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    education: { type: String },
    skills: [{ type: String }],
    location: {
        state: { type: String },
        district: { type: String },
        city: { type: String }
    },
    goals: [{ type: String }],
    role: { type: String, enum: ["user", "admin", "mentor", "ngo"], default: "user" },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

userSchema.index({ email: 1 });
userSchema.index({ "location.state": 1, "location.district": 1 });

module.exports = mongoose.model("User", userSchema);