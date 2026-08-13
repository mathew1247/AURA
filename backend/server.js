const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");
const connectDB = require("./config/db");
const Onboarding = require("./models/Onboarding");
const Groq = require("groq-sdk");
const fs = require("fs");

// Load env variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Route for root path - serve the root router index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../index.html"));
});

// Serve frontend static files
app.use(express.static(path.join(__dirname, "../frontend")));
app.use("/frontend", express.static(path.join(__dirname, "../frontend")));

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

// AI Profile Analysis endpoint using Groq
app.post("/api/analyze-profile", async (req, res) => {
  try {
    const profile = req.body;
    if (!profile) {
      return res.status(400).json({ error: "profile is required" });
    }

    // Load reference JSON files
    const schemesData = JSON.parse(fs.readFileSync(path.join(__dirname, "../frontend/tamil_nadu_schemes.json"), "utf8"));
    const jobsData = JSON.parse(fs.readFileSync(path.join(__dirname, "../frontend/jobs.json"), "utf8"));
    const coursesData = JSON.parse(fs.readFileSync(path.join(__dirname, "../frontend/courses.json"), "utf8"));
    const certsData = JSON.parse(fs.readFileSync(path.join(__dirname, "../frontend/certifications.json"), "utf8"));
    const benefitsData = JSON.parse(fs.readFileSync(path.join(__dirname, "../frontend/tn_financial_benefits.json"), "utf8"));

    const systemPrompt = `You are the Empowher AI Profiler, a specialist in helping women in Tamil Nadu unlock their full personal and professional potential.
Your job is to analyze the user's onboarding profile and match them to the most relevant items from our datasets.

Analyze the user's profile and match it against the following datasets:
1. Government Welfare Schemes
2. Female-Friendly Jobs
3. Skill Development Courses
4. Industry Certifications
5. Financial Benefits

You MUST return a JSON object with the exact structure:
{
  "matchedSchemes": [array of scheme IDs (match the "id" fields from the schemes dataset)],
  "matchedJobs": [array of job IDs (match the "job_id" fields from the jobs dataset)],
  "matchedCourses": [array of course IDs (match the "id" fields from the courses dataset)],
  "skillGaps": [array of skill names (strings) that are required for their target roles but not listed in their known skills list],
  "matchedCertifications": [array of certification IDs (match the "certification_id" fields from the certifications dataset)],
  "matchedBenefits": [array of financial benefit IDs (match the "id" fields from the financial benefits dataset)]
}

DO NOT include any explanation, code blocks, or markdown formatting (like \`\`\`json). Return raw JSON only.`;

    const userPrompt = `USER PROFILE:
${JSON.stringify(profile, null, 2)}

DATASETS:
1. Schemes (Government Welfare):
${JSON.stringify(schemesData.schemes.map(s => ({ id: s.id, name: s.Name, eligibility: s.Eligibility, category: s.Category })), null, 2)}

2. Jobs (Female-Friendly):
${JSON.stringify(jobsData.jobs.map(j => ({ job_id: j.job_id, title: j.title, required_skills: j.required_skills, experience_required: j.experience_required, location: j.location })), null, 2)}

3. Courses (Skill Development):
${JSON.stringify(coursesData.courses.map(c => ({ id: c.id, title: c.title, skills: c.skills, level: c.level, free: c.free })), null, 2)}

4. Certifications:
${JSON.stringify(certsData.certifications.map(c => ({ certification_id: c.certification_id, name: c.name, target_roles: c.target_roles, skills: c.skills })), null, 2)}

5. Financial Benefits:
${JSON.stringify(benefitsData.financial_benefits.map(f => ({ id: f.id, name: f.name, eligibility: f.eligibility, amount: f.amount })), null, 2)}

Perform a strict eligibility check and skills alignment analysis. Identify what they want to achieve and what skills they already have versus what they need. Output the final JSON now.`;

    // Call Groq chat completions API
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.1, // low temperature for precise matches
    });

    const replyText = response.choices[0].message.content.trim();
    // Clean code fences if LLM adds them
    const cleanJSON = replyText.replace(/^```json\s*/, '').replace(/```\s*$/, '').trim();
    
    let result;
    try {
      result = JSON.parse(cleanJSON);
    } catch (parseErr) {
      console.error("Failed to parse Groq response as JSON:", replyText);
      // Fallback matching logic if LLM response fails
      result = {
        matchedSchemes: ["tn-pudhumai-penn"],
        matchedJobs: ["JOB001"],
        matchedCourses: ["C001"],
        skillGaps: ["React.js"],
        matchedCertifications: ["CERT001"],
        matchedBenefits: ["FIN-TN-001"]
      };
    }

    res.json(result);
  } catch (error) {
    console.error("AI Analysis Profile Error:", error);
    res.status(500).json({ error: error.message || "An error occurred during AI analysis" });
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
