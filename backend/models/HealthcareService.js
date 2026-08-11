const mongoose = require("mongoose");

const healthcareServiceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true, enum: ["hospital", "clinic", "phc", "chc", "diagnostic_center", "pharmacy", "blood_bank", "ambulance", "telemedicine", "wellness_center", "specialty_center"] },
    category: { type: String, enum: ["government", "private", "ngo", "trust", "cooperative"] },
    specialties: [{ type: String }],
    services: [{
        name: { type: String },
        description: { type: String },
        cost: { type: Number },
        currency: { type: String, default: "INR" },
        isFree: { type: Boolean, default: false },
        schemeCovered: [{ type: String }]
    }],
    facilities: [{
        name: { type: String },
        available: { type: Boolean, default: true },
        count: { type: Number }
    }],
    doctors: [{
        name: { type: String },
        specialization: { type: String },
        qualification: { type: String },
        experience: { type: Number },
        consultationFee: { type: Number },
        availability: { type: String }
    }],
    location: {
        state: { type: String, required: true },
        district: { type: String, required: true },
        city: { type: String },
        address: { type: String },
        pincode: { type: String },
        coordinates: {
            latitude: { type: Number },
            longitude: { type: Number }
        }
    },
    contact: {
        phone: { type: String },
        email: { type: String },
        website: { type: String },
        emergencyNumber: { type: String }
    },
    timings: {
        monday: { open: String, close: String, isClosed: Boolean },
        tuesday: { open: String, close: String, isClosed: Boolean },
        wednesday: { open: String, close: String, isClosed: Boolean },
        thursday: { open: String, close: String, isClosed: Boolean },
        friday: { open: String, close: String, isClosed: Boolean },
        saturday: { open: String, close: String, isClosed: Boolean },
        sunday: { open: String, close: String, isClosed: Boolean }
    },
    accreditations: [{ type: String }],
    insurancePanel: [{ type: String }],
    schemesAccepted: [{ type: mongoose.Schema.Types.ObjectId, ref: "Scheme" }],
    ratings: {
        average: { type: Number, default: 0 },
        count: { type: Number, default: 0 }
    },
    accessibility: {
        wheelchairAccessible: { type: Boolean, default: false },
        parkingAvailable: { type: Boolean, default: false },
        publicTransportNearby: { type: Boolean, default: false }
    },
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

healthcareServiceSchema.index({ "location.state": 1, "location.district": 1, type: 1 });
healthcareServiceSchema.index({ specialties: 1 });
healthcareServiceSchema.index({ isActive: 1, isVerified: 1 });

module.exports = mongoose.model("HealthcareService", healthcareServiceSchema);