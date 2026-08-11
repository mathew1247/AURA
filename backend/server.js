const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const { Cerebras } = require("@cerebras/cerebras_cloud_sdk");

// Load env variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Cerebras client
const cerebras = new Cerebras({
  apiKey: process.env.CEREBRAS_API_KEY
});

// Chat completion endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "messages array is required" });
    }

        // Call Cerebras chat completions API
    const response = await cerebras.chat.completions.create({
      model: "gpt-oss-120b",
      messages: messages,
    });

    const reply = response.choices[0].message;
    res.json({ reply });
  } catch (error) {
    console.error("Cerebras API Error:", error);
    res.status(500).json({ error: error.message || "An error occurred with Cerebras API" });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ 
    status: "OK", 
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected" 
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
