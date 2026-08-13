const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");
const connectDB = require("./config/db");
const Onboarding = require("./models/Onboarding");
const Subscription = require("./models/Subscription");
const webpush = require("web-push");
const Groq = require("groq-sdk");
const fs = require("fs");

// Load env variables
dotenv.config();

// Configure VAPID Keys for Web Push Notifications
let vapidPublicKey = process.env.VAPID_PUBLIC_KEY || "BGtu3qMMWkvN2B2FJh3OTkg2JJf5eA2Y8hx7DdX8zuMA5qWNXTppbHmqSUArT5dF5W6C4D5GZ4B6dnbyeD3mT_A";
let vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;

if (!vapidPrivateKey) {
  // Generate a fresh matching keypair for VAPID web-push notifications
  const keys = webpush.generateVAPIDKeys();
  vapidPublicKey = keys.publicKey;
  vapidPrivateKey = keys.privateKey;

  try {
    const envPath = path.join(__dirname, ".env");
    fs.appendFileSync(envPath, `\n# Generated VAPID Keys\nVAPID_PUBLIC_KEY=${vapidPublicKey}\nVAPID_PRIVATE_KEY=${vapidPrivateKey}\n`);
    console.log("Generated fresh VAPID Keypair and saved to .env");
  } catch (err) {
    console.error("Failed to save VAPID keys to .env:", err);
  }
}

webpush.setVapidDetails(
  "mailto:support@empowher.tn.gov.in",
  vapidPublicKey,
  vapidPrivateKey
);

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

// Serve frontend static files (supporting clean URLs without .html extension)
app.use(express.static(path.join(__dirname, "../frontend"), { extensions: ["html", "htm"] }));
app.use("/frontend", express.static(path.join(__dirname, "../frontend"), { extensions: ["html", "htm"] }));

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

// GET VAPID public key for frontend clients
app.get("/api/notifications/vapid-key", (req, res) => {
  res.json({ publicKey: vapidPublicKey });
});

// POST Subscribe to notifications
app.post("/api/notifications/subscribe", async (req, res) => {
  try {
    const subscription = req.body;
    if (!subscription || !subscription.endpoint) {
      return res.status(400).json({ error: "Subscription endpoint is required" });
    }

    // Save or update subscription in MongoDB
    await Subscription.findOneAndUpdate(
      { endpoint: subscription.endpoint },
      subscription,
      { upsert: true, new: true }
    );

    res.status(201).json({ success: true, message: "Subscription registered successfully" });
  } catch (err) {
    console.error("Subscription Error:", err);
    res.status(500).json({ error: err.message || "Failed to register subscription" });
  }
});

// POST Send push notification to all subscribers
app.post("/api/notifications/send", async (req, res) => {
  try {
    const { title, body, icon, url } = req.body;
    if (!title || !body) {
      return res.status(400).json({ error: "Title and body are required" });
    }

    const payload = JSON.stringify({
      title,
      body,
      icon: icon || "/assets/logo_empowher.png",
      url: url || "/index.html"
    });

    const subscriptions = await Subscription.find({});
    const pushPromises = subscriptions.map(sub => {
      return webpush.sendNotification(sub, payload)
        .catch(async (err) => {
          // Clean up expired or invalid subscriptions
          if (err.statusCode === 410 || err.statusCode === 404) {
            await Subscription.deleteOne({ endpoint: sub.endpoint });
            console.log(`Cleaned up expired subscription: ${sub.endpoint}`);
          } else {
            console.error(`Push Notification Fail for ${sub.endpoint}:`, err);
          }
        });
    });

    await Promise.all(pushPromises);
    res.json({ success: true, message: `Notification broadcasted to ${subscriptions.length} devices` });
  } catch (err) {
    console.error("Send Notification Error:", err);
    res.status(500).json({ error: err.message || "Failed to send notification" });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ 
    status: "OK", 
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected" 
  });
});

// Fallback route to serve index.html for unmatched GET requests (supporting Single Page Application routing)
app.get("*", (req, res) => {
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
  } else {
    res.status(404).end();
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
