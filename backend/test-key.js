// test-key.js
// ✅ Quick script to test if environment variables are loaded properly

// Load environment variables from .env
require("dotenv").config();

// Check if the OpenAI API key is available
console.log("🔑 Loaded key:", process.env.OPENAI_API_KEY ? "Exists ✅" : "Missing ❌");
