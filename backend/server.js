const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");
const connectDB = require("./config/db");
const Onboarding = require("./models/Onboarding");
const Groq = require("groq-sdk");

// Load env variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Route for root path - serve onboarding.html first
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/onboarding.html"));
});

// Serve frontend static files
app.use(express.static(path.join(__dirname, "../frontend")));

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// Chat completion endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "messages array is required" });
    }

    // Call Groq chat completions API
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: messages,
    });

    const reply = response.choices[0].message;
    res.json({ reply });
  } catch (error) {
    console.error("Groq API Error:", error);
    res.status(500).json({ error: error.message || "An error occurred with Groq API" });
  }
});

// Onboarding details endpoint
app.post("/api/onboarding", async (req, res) => {
  try {
    const profileData = req.body;
    const newOnboarding = new Onboarding(profileData);
    await newOnboarding.save();
    res.status(201).json({ success: true, message: "Onboarding profile saved successfully", data: newOnboarding });
  } catch (error) {
    console.error("Save Onboarding Error:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to save onboarding details" });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ 
    status: "OK", 
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected" 
  });
});

// Fallback route to serve index.html for unmatched GET requests
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
